import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { X, FileText, GitBranch, FileSignature, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FileText },
  { to: '/resumes', label: 'My Resumes', icon: FileText },
  { to: '/versions', label: 'Resume Versions', icon: GitBranch },
  { to: '/cover-letters', label: 'Cover Letters', icon: FileSignature },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r bg-card pt-16 transition-transform duration-200 lg:static lg:inset-auto lg:block lg:pt-0 lg:min-h-[calc(100vh-4rem)]',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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
    </>
  )
}
