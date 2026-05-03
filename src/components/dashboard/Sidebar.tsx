import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: string
  adminOnly?: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', key: 'dashboard' },
  { name: 'Investments', href: '/dashboard/investments', icon: '💼', key: 'investments' },
  { name: 'Wallet', href: '/dashboard/wallet', icon: '💰', key: 'wallet' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: '📝', key: 'transactions' },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: '📈', key: 'portfolio' },
  { name: 'Support', href: '/dashboard/support', icon: '💬', key: 'support' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤', key: 'profile' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', key: 'settings' },
  { name: 'Admin', href: '/dashboard/admin', icon: '👨‍💼', key: 'admin', adminOnly: true },
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Overlay - Only show when sidebar is open on mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        h-screen w-60 sm:w-64 bg-surface border-r border-border overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-border flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-accent truncate">eToro Trust Capital</h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1 truncate">Investment Dashboard</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => {
                // Check if item is admin-only and user does not have admin role
                const userStr = localStorage.getItem('activeUser') || sessionStorage.getItem('activeUser')
                const user = userStr ? JSON.parse(userStr) : null
                if (item.adminOnly && user?.role !== 'admin' && user?.role !== 'superadmin') return null

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg
                        transition-all duration-200 text-sm sm:text-base
                        ${isActive 
                          ? 'bg-accent text-background font-semibold' 
                          : 'text-text hover:bg-accent/10 hover:text-accent'
                        }
                      `}
                      onClick={onClose}
                    >
                      <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
                      <span className="hidden sm:inline">{t(`dashboard.${item.key}`)}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          {/* Language Switcher */}
          <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
            <LanguageSwitcher variant="dashboard" />
          </div>
          
          {/* Logout */}
          <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 w-full rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl flex-shrink-0">🚪</span>
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
