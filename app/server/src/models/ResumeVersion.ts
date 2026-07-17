import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResumeVersion extends Document {
  resumeId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  aiContent: string;
  createdAt: Date;
}

const resumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    aiContent: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', resumeVersionSchema);
