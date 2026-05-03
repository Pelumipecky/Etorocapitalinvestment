import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/context/AuthContext'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()
  
  // Get user initials
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <header className="bg-[#131722] border-b border-[rgba(255,255,255,0.05)] px-5 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-white hover:text-[#F0B90B] transition-colors p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Desktop Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F0B90B] rounded-full"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F0B90B] flex items-center justify-center text-[#0d0d0d] font-bold text-sm">
              {user?.email ? getInitials(user.email) : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
