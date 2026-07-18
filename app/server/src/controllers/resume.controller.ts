import { Response, NextFunction } from 'express';
import { Resume } from '../models/Resume';
import { ResumeVersion } from '../models/ResumeVersion';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import { cloudinaryUpload } from '../utils/cloudinary';
import { extractTextFromFile } from '../services/parser.service';

export const getResumes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    const resumeIds = resumes.map((r) => r._id);
    const versionData = await ResumeVersion.aggregate([
      { $match: { resumeId: { $in: resumeIds } } },
      { $group: { _id: '$resumeId', count: { $sum: 1 }, companies: { $addToSet: '$company' } } },
    ]);
    const dataMap = new Map(versionData.map((vd) => [vd._id.toString(), { count: vd.count, companies: vd.companies }]));
    const result = resumes.map((r) => {
      const d = dataMap.get(r._id.toString());
      return {
        ...r,
        versionCount: d?.count || 0,
        versionCompanies: d?.companies || [],
      };
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, parsedContent: manualContent } = req.body;

    let originalFileUrl = '';
    let parsedContent = manualContent || '';

    if (req.file) {
      const result = await cloudinaryUpload(req.file.path);
      originalFileUrl = result.secure_url;

      if (!parsedContent) {
        try {
          parsedContent = await extractTextFromFile(req.file.path, req.file.originalname);
        } catch {
          console.warn('Failed to extract text from file, using manual input');
        }
      }
    }

    const resume = await Resume.create({
      userId: req.userId,
      title,
      originalFileUrl,
      parsedContent,
    });

    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
};

export const getResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) throw new AppError('Resume not found', 404);

    res.json(resume);
  } catch (err) {
    next(err);
  }
};

export const updateResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!resume) throw new AppError('Resume not found', 404);

    res.json(resume);
  } catch (err) {
    next(err);
  }
};

export const deleteResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) throw new AppError('Resume not found', 404);

    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    next(err);
  }
};
