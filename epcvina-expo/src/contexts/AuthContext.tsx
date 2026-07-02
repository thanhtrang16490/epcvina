import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'
import { User, UserRole } from '../types'
import { errorTracker } from '../lib/error-tracking'
import { Analytics, AnalyticsEvents } from '../lib/analytics'
import { AUTH_CONFIG } from '../constants/config'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: string }>
  signInWithPhone: (phone: string, password: string) => Promise<{ error?: string; role?: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // Safety timeout — prevents infinite loading on network issues
    const timeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        if (__DEV__) console.warn('[AuthProvider] Init timeout — forcing loading=false')
        setLoading(false)
      }
    }, AUTH_CONFIG.initTimeoutMs)

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mountedRef.current) return

        if (error) {
          errorTracker.logError(error, { action: 'AuthProvider.initAuth' })
          setLoading(false)
          return
        }

        setSession(session)

        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (err) {
        errorTracker.logError(err as Error, { action: 'AuthProvider.initAuth' })
        if (mountedRef.current) setLoading(false)
      } finally {
        clearTimeout(timeout)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return

      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mountedRef.current = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        errorTracker.logError(error, { action: 'AuthProvider.fetchUserProfile' })
        throw error
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        full_name: profile?.full_name ?? undefined,
        role: (profile?.role as UserRole) ?? 'customer',
      }

      if (mountedRef.current) {
        setUser(userData)
        Analytics.setUserProperties({
          userId: userData.id,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          name: userData.full_name,
        })
      }
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'AuthProvider.fetchUserProfile' })
      // Fallback: set minimal user so app doesn't get stuck
      if (mountedRef.current) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          phone: supabaseUser.phone,
          role: 'customer',
        })
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        errorTracker.logWarning(error.message, { action: 'AuthProvider.signIn' })
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = (profile?.role as UserRole) ?? 'customer'
        errorTracker.setUser(data.user.id, data.user.email ?? undefined, role)
        Analytics.trackEvent(AnalyticsEvents.LOGIN, { method: 'email', role })
        return { role }
      }

      return {}
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'AuthProvider.signIn' })
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ phone, password })

      if (error) {
        errorTracker.logWarning(error.message, { action: 'AuthProvider.signInWithPhone' })
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = (profile?.role as UserRole) ?? 'customer'
        errorTracker.setUser(data.user.id, data.user.phone ?? undefined, role)
        Analytics.trackEvent(AnalyticsEvents.LOGIN, { method: 'phone', role })
        return { role }
      }

      return {}
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'AuthProvider.signInWithPhone' })
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signOut = async () => {
    Analytics.trackEvent(AnalyticsEvents.LOGOUT, { role: user?.role })

    // Persist email for "remember me" feature
    if (user?.email) {
      try {
        await AsyncStorage.setItem(AUTH_CONFIG.rememberedEmailKey, user.email)
      } catch (error) {
        errorTracker.logWarning('Failed to save email to AsyncStorage', { action: 'AuthProvider.signOut' })
      }
    }

    errorTracker.clearUser()
    Analytics.clearUserProperties()
    await supabase.auth.signOut()
  }

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signInWithPhone,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
