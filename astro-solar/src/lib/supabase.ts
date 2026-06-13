import { createClient } from '@supabase/supabase-js';

type SupabaseClient = ReturnType<typeof createClient>;

let _supabase: SupabaseClient | null = null;

/**
 * Lazy singleton — the Supabase client is only created on first call.
 * This prevents the SDK from being initialised (and its bundle loaded)
 * on pages that never actually use it.
 */
export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY must be set.');
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

/**
 * @deprecated Use `getSupabase()` instead.
 * Kept for backward-compatibility with API routes that import `supabase` directly.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as Record<string | symbol, unknown>)[prop];
  },
});
