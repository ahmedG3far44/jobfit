import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { fitResume, fitResumeA4 } from '../services/ai.service';
import { generateCoverLetter } from '../services/cover-letter.service';
import { Resume } from '../models/Resume';
import { AppError } from '../middlewares/errorHandler';

export const fitResumeHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId, jobDescription, customInstructions, a4Optimized } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) throw new AppError('Resume not found', 404);

    const aiContent = a4Optimized
      ? await fitResumeA4(resume.parsedContent, jobDescription, customInstructions)
      : await fitResume(resume.parsedContent, jobDescription, customInstructions);

    res.json({ aiContent });
  } catch (err) {
    next(err);
  }
};

export const coverLetterHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeContent, jobDescription, company, jobTitle, style } = req.body;

    const content = await generateCoverLetter(resumeContent, jobDescription, company, jobTitle, style);

    res.json({ content });
  } catch (err) {
    next(err);
  }
};
