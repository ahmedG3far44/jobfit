# ResumeFit AI — MVP Tasks

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Monorepo
- [x] Create root `package.json` with workspaces
- [x] Set up `.gitignore` (node_modules, .env, uploads, dist)
- [x] Configure TypeScript for both frontend and backend
- [x] Set up ESLint + Prettier config

### 1.2 Backend Scaffold
- [x] Initialize Express + TypeScript server
- [x] Set up folder structure
- [x] Configure environment variables with `.env` and validation
- [x] Set up MongoDB connection with Mongoose
- [x] Set up CORS, JSON body parser, error handling middleware
- [x] Create `app.ts` entry point with route mounting

### 1.3 Frontend Scaffold
- [x] Initialize Vite + React 19 + TypeScript project
- [x] Set up TailwindCSS and configure theme
- [x] Install and configure shadcn/ui base components
- [x] Set up React Router with route definitions
- [x] Set up folder structure
- [x] Create base layout (App shell with header/footer)
- [x] Set up React Hook Form + Zod for forms

### 1.4 Shared Types
- [x] Define TypeScript interfaces for User, Resume, ResumeVersion, CoverLetter
- [x] Define API request/response types

---

## Phase 2: Authentication

### 2.1 Backend — Auth API
- [x] Create User model
- [x] Create auth validation schemas (register, login)
- [x] Implement `POST /auth/register` — hash password, create user, return JWT
- [x] Implement `POST /auth/login` — verify credentials, return JWT
- [x] Implement `POST /auth/logout` — invalidate token (client-side)
- [x] Implement `GET /auth/me` — return current user from JWT
- [x] Create JWT middleware for protected routes

### 2.2 Frontend — Auth UI
- [x] Build Login page (email + password form)
- [x] Build Register page (name + email + password form)
- [x] Build auth context/store (manage JWT, user state)
- [x] Implement API service layer for auth endpoints
- [x] Persist JWT in localStorage
- [x] Add protected route wrapper component
- [x] Handle auth errors (toast notifications)

### 2.3 Onboarding Flow
- [x] Detect first login and redirect to onboarding
- [x] Build onboarding step UI: upload first resume
- [x] On completion, redirect to Dashboard

---

## Phase 3: Resume Management

### 3.1 Backend — Resume API
- [x] Create Resume model
- [x] Configure Multer for file uploads (PDF, DOCX)
- [x] Implement `POST /resumes` — upload file, store locally/S3, parse content
- [x] Implement `GET /resumes` — list user's master resumes
- [x] Implement `GET /resumes/:id` — get single resume details
- [x] Implement `PATCH /resumes/:id` — update title/metadata
- [x] Implement `DELETE /resumes/:id` — remove resume + file

### 3.2 Frontend — Resume Upload & List
- [x] Build "Upload Resume" page/component with drag-and-drop
- [x] Build resume list view (cards)
- [x] Build resume detail view (show parsed content)
- [x] Add loading states, skeletons, and error handling for uploads
- [x] Add delete confirmation dialog

### 3.3 Resume Versioning Model
- [x] Create ResumeVersion model
- [x] Implement `POST /versions` — create new version from AI output
- [x] Implement `GET /versions` — list versions
- [x] Implement `GET /versions/:id` — get single version
- [x] Implement `PATCH /versions/:id` — update version metadata
- [x] Implement `DELETE /versions/:id` — delete version

---

## Phase 4: AI Integration

### 4.1 AI Service Layer (Backend)
- [x] Create AI service abstraction (OpenAI-compatible API)
- [x] Implement `POST /ai/fit-resume` endpoint
  - Input: master resume content + job description
  - Prompt engineering: ATS optimization, keyword matching, truthful rewriting
  - Parse response into structured resume sections (summary, skills, experience, projects, education)
- [x] Implement `POST /ai/cover-letter` endpoint
  - Input: optimized resume content + job description
  - Prompt engineering: professional cover letter, company personalization, concise format
- [x] Add AI response validation and fallback handling

### 4.2 "Fit Resume" Feature
- [x] Build "Create Version" flow (Choose Resume → Paste Job Description → Fit Resume)
- [x] Show loading state during AI processing (spinner/progress)
- [x] Handle AI errors gracefully (retry button, error message)

---

## Phase 5: Resume Comparison & Editor

### 5.1 Comparison View
- [x] Build split-view comparison layout (Original vs Optimized)
- [x] Display parsed sections side-by-side (Summary, Skills, Experience, Projects, Education)
- [x] Add visual diff highlighting (added/changed content)

### 5.2 Resume Actions
- [x] "Accept" button — save AI output as a new version
- [x] "Edit" button — open resume editor with AI output pre-filled
- [x] "Discard" button — return to previous step

### 5.3 Resume Editor
- [x] Build inline editor for resume sections
- [x] Editable fields: Summary, Skills, Experience, Projects, Education
- [x] Save edits to version
- [x] Cancel editing without saving

---

## Phase 6: Cover Letter Generation

### 6.1 Backend — Cover Letter
- [x] Create CoverLetter model
- [x] Implement `POST /ai/cover-letter`

### 6.2 Frontend — Cover Letter UI
- [x] Add "Generate Cover Letter" button on accepted version
- [x] Show cover letter preview (formatted text)
- [x] Add cover letter editor (discard/regenerate)
- [x] Regenerate cover letter option
- [x] Cover Letters page (`/cover-letters`) with list, copy, regenerate, delete

---

## Phase 7: Dashboard & Navigation

### 7.1 Dashboard Layout
- [x] Build sidebar navigation (My Resumes, Resume Versions, Cover Letters, Settings)
- [x] Build dashboard home with summary cards
  - Total master resumes
  - Recent versions
  - Recent cover letters
- [x] Responsive layout

### 7.2 Dashboard Pages
- [x] "My Resumes" page — list of master resumes + upload button
- [x] "Resume Versions" page — list of all versions across resumes
- [x] "Cover Letters" page — list of generated cover letters with copy/regenerate/delete
- [x] "Settings" page — profile info and theme toggle

---

## Phase 8: Export & Polish

### 8.1 Export Functionality
- [x] Implement PDF export (browser print-to-PDF)
- [x] Implement text copy
- [x] Add export buttons on resume version page and cover letter page
- [x] Handle export loading states

### 8.2 Landing Page
- [x] Build Hero section (headline, CTA)
- [x] Build Features section (key value props)
- [x] Build FAQ section (accordion)
- [x] Build Pricing section with "Coming Soon" badge
- [x] Build CTA section (signup prompt)

### 8.3 Final Polish
- [x] Add toast notifications for all CRUD operations
- [x] Add loading skeletons for all data-fetching pages
- [x] Handle empty states (no resumes yet, no versions yet)
- [x] Add error boundaries
- [x] Add delete confirmation dialogs
- [x] Add form validation (inline error messages)
- [x] Write seed script for local development

---

## Phase 9: Production Readiness

### 9.1 Deployment
- [ ] Configure production environment variables
- [ ] Set up S3-compatible storage for file uploads
- [ ] Build frontend for production (`vite build`)
- [ ] Set up backend production server (PM2 or Docker)
- [ ] Set up CI/CD pipeline

### 9.2 Testing
- [ ] Write backend unit tests for auth, resume, version endpoints
- [ ] Write backend unit tests for AI service
- [ ] Write frontend integration tests for critical flows
- [ ] Run full regression before launch

---
