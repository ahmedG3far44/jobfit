import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { FileText, GitBranch, FileSignature, Settings } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FileText },
  { to: '/resumes', label: 'My Resumes', icon: FileText },
  { to: '/versions', label: 'Resume Versions', icon: GitBranch },
  { to: '/cover-letters', label: 'Cover Letters', icon: FileSignature },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
