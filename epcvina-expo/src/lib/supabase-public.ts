/**
 * Supabase Public Client
 *
 * A separate Supabase client configured for unauthenticated (anon) queries.
 * Unlike the main client, this one does NOT persist sessions or auto-refresh tokens.
 *
 * Use this for public-facing screens (e.g., product browsing without login).
 * RLS policies must allow SELECT for the `anon` role on target tables.
 */

import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Public (anon) Supabase client.
 * - No session persistence
 * - No token auto-refresh
 * - Uses anon key → queries are limited to tables with anon RLS policies
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use AsyncStorage as a simple no-op storage (never actually saves a session)
    storage: {
      getItem: (_key: string) => Promise.resolve(null), // Always return null = no session
      setItem: (_key: string, _value: string) => Promise.resolve(),
      removeItem: (_key: string) => Promise.resolve(),
    },
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      // Explicitly set apikey header to ensure anon key is always used
      apikey: supabaseAnonKey,
    },
  },
})
