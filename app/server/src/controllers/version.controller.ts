import { Response, NextFunction } from 'express';
import { ResumeVersion } from '../models/ResumeVersion';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';

export const getVersions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const versions = await ResumeVersion.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(versions);
  } catch (err) {
    next(err);
  }
};

export const getVersion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const version = await ResumeVersion.findOne({ _id: req.params.id, userId: req.userId });
    if (!version) throw new AppError('Version not found', 404);

    res.json(version);
  } catch (err) {
    next(err);
  }
};

export const createVersion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId, name, company, jobTitle, jobDescription, aiContent } = req.body;

    const version = await ResumeVersion.create({
      resumeId,
      userId: req.userId,
      name,
      company,
      jobTitle,
      jobDescription,
      aiContent,
    });

    res.status(201).json(version);
  } catch (err) {
    next(err);
  }
};

export const updateVersion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const version = await ResumeVersion.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!version) throw new AppError('Version not found', 404);

    res.json(version);
  } catch (err) {
    next(err);
  }
};

export const deleteVersion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const version = await ResumeVersion.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!version) throw new AppError('Version not found', 404);

    res.json({ message: 'Version deleted successfully' });
  } catch (err) {
    next(err);
  }
};
