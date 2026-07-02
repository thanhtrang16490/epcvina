export type Role = 'admin' | 'sale_admin' | 'sale' | 'warehouse' | 'customer'

export const permissions = {
  // Admin permissions (system management)
  canManageUsers: (role: Role) => role === 'admin',
  canManageSettings: (role: Role) => role === 'admin',
  canManageCategories: (role: Role) => role === 'admin',
  canViewSystemAnalytics: (role: Role) => role === 'admin',
  
  // Sales permissions
  canViewOwnCustomers: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canViewAllCustomers: (role: Role) => role === 'admin',
  
  canAssignCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canReassignCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canCreateOrders: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewOwnOrders: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamOrders: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canApproveOrders: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canViewPersonalReports: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamReports: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canManageTeam: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canViewTeamPerformance: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  // Product/Inventory permissions
  canAddProducts: (role: Role) => role === 'admin',
  canEditProducts: (role: Role) => role === 'admin',
  canDeleteProducts: (role: Role) => role === 'admin',
  canViewProducts: () => true, // All roles can view
  
  // Warehouse permissions
  canManageInventory: (role: Role) => ['admin', 'warehouse'].includes(role),
  canReceiveStock: (role: Role) => ['admin', 'warehouse'].includes(role),
  canShipOrders: (role: Role) => ['admin', 'warehouse'].includes(role),
  canStocktake: (role: Role) => ['admin', 'warehouse'].includes(role),
  
  // Customer permissions
  canPlaceOrders: (role: Role) => ['customer', 'sale', 'sale_admin', 'admin'].includes(role),
}

export const hasPermission = (role: Role, permission: keyof typeof permissions) => {
  return permissions[permission](role)
}

// Helper to check if user is in sales team
export const isSalesRole = (role: Role) => ['sale_admin', 'sale'].includes(role)

// Helper to check if user is sale admin
export const isSaleAdmin = (role: Role) => role === 'sale_admin'

// Helper to check if user is regular sale
export const isSale = (role: Role) => role === 'sale'

// Helper to check if user can manage team
export const canManageTeam = (role: Role) => ['admin', 'sale_admin'].includes(role)

// Helper to check data scope
export const getDataScope = (role: Role): 'all' | 'team' | 'own' | 'warehouse' | 'customer' | 'none' => {
  switch (role) {
    case 'admin':
      return 'all' // See everything
    case 'sale_admin':
      return 'team' // See own + team
    case 'sale':
      return 'own' // See only own
    case 'warehouse':
      return 'warehouse' // Warehouse data
    case 'customer':
      return 'customer' // Customer data
    default:
      return 'none'
  }
}

// Get user's accessible customer IDs based on role
export const getAccessibleCustomerIds = async (userId: string, _role: Role): Promise<string[]> => {
  // This will be implemented with actual Supabase queries
  // For now, return empty array
  console.log('getAccessibleCustomerIds called for user:', userId)
  return []
}

// Check if user can access specific customer
export const canAccessCustomer = (role: Role, userId: string, assignedTo?: string, teamMemberIds?: string[]): boolean => {
  if (role === 'admin') return true
  if (role === 'sale_admin') {
    // Can access own customers or team customers
    return assignedTo === userId || (teamMemberIds?.includes(assignedTo || '') ?? false)
  }
  if (role === 'sale') {
    // Can only access own customers
    return assignedTo === userId
  }
  return false
}

// Check if user can access specific order
export const canAccessOrder = (role: Role, userId: string, createdBy?: string, assignedTo?: string): boolean => {
  if (role === 'admin') return true
  if (role === 'sale_admin' || role === 'sale') {
    // Can access if created by self or customer is assigned to self
    return createdBy === userId || assignedTo === userId
  }
  return false
}
