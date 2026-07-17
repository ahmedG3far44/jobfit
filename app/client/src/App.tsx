import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { router } from '@/routes'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  )
}
