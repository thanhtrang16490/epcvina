/**
 * Feature Flags for Phased Rollout
 * 
 * This file controls which features are enabled during the refactor process.
 * All flags start as FALSE for safety, and will be enabled phase by phase.
 */

export interface FeatureFlags {
  // Phase 2: Admin Separation
  useNewAdminRoutes: boolean
  showAdminInNavigation: boolean
  
  // Phase 3: Sales Enhancement
  enableTeamManagement: boolean
  enableCustomerAssignment: boolean
  enableSaleAdminDashboard: boolean
  enableTeamReports: boolean
  enableOrderApprovals: boolean
  
  // Phase 4: Warehouse (Future)
  enableWarehouseModule: boolean
  
  // Development/Testing
  enableDebugMode: boolean
  enablePerformanceMonitoring: boolean
}

/**
 * Current Feature Flag Configuration
 * 
 * Phase 1 (Week 1): All flags OFF - Foundation only
 * Phase 2 (Week 2): Enable admin routes
 * Phase 3 (Week 3): Enable team features
 * Phase 4 (Week 4): Testing
 * Phase 5 (Week 5): Full rollout
 */
export const featureFlags: FeatureFlags = {
  // Phase 2: Admin Separation (Week 2)
  useNewAdminRoutes: false,           // Redirect admin to /(admin) instead of /(sales)
  showAdminInNavigation: false,       // Show admin-specific navigation items
  
  // Phase 3: Sales Enhancement (Week 3) - ENABLED
  enableTeamManagement: true,         // ✅ Show team management pages for sale_admin
  enableCustomerAssignment: true,     // ✅ Allow assigning customers to team members
  enableSaleAdminDashboard: true,     // ✅ Show dual dashboard (personal + team)
  enableTeamReports: true,            // ✅ Show team reports for sale_admin
  enableOrderApprovals: false,        // Show order approval workflow
  
  // Phase 4: Warehouse (Future)
  enableWarehouseModule: false,       // Enable warehouse role and features
  
  // Development/Testing
  enableDebugMode: false,             // Show debug information
  enablePerformanceMonitoring: false, // Track performance metrics
}

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature]
}

/**
 * Check if user should use new admin routes
 */
export const shouldUseNewAdminRoutes = (role: string): boolean => {
  return role === 'admin' && featureFlags.useNewAdminRoutes
}

/**
 * Check if team features are available for user
 */
export const hasTeamFeatures = (role: string): boolean => {
  return (role === 'sale_admin' || role === 'admin') && featureFlags.enableTeamManagement
}

/**
 * Check if customer assignment is enabled
 */
export const canAssignCustomers = (role: string): boolean => {
  return (role === 'sale_admin' || role === 'admin') && featureFlags.enableCustomerAssignment
}

/**
 * Check if sale admin dashboard is enabled
 */
export const hasSaleAdminDashboard = (role: string): boolean => {
  return role === 'sale_admin' && featureFlags.enableSaleAdminDashboard
}

/**
 * Check if team reports are enabled
 */
export const hasTeamReports = (role: string): boolean => {
  return (role === 'sale_admin' || role === 'admin') && featureFlags.enableTeamReports
}

/**
 * Get all enabled features (for debugging)
 */
export const getEnabledFeatures = (): string[] => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
}

/**
 * Get current phase based on enabled features
 */
export const getCurrentPhase = (): number => {
  if (featureFlags.enableTeamManagement) return 3
  if (featureFlags.useNewAdminRoutes) return 2
  return 1
}

/**
 * Phase descriptions for documentation
 */
export const phaseDescriptions = {
  1: 'Foundation - Database and permissions setup',
  2: 'Admin Separation - New admin routes',
  3: 'Sales Enhancement - Team management features',
  4: 'Testing - Comprehensive testing phase',
  5: 'Full Rollout - All features enabled',
}

/**
 * Get current phase description
 */
export const getCurrentPhaseDescription = (): string => {
  const phase = getCurrentPhase()
  return phaseDescriptions[phase as keyof typeof phaseDescriptions] || 'Unknown phase'
}

/**
 * Enable a feature (for testing/development)
 * DO NOT use in production - modify featureFlags object instead
 */
export const enableFeature = (feature: keyof FeatureFlags): void => {
  if (featureFlags.enableDebugMode) {
    console.log(`[Feature Flags] Enabling feature: ${feature}`)
    featureFlags[feature] = true
  } else {
    console.warn('[Feature Flags] Cannot enable feature - debug mode is off')
  }
}

/**
 * Disable a feature (for testing/development)
 * DO NOT use in production - modify featureFlags object instead
 */
export const disableFeature = (feature: keyof FeatureFlags): void => {
  if (featureFlags.enableDebugMode) {
    console.log(`[Feature Flags] Disabling feature: ${feature}`)
    featureFlags[feature] = false
  } else {
    console.warn('[Feature Flags] Cannot disable feature - debug mode is off')
  }
}

/**
 * Log current feature flag status (for debugging)
 */
export const logFeatureFlags = (): void => {
  if (featureFlags.enableDebugMode) {
    console.log('[Feature Flags] Current configuration:')
    console.table(featureFlags)
    console.log(`[Feature Flags] Current phase: ${getCurrentPhase()} - ${getCurrentPhaseDescription()}`)
    console.log(`[Feature Flags] Enabled features: ${getEnabledFeatures().join(', ') || 'None'}`)
  }
}
