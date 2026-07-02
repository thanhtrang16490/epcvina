import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import { View, ActivityIndicator, Text } from 'react-native'
import { shouldUseNewAdminRoutes } from '../src/lib/feature-flags'

export default function Index() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return <Redirect href="/(public)/products" />
  }

  // Redirect based on user role
  if (user.role === 'customer') {
    return <Redirect href="/(customer)/dashboard" />
  }

  // Director role
  if (user.role === 'director') {
    return <Redirect href="/(director)/dashboard" />
  }

  // Warehouse role
  if (user.role === 'warehouse') {
    return <Redirect href="/(warehouse)/dashboard" />
  }

  // Accountant role
  if (user.role === 'accountant') {
    return <Redirect href="/(accountant)/dashboard" />
  }

  // Admin routing with feature flag
  if (user.role === 'admin') {
    if (shouldUseNewAdminRoutes(user.role)) {
      return <Redirect href="/(admin)/dashboard" />
    } else {
      return <Redirect href="/(sales)/dashboard" />
    }
  }

  // Sales roles (sale_admin, sale)
  if (['sale', 'sale_admin'].includes(user.role)) {
    return <Redirect href="/(sales)/dashboard" />
  }

  return <Redirect href="/(auth)/login" />
}
