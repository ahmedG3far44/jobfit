import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICoverLetter extends Document {
  versionId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const coverLetterSchema = new Schema<ICoverLetter>(
  {
    versionId: { type: Schema.Types.ObjectId, ref: 'ResumeVersion', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CoverLetter = mongoose.model<ICoverLetter>('CoverLetter', coverLetterSchema);
