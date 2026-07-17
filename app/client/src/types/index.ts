export type ContactType = 'linkedin' | 'github' | 'portfolio' | 'behance' | 'other'

export interface ContactLink {
  type: ContactType
  value: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  profilePicture: string
  contacts: ContactLink[]
  globalLocation: string
  localLocation: string
}

export interface Resume {
  _id: string
  userId: string
  title: string
  originalFileUrl: string
  parsedContent: string
  createdAt: string
}

export interface ResumeVersion {
  _id: string
  resumeId: string
  userId: string
  name: string
  company: string
  jobTitle: string
  jobDescription: string
  aiContent: string
  createdAt: string
}

export interface CoverLetter {
  _id: string
  versionId: string
  userId: string
  content: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}
