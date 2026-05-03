import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UserRole, getDashboardRoute, hasRoleLevel } from '@/utils/roles'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  allowedRoles?: UserRole[]
  fallbackRoute?: string
}

export default function RoleProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallbackRoute
}: RoleProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()
  
  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #f0b90b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Redirect to appropriate login if not authenticated
  if (!isAuthenticated || !user) {
    // Admin routes should redirect to admin login
    const loginPath = isAdminRoute ? '/admin/login' : '/login'
    return <Navigate to={loginPath} replace />
  }

  // Check role requirements
  if (requiredRole && !user.role) {
    const loginPath = isAdminRoute ? '/admin/login' : '/login'
    return <Navigate to={loginPath} replace />
  }

  // Check if user has required role
  if (requiredRole) {
    if (!hasRoleLevel(user.role, requiredRole)) {
      // If trying to access admin route without admin role, go to admin login
      if (isAdminRoute && user.role === 'user') {
        return <Navigate to="/admin/login" replace />
      }
      const redirectTo = fallbackRoute || getDashboardRoute(user.role)
      return <Navigate to={redirectTo} replace />
    }
  }

  // Check if user role is in allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      const redirectTo = fallbackRoute || getDashboardRoute(user.role)
      return <Navigate to={redirectTo} replace />
    }
  }

  return <>{children}</>
}

// Convenience components for common role checks
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute requiredRole="admin">
      {children}
    </RoleProtectedRoute>
  )
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute requiredRole="superadmin">
      {children}
    </RoleProtectedRoute>
  )
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['user']}>
      {children}
    </RoleProtectedRoute>
  )
}