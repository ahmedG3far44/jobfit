import mongoose, { Schema, Document, Types } from 'mongoose';

export type VersionStatus =
  | 'Application Viewed'
  | 'Shortlisted'
  | 'HR Screening'
  | 'Recruiter Call'
  | 'Online Assessment'
  | 'Home Task'
  | 'Technical Interview 1'
  | 'Technical Interview 2'
  | 'System Design Interview'
  | 'Hiring Manager Interview'
  | 'Final Interview'
  | 'Reference Check'
  | 'Offer Extended'
  | 'Offer Accepted'
  | 'No Response'
  | 'Rejected'
  | 'Offer Declined'
  | 'Withdrawn'
  | 'Hired';

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
        'Application Viewed',
        'Shortlisted',
        'HR Screening',
        'Recruiter Call',
        'Online Assessment',
        'Home Task',
        'Technical Interview 1',
        'Technical Interview 2',
        'System Design Interview',
        'Hiring Manager Interview',
        'Final Interview',
        'Reference Check',
        'Offer Extended',
        'Offer Accepted',
        'No Response',
        'Rejected',
        'Offer Declined',
        'Withdrawn',
        'Hired',
      ],
      default: 'Application Viewed',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', resumeVersionSchema);
