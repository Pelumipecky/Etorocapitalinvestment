// Role-based access control utilities
export type UserRole = 'user' | 'admin' | 'superadmin'

export interface UserPermissions {
  canViewUsers: boolean
  canManageUsers: boolean
  canViewTransactions: boolean
  canManageTransactions: boolean
  canViewInvestments: boolean
  canManageInvestments: boolean
  canViewKYC: boolean
  canManageKYC: boolean
  canViewWithdrawals: boolean
  canManageWithdrawals: boolean
  canViewLoans: boolean
  canManageLoans: boolean
  canViewSystemSettings: boolean
  canManageSystemSettings: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  user: {
    canViewUsers: false,
    canManageUsers: false,
    canViewTransactions: false,
    canManageTransactions: false,
    canViewInvestments: true,
    canManageInvestments: true,
    canViewKYC: true,
    canManageKYC: false,
    canViewWithdrawals: true,
    canManageWithdrawals: true,
    canViewLoans: true,
    canManageLoans: true,
    canViewSystemSettings: false,
    canManageSystemSettings: false,
  },
  admin: {
    canViewUsers: true,
    canManageUsers: true,
    canViewTransactions: true,
    canManageTransactions: true,
    canViewInvestments: true,
    canManageInvestments: true,
    canViewKYC: true,
    canManageKYC: true,
    canViewWithdrawals: true,
    canManageWithdrawals: true,
    canViewLoans: true,
    canManageLoans: true,
    canViewSystemSettings: false,
    canManageSystemSettings: false,
  },
  superadmin: {
    canViewUsers: true,
    canManageUsers: true,
    canViewTransactions: true,
    canManageTransactions: true,
    canViewInvestments: true,
    canManageInvestments: true,
    canViewKYC: true,
    canManageKYC: true,
    canViewWithdrawals: true,
    canManageWithdrawals: true,
    canViewLoans: true,
    canManageLoans: true,
    canViewSystemSettings: true,
    canManageSystemSettings: true,
  },
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  superadmin: 3,
}

export function hasPermission(userRole: UserRole, permission: keyof UserPermissions): boolean {
  return ROLE_PERMISSIONS[userRole][permission]
}

export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'superadmin':
    case 'admin':
      return '/admin'
    case 'user':
    default:
      return '/dashboard'
  }
}