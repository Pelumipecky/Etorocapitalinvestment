import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabaseAuth, UserRecord } from '@/lib/supabaseUtils'
import { UserRole, getDashboardRoute, hasPermission as checkPerm, hasRoleLevel as checkRoleLevel, UserPermissions } from '@/utils/roles'

const SESSION_TIMEOUT_MS = 20 * 60 * 1000
const SESSION_EXPIRY_KEY = 'sessionExpiresAt'

interface User {
  email: string
  name?: string
  userName?: string
  role: UserRole
  idnum?: string
  balance?: number
  bonus?: number
  referralCount?: number
  avatar?: string
  completedTrades?: number
  phoneNumber?: string
  address?: string
  city?: string
  country?: string
  referralCode?: string
  referralBonusTotal?: number
  id?: string
  authStatus?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>
  signup: (email: string, password: string, userData?: Partial<UserRecord>) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  loading: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

const mapRecordToSessionUser = (record: Partial<UserRecord>): User => ({
  email: record.email || '',
  name: record.name,
  userName: record.userName,
  role: (record.role || 'user') as UserRole,
  id: record.id,
  idnum: record.idnum,
  balance: record.balance,
  bonus: record.bonus,
  referralCount: record.referralCount,
  avatar: record.avatar,
  completedTrades: record.completedTrades,
  phoneNumber: record.phoneNumber,
  address: record.address,
  city: record.city,
  country: record.country,
  referralCode: record.referralCode || undefined,
  referralBonusTotal: record.referralBonusTotal,
  authStatus: record.authStatus || undefined,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const lastActivityRefreshRef = useRef(0)

  const clearStoredSession = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('activeUser')
    localStorage.removeItem('adminData')
    localStorage.removeItem('adminSession')
    localStorage.removeItem(SESSION_EXPIRY_KEY)
    sessionStorage.removeItem('activeUser')
    sessionStorage.removeItem('adminData')
    sessionStorage.removeItem('adminSession')
    sessionStorage.removeItem(SESSION_EXPIRY_KEY)
  }

  const refreshSessionExpiry = (role?: UserRole) => {
    const expiresAt = Date.now() + SESSION_TIMEOUT_MS
    const serializedExpiry = String(expiresAt)

    localStorage.setItem(SESSION_EXPIRY_KEY, serializedExpiry)
    sessionStorage.setItem(SESSION_EXPIRY_KEY, serializedExpiry)

    if (role === 'admin' || role === 'superadmin') {
      const adminSession = JSON.stringify({ expiresAt })
      localStorage.setItem('adminSession', adminSession)
      sessionStorage.setItem('adminSession', adminSession)
    }
  }

  const persistSession = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('activeUser', JSON.stringify(userData))
    sessionStorage.setItem('activeUser', JSON.stringify(userData))

    if (userData.role === 'admin' || userData.role === 'superadmin') {
      const adminData = JSON.stringify(userData)
      localStorage.setItem('adminData', adminData)
      sessionStorage.setItem('adminData', adminData)
    } else {
      localStorage.removeItem('adminData')
      localStorage.removeItem('adminSession')
      sessionStorage.removeItem('adminData')
      sessionStorage.removeItem('adminSession')
    }

    refreshSessionExpiry(userData.role)
  }

  // Check for saved session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('activeUser') || sessionStorage.getItem('activeUser')
        if (savedUser) {
          const sessionExpiry = parseInt(
            localStorage.getItem(SESSION_EXPIRY_KEY) || sessionStorage.getItem(SESSION_EXPIRY_KEY) || '0',
            10
          )

          if (sessionExpiry && sessionExpiry <= Date.now()) {
            clearStoredSession()
            setUser(null)
            return
          }

          const userData = JSON.parse(savedUser)
          setUser(userData)
          refreshSessionExpiry(userData.role)

          // Optionally refresh from database
          try {
            const freshUserData = await supabaseAuth.getUserBySession()
            if (freshUserData) {
              persistSession(mapRecordToSessionUser(freshUserData))
            } else {
              // User no longer exists in database (deleted)
              console.warn('User session invalidated: User record not found')
              clearStoredSession()
              setUser(null)
            }
          } catch (err) {
            console.log('Could not refresh user data (keeping cached session):', err)
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string }> => {
    try {
      setLoading(true)
      const loggedInUser = await supabaseAuth.login(email, password)

      if (!loggedInUser) {
        return { success: false }
      }

      const userRole: UserRole = loggedInUser.role || 'user'
      const redirectTo = getDashboardRoute(userRole)

      const userData: User = mapRecordToSessionUser({
        ...loggedInUser,
        role: userRole,
      })

      // If admin or superadmin, store admin session and also set user state and activeUser
      if (userRole === 'admin' || userRole === 'superadmin') {
        persistSession(userData)
      } else {
        // Regular user login
        persistSession(userData)
      }

      return { success: true, redirectTo }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, userData: Partial<UserRecord> = {}): Promise<boolean> => {
    try {
      setLoading(true)
      const newUser = await supabaseAuth.signup(email, password, userData)

      persistSession(mapRecordToSessionUser(newUser))

      return true
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    clearStoredSession()
  }

  useEffect(() => {
    if (!user) {
      lastActivityRefreshRef.current = 0
      return
    }

    const getSessionExpiry = () => parseInt(
      localStorage.getItem(SESSION_EXPIRY_KEY) || sessionStorage.getItem(SESSION_EXPIRY_KEY) || '0',
      10
    )

    const hasSessionExpired = () => {
      const sessionExpiry = getSessionExpiry()
      return !!sessionExpiry && sessionExpiry <= Date.now()
    }

    const maybeRefreshSession = () => {
      if (hasSessionExpired()) {
        logout()
        return
      }

      const now = Date.now()
      if (now - lastActivityRefreshRef.current < 30 * 1000) return

      lastActivityRefreshRef.current = now
      refreshSessionExpiry(user.role)
    }

    const enforceExpiry = () => {
      if (hasSessionExpired()) {
        logout()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        enforceExpiry()
      }
    }

    maybeRefreshSession()

    const activityEvents: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'mousedown',
      'mousemove',
      'scroll',
      'touchstart',
    ]

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, maybeRefreshSession, { passive: true })
    })
    window.addEventListener('focus', enforceExpiry)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const expiryInterval = window.setInterval(enforceExpiry, 15 * 1000)

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, maybeRefreshSession)
      })
      window.removeEventListener('focus', enforceExpiry)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.clearInterval(expiryInterval)
    }
  }, [user])

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return checkPerm(user.role, permission as keyof UserPermissions)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return checkRoleLevel(user.role, role)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      persistSession(updatedUser)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
      loading,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
