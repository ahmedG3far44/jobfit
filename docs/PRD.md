PRD – ResumeFit AI (MVP)
1. Product Overview
Product Name

ResumeFit AI

Vision

Help job seekers create ATS-friendly, tailored resumes and cover letters in minutes by generating AI-optimized versions of their existing resumes for each job application.

2. Problem

Job seekers spend hours manually editing their resume for every application.

They need to:

Match ATS keywords
Highlight relevant experience
Create customized cover letters
Keep multiple resume versions organized

Most people either:

Send the same resume everywhere
Lose track of different resume versions
Spend too much time editing.
3. MVP Goal

Allow users to:

Upload one or more master resumes.
Generate AI-tailored versions based on a Job Description.
Compare original vs optimized resume.
Save multiple resume versions.
Generate a matching cover letter.
Export resumes.
4. User Flow
Landing Page

↓

Register / Login

↓

Onboarding

↓

Upload First Resume

↓

Dashboard

↓

Create Resume Version

↓

Choose Master Resume

↓

Paste Job Description

↓

Click "Fit Resume"

↓

AI Generates Tailored Resume

↓

Preview Comparison

Original Resume
        VS
Optimized Resume

↓

Confirm

↓

Save Version

↓

(Optional)

Generate Cover Letter

↓

Export PDF / DOCX
5. Core Features (MVP)
Authentication
Register
Login
Logout
Resume Management

Users can upload multiple master resumes.

Example:

Frontend Developer Resume

Backend Developer Resume

Software Engineer Resume

Product Manager Resume

Each resume has:

Title
Original File
Parsed Content
Date Created
Resume Versioning

Every master resume can have unlimited versions.

Example

Frontend Resume

├── Google Version
├── Amazon Version
├── Meta Version
├── Stripe Version

Each version stores

Version Name
Job Title
Company
Job Description
AI Generated Resume
Date
AI Resume Fit

Input

Master Resume

+

Job Description

Output

Optimized Resume

AI should

Match ATS keywords
Rewrite bullet points
Improve wording
Prioritize relevant experience
Keep truthful information
Never invent experience
Resume Comparison

Split view

Before

-------------------

Original Resume


After

-------------------

Optimized Resume

Buttons

Accept

Edit

Discard
Resume Editor

Simple editor

Allow editing

Summary
Skills
Experience
Projects
Education
Cover Letter Generator

After accepting resume

Button

Generate Cover Letter

Input

Optimized Resume

+

Job Description

Output

Company-specific cover letter.

Dashboard

Dashboard contains

Master Resumes
Frontend Resume

Backend Resume

Fullstack Resume
Resume Versions

Recent versions

Google Resume

Microsoft Resume

Meta Resume

Stripe Resume
Cover Letters

Generated letters

6. Pages
Landing Page

Sections

Hero
Features
Pricing (Coming Soon)
FAQ
CTA
Authentication
Login
Register
Onboarding

Only first login

Step

Upload first resume.

Dashboard

Contains

Sidebar

My Resumes

Resume Versions

Cover Letters

Settings
Resume Details

Displays

Master Resume

Versions

Create Version button

Create Version

Step 1

Choose Resume

↓

Step 2

Paste Job Description

↓

Fit Resume

↓

Preview

↓

Save

↓

Generate Cover Letter

Resume Preview

Two-column layout

Original Resume

Optimized Resume
Resume Editor

Editable version.

Cover Letter Preview

Preview

Edit

Export

7. Database Design
Users
{
  _id,

  name,

  email,

  password,

  createdAt
}
Resumes
{
  _id,

  userId,

  title,

  originalFileUrl,

  parsedContent,

  createdAt
}
Resume Versions
{
  _id,

  resumeId,

  userId,

  company,

  jobTitle,

  jobDescription,

  aiContent,

  createdAt
}
Cover Letters
{
  _id,

  versionId,

  content,

  createdAt
}
8. API Routes
Auth
POST /auth/register

POST /auth/login

POST /auth/logout

GET /auth/me
Resume
GET /resumes

POST /resumes

GET /resumes/:id

PATCH /resumes/:id

DELETE /resumes/:id
Resume Versions
GET /versions

POST /versions

GET /versions/:id

PATCH /versions/:id

DELETE /versions/:id
AI
POST /ai/fit-resume

POST /ai/cover-letter
9. AI Workflow
Resume Fit

Input

Master Resume

+

Job Description

Prompt

Analyze the resume and the job description.

Rewrite the resume to maximize ATS compatibility.

Preserve factual information.

Improve wording.

Use keywords naturally.

Never fabricate experience.

Return structured resume sections.
Cover Letter

Input

Optimized Resume

+

Job Description

Prompt

Write a professional cover letter.

Personalize it for the company.

Reference the job title.

Highlight the candidate's most relevant experience.

Keep it concise.
10. Tech Stack
Frontend
React 19
TypeScript
Vite
TailwindCSS
shadcn/ui
React Router
Native Fetch API (no Axios)
React Hook Form
Zod
Backend
Express
TypeScript
MongoDB
Mongoose
JWT Authentication
Multer (resume uploads)
OpenAI or compatible LLM API
PDF/DOCX export libraries
Storage
Local storage (development)
S3-compatible object storage (production)
11. Folder Structure
Frontend
src/
│
├── app/
├── pages/
│   ├── Landing/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Resume/
│   ├── Version/
│   └── Settings/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── resume/
│   └── common/
│
├── hooks/
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
│
├── services/
├── types/
└── routes/
Backend
src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
│   ├── ai/
│   ├── resume/
│   └── cover-letter/
├── utils/
├── validators/
└── app.ts
12. MVP Success Metrics
Users successfully upload at least one master resume.
Users create one or more tailored resume versions.
AI-generated resumes are accepted and exported.
Users generate cover letters after fitting a resume.
Resume versions remain organized and reusable for future applications.