import mongoose, { Schema, Document, Types } from 'mongoose';

export type VersionStatus =
  | 'applied'
  | 'screen interview'
  | 'technical interview'
  | 'assigned task'
  | 'assigned assessment'
  | 'HR interview'
  | 'tech interview -2'
  | 'last interview'
  | 'job offer'
  | 'hired'
  | 'rejected';

export interface IResumeVersion extends Document {
  resumeId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  aiContent: string;
  status: VersionStatus;
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
    status: {
      type: String,
      enum: [
        'applied',
        'screen interview',
        'technical interview',
        'assigned task',
        'assigned assessment',
        'HR interview',
        'tech interview -2',
        'last interview',
        'job offer',
        'hired',
        'rejected',
      ],
      default: 'applied',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', resumeVersionSchema);
