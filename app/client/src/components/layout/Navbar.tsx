import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  onToggleSidebar?: () => void;
  variant?: 'landing' | 'dashboard';
}

export function Navbar({ onToggleSidebar, variant = 'landing' }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDashboard = variant === 'dashboard';

  return (
    <nav className="border-b">
      <div
        className={
          isDashboard
            ? 'flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'
            : 'mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'
        }
      >
        <div className="flex items-center gap-3">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggleSidebar}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:inline">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
