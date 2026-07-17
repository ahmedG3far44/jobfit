import mongoose, { Schema, Document } from 'mongoose';

export interface IContactLink {
  type: 'linkedin' | 'github' | 'portfolio' | 'behance' | 'other';
  value: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture: string;
  contacts: IContactLink[];
  globalLocation: string;
  localLocation: string;
  createdAt: Date;
}

const contactLinkSchema = new Schema<IContactLink>(
  {
    type: { type: String, enum: ['linkedin', 'github', 'portfolio', 'behance', 'other'], required: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    contacts: { type: [contactLinkSchema], default: [] },
    globalLocation: { type: String, default: '' },
    localLocation: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
