<div align="center">
  <img src="./app/client/src/assets/hero.png" alt="ResumeFit AI" width="120" />
  <h1>ResumeFit AI</h1>
  <p>ATS-friendly, tailored resumes and cover letters in minutes.</p>
</div>

---

## Overview

ResumeFit AI helps job seekers create optimized, ATS-friendly resumes and cover letters tailored to specific job descriptions. Upload a master resume, paste a job description, and the AI generates an optimized version — preserving factual information while improving keyword matching, wording, and relevance.

---

## Tech Stack

### Backend (`app/server`)
| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Multer + Cloudinary | File upload & cloud storage |
| PDFKit + docx | PDF & DOCX export |
| pdf-parse + mammoth | PDF & DOCX text extraction |
| OpenRouter API | AI / LLM provider |

### Frontend (`app/client`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Language |
| Vite | Build tool |
| TailwindCSS v4 | Styling |
| React Router v7 | Client-side routing |
| react-hook-form + zod | Form validation |
| lucide-react | Icons |

---

## Features

### Authentication
- Register, login, logout with JWT-based sessions (7-day expiry)
- Profile management: name, phone, email, profile picture
- Contact links: LinkedIn, GitHub, Portfolio, Behance, Other
- Location settings: global (country) and local (city)
- Input validation and error handling

### Resume Management
- Upload master resumes (PDF, DOCX, DOC — max 5MB)
- Manual resume creation by pasting content
- Auto text extraction from uploaded files
- List, view, update, and delete resumes
- Drag-and-drop file upload with type validation
- Loading skeletons, empty states, and error handling

### AI Resume Optimization ("Fit Resume")
- Optimize a master resume for any job description
- AI rewrites bullet points with natural ATS keyword integration
- Preserves all factual information — never invents experience
- Maintains original section structure and order
- Optional custom instructions for further tailoring
- Powered by OpenRouter API (configurable model)

### Resume Versioning
- Create unlimited tailored versions per master resume
- Each version stores: company name, job title, job description, AI content
- List, view, update, and delete versions
- Organized by target company/role

### Resume Comparison
- Side-by-side split view: original vs. AI-optimized
- Section-by-section display (Summary, Skills, Experience, Projects, Education)
- Word-level diff highlighting (added/changed words)

### Resume Editor
- Inline section-by-section editing
- Sections: Contact, Summary, Skills, Experience, Projects, Education
- Contact info auto-populated from user profile
- Edit/Save/Cancel per section with pencil icon toggle

### Cover Letter Generator
- Generate company-specific cover letters from optimized resumes
- 6 writing styles: Professional, Confident, Enthusiastic, Direct, Storytelling, Warm
- Generate, regenerate, copy to clipboard, edit inline, delete
- 3–4 paragraph format personalized to job and company

### Export
- **PDF export** with 4 templates: Minimal, Modern, Classic, Compact
- Visual template preview in modal before download
- **DOCX export** with proper section headers and formatting
- Copy to clipboard for quick pasting

### Dashboard
- Summary cards: total resumes, versions, cover letters
- Recent resumes list with type badges (File/Text)
- Recent versions list with company and job title
- Quick action buttons
- Empty states with helpful guidance

### Landing Page
- Hero section with CTA
- Features showcase
- Pricing section ("Coming Soon")
- FAQ accordion
- Final CTA section

### Onboarding Flow
- 3-step wizard: Welcome → Upload Resume → Done
- Step indicators with checkmarks
- Skip logic if user already has resumes
- Redirect to dashboard on completion

### Settings
- Edit name, phone (with country code selector), email (read-only)
- Profile picture upload with camera icon overlay and preview
- Contact links: add/remove dynamic URL list
- Location: global country dropdown + local city/country
- Appearance: light/dark mode toggle

### Theme System
- Light and dark mode with CSS custom properties
- Persisted in localStorage
- Defaults to system preference via `prefers-color-scheme`
- Toggle from navbar and settings page

### UI Components
- Badge, Button, Card, Input, Label, Select, Separator, Textarea
- Loading skeletons (CardSkeleton, TableSkeleton, DetailSkeleton)
- Confirm dialogs for destructive actions
- ErrorBoundary with reload capability
- Toast notifications (success, error, info) with auto-dismiss

---

## Project Structure

```
jobfit/
├── app/
│   ├── server/                     # Backend
│   │   └── src/
│   │       ├── index.ts            # Entry point
│   │       ├── configs/            # DB & env config
│   │       ├── controllers/        # Route handlers
│   │       ├── middlewares/        # Auth, error, upload
│   │       ├── models/             # Mongoose schemas
│   │       ├── routes/             # API route definitions
│   │       ├── services/           # AI, parser, PDF generation
│   │       ├── utils/              # Cloudinary, helpers
│   │       ├── validators/         # Input validation
│   │       └── scripts/            # Seed script
│   │
│   └── client/                     # Frontend
│       └── src/
│           ├── main.tsx            # Entry point
│           ├── App.tsx             # Root component
│           ├── routes/             # Route definitions
│           ├── pages/              # Page components
│           ├── components/         # UI, layout, resume components
│           ├── context/            # Auth, Theme, Toast
│           ├── lib/                # API client, helpers, validations
│           ├── types/              # TypeScript interfaces
│           └── assets/             # Images
│
├── docs/
│   ├── PRD.md                      # Product requirements
│   └── Tasks.md                    # MVP task tracking
└── README.md
```

---

## API Endpoints

### Auth `/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/me` | Yes | Get current user profile |
| PUT | `/auth/profile` | Yes | Update profile |
| POST | `/auth/profile/picture` | Yes | Upload profile picture |

### Resumes `/resumes`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/resumes` | List all master resumes |
| POST | `/resumes` | Create resume (file or manual) |
| GET | `/resumes/:id` | Get single resume |
| PATCH | `/resumes/:id` | Update resume |
| DELETE | `/resumes/:id` | Delete resume |

### Versions `/versions`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/versions` | List all versions |
| POST | `/versions` | Create version |
| GET | `/versions/:id` | Get single version |
| PATCH | `/versions/:id` | Update version |
| DELETE | `/versions/:id` | Delete version |

### AI `/ai`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/fit-resume` | AI-optimize resume for a job |
| POST | `/ai/cover-letter` | Generate cover letter |

### Export `/export`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/export/pdf` | Export resume as PDF |
| POST | `/export/docx` | Export resume as DOCX |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |

---

## Database Schema

### Users
```
name, email, password (hashed), phone, profilePicture,
contacts[{type, value}], globalLocation, localLocation
```

### Resumes
```
userId (ref), title, originalFileUrl, parsedContent
```

### ResumeVersions
```
resumeId (ref), userId (ref), name, company, jobTitle,
jobDescription, aiContent
```

### CoverLetters
```
versionId (ref), userId (ref), content
```

---

## Frontend Routes

| Path | Page | Auth |
|---|---|---|
| `/` | LandingPage | — |
| `/auth/login` | LoginPage | — |
| `/auth/register` | RegisterPage | — |
| `/onboarding` | OnboardingPage | Yes |
| `/dashboard` | DashboardPage | Yes |
| `/resumes` | ResumeListPage | Yes |
| `/resumes/new` | ResumeUploadPage | Yes |
| `/resumes/:id` | ResumeDetailPage | Yes |
| `/resumes/:id/create-version` | CreateVersionPage | Yes |
| `/versions` | VersionListPage | Yes |
| `/versions/:id` | VersionDetailPage | Yes |
| `/cover-letters` | CoverLettersPage | Yes |
| `/settings` | SettingsPage | Yes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (running locally on port 27017)
- OpenRouter API key
- Cloudinary account (for file uploads)

### Backend Setup

```bash
cd app/server
cp .env.example .env        # Configure your environment variables
npm install
npm run dev                 # Starts on http://localhost:3000
```

### Frontend Setup

```bash
cd app/client
npm install
npm run dev                 # Starts on http://localhost:5173
```

### Seed Database

```bash
cd app/server
npx tsx src/scripts/seed.ts
# Creates test user: test@example.com / password123
```

---

## Environment Variables (`app/server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | AI model (e.g. `tencent/hy3:free`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Scripts

### Backend
| Script | Command |
|---|---|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm run start` |
| Seed | `npm run seed` |

### Frontend
| Script | Command |
|---|---|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Preview | `npm run preview` |

---

## AI Workflow

### Resume Fit
1. User uploads a master resume (or creates one manually)
2. User pastes a job description
3. User clicks "Fit Resume"
4. AI analyzes both and returns an optimized version that:
   - Matches ATS keywords naturally
   - Rewrites bullet points for impact
   - Prioritizes relevant experience
   - Preserves all factual information
5. User can compare original vs. optimized side-by-side
6. User edits, confirms, and saves the version

### Cover Letter
1. From an optimized resume version, user clicks "Generate Cover Letter"
2. User selects a writing style (Professional, Confident, etc.)
3. AI generates a 3–4 paragraph personalized cover letter
4. User can regenerate, edit, copy, or export

---

## Export Templates

| Template | Style |
|---|---|
| Minimal | Clean, simple, monochrome |
| Modern | Accent colors, spaced layout |
| Classic | Traditional serif, formal |
| Compact | Dense, single-page optimized |

---

## License

ISC
