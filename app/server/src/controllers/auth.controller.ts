import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { User, type IContactLink } from '../models/User';
import { env } from '../configs/env';
import { AppError } from '../middlewares/errorHandler';
import { cloudinaryUploadImage } from '../utils/cloudinary';

function userResponse(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    profilePicture: user.profilePicture || '',
    contacts: user.contacts || [],
    globalLocation: user.globalLocation || '',
    localLocation: user.localLocation || '',
  };
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already in use', 409);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) throw new AppError('User not found', 404);

    res.json({ user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request & { userId?: string }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, contacts, globalLocation, localLocation } = req.body;

    const update: any = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (contacts !== undefined) update.contacts = contacts;
    if (globalLocation !== undefined) update.globalLocation = globalLocation;
    if (localLocation !== undefined) update.localLocation = localLocation;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    if (!user) throw new AppError('User not found', 404);

    res.json({ user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

export const uploadProfilePicture = async (req: Request & { userId?: string }, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const result = await cloudinaryUploadImage(req.file.path);
    fs.unlink(req.file.path, () => {});

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password');
    if (!user) throw new AppError('User not found', 404);

    res.json({ user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
};
