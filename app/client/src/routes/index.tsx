import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/Landing/LandingPage'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { RegisterPage } from '@/pages/Auth/RegisterPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { ResumeListPage } from '@/pages/Resume/ResumeListPage'
import { ResumeDetailPage } from '@/pages/Resume/ResumeDetailPage'
import { ResumeUploadPage } from '@/pages/Resume/ResumeUploadPage'
import { CreateVersionPage } from '@/pages/Version/CreateVersionPage'
import { VersionListPage } from '@/pages/Version/VersionListPage'
import { VersionDetailPage } from '@/pages/Version/VersionDetailPage'
import { SettingsPage } from '@/pages/Settings/SettingsPage'
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage'
import { CoverLettersPage } from '@/pages/CoverLetters/CoverLettersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/resumes', element: <ResumeListPage /> },
      { path: '/resumes/new', element: <ResumeUploadPage /> },
      { path: '/resumes/:id', element: <ResumeDetailPage /> },
      { path: '/resumes/:id/create-version', element: <CreateVersionPage /> },
      { path: '/versions', element: <VersionListPage /> },
      { path: '/versions/:id', element: <VersionDetailPage /> },
      { path: '/cover-letters', element: <CoverLettersPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
])
