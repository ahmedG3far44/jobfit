import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  originalFileUrl: string;
  parsedContent: string;
  createdAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    originalFileUrl: { type: String, required: true },
    parsedContent: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
