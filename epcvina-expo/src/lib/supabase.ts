import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Session, User } from '@supabase/supabase-js'

const MOBILE_API_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://app.epcvina.com/api/mobile').replace(/\/$/, '')
const SESSION_KEY = '@epcvina:api_session'

type ApiError = { message: string; name?: string; code?: string; details?: string; hint?: string }
type QueryResult<T = unknown> = { data: T | null; error: ApiError | null; count?: number | null }
type AuthCallback = (event: string, session: Session | null) => void

let currentSession: Session | null = null
let sessionLoaded = false
const authCallbacks = new Set<AuthCallback>()
const uploadedPublicUrls = new Map<string, string>()

async function request<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
  const response = await fetch(`${MOBILE_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || result.message || `HTTP ${response.status}`)
  return result
}

async function uploadFile(bucket: string, path: string, file: Blob, options?: { upsert?: boolean; contentType?: string }) {
  try {
    const session = await getValidSession()
    if (!session) throw new Error('Chưa đăng nhập.')
    const form = new FormData()
    form.append('bucket', bucket)
    form.append('path', path)
    form.append('upsert', options?.upsert ? 'true' : 'false')
    form.append('file', file)
    const response = await fetch(`${MOBILE_API_URL}/storage`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`)
    uploadedPublicUrls.set(`${bucket}:${path}`, result.data.publicUrl)
    return { data: { path }, error: null }
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : 'Không tải được ảnh.' } }
  }
}

async function loadSession() {
  if (sessionLoaded) return currentSession
  sessionLoaded = true
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY)
    currentSession = raw ? JSON.parse(raw) : null
  } catch {
    currentSession = null
  }
  return currentSession
}

async function saveSession(session: Session | null) {
  currentSession = session
  sessionLoaded = true
  if (session) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else await AsyncStorage.removeItem(SESSION_KEY)
}

async function getValidSession() {
  const session = await loadSession()
  if (!session?.refresh_token || !session.expires_at || session.expires_at > Math.floor(Date.now() / 1000) + 60) {
    return session
  }
  try {
    const result = await request<{ data: { session: Session; user: User } }>('/auth', {
      action: 'refresh',
      refresh_token: session.refresh_token,
    })
    await saveSession(result.data.session)
    authCallbacks.forEach((callback) => callback('TOKEN_REFRESHED', result.data.session))
    return result.data.session
  } catch {
    await saveSession(null)
    authCallbacks.forEach((callback) => callback('SIGNED_OUT', null))
    return null
  }
}

class ApiQueryBuilder<T = any> implements PromiseLike<QueryResult<T>> {
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private columns = '*'
  private selectOptions: Record<string, unknown> | undefined
  private payload: unknown
  private returning: string | undefined
  private filters: Array<{ method: string; args: unknown[] }> = []
  private modifiers: Array<{ method: string; args: unknown[] }> = []
  private singleMode: 'single' | 'maybeSingle' | undefined

  constructor(private table: string) {}

  select(columns = '*', options?: Record<string, unknown>) {
    if (this.action === 'select') {
      this.columns = columns
      this.selectOptions = options
    } else {
      this.returning = columns
    }
    return this
  }

  insert(payload: unknown) { this.action = 'insert'; this.payload = payload; return this }
  update(payload: unknown) { this.action = 'update'; this.payload = payload; return this }
  delete() { this.action = 'delete'; return this }

  private filter(method: string, args: unknown[]) { this.filters.push({ method, args }); return this }
  eq(column: string, value: unknown) { return this.filter('eq', [column, value]) }
  neq(column: string, value: unknown) { return this.filter('neq', [column, value]) }
  in(column: string, values: unknown[]) { return this.filter('in', [column, values]) }
  is(column: string, value: unknown) { return this.filter('is', [column, value]) }
  gte(column: string, value: unknown) { return this.filter('gte', [column, value]) }
  gt(column: string, value: unknown) { return this.filter('gt', [column, value]) }
  lte(column: string, value: unknown) { return this.filter('lte', [column, value]) }
  lt(column: string, value: unknown) { return this.filter('lt', [column, value]) }
  like(column: string, value: string) { return this.filter('like', [column, value]) }
  ilike(column: string, value: string) { return this.filter('ilike', [column, value]) }
  or(value: string, options?: Record<string, unknown>) { return this.filter('or', [value, options]) }
  not(column: string, operator: string, value: unknown) { return this.filter('not', [column, operator, value]) }

  order(column: string, options?: Record<string, unknown>) { this.modifiers.push({ method: 'order', args: [column, options] }); return this }
  limit(value: number) { this.modifiers.push({ method: 'limit', args: [value] }); return this }
  range(from: number, to: number) { this.modifiers.push({ method: 'range', args: [from, to] }); return this }
  single() { this.singleMode = 'single'; return this }
  maybeSingle() { this.singleMode = 'maybeSingle'; return this }

  async execute(): Promise<QueryResult<T>> {
    try {
      const session = await getValidSession()
      return await request<QueryResult<T>>('/query', {
        table: this.table,
        action: this.action,
        columns: this.columns,
        selectOptions: this.selectOptions,
        payload: this.payload,
        returning: this.returning,
        filters: this.filters,
        modifiers: this.modifiers,
        single: this.singleMode,
      }, session?.access_token)
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : 'Truy vấn thất bại.' } }
    }
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

export const supabase = {
  from: <T = any>(table: string) => new ApiQueryBuilder<T>(table),
  auth: {
    async getSession() {
      const session = await getValidSession()
      return { data: { session }, error: null }
    },
    async getUser() {
      const session = await getValidSession()
      return { data: { user: session?.user ?? null }, error: null }
    },
    async signInWithPassword(credentials: { email?: string; phone?: string; password: string }) {
      try {
        const result = await request<{ data: { session: Session; user: User } }>('/auth', { action: 'login', ...credentials })
        await saveSession(result.data.session)
        authCallbacks.forEach((callback) => callback('SIGNED_IN', result.data.session))
        return { data: result.data, error: null }
      } catch (error) {
        return { data: { session: null, user: null }, error: { message: error instanceof Error ? error.message : 'Đăng nhập thất bại.' } }
      }
    },
    async signUp(credentials: { email?: string; phone?: string; password: string; options?: Record<string, unknown> }) {
      try {
        const session = await getValidSession()
        const result = await request<{ data: { session: null; user: User } }>('/auth', { action: 'signup', ...credentials }, session?.access_token)
        return { data: result.data, error: null }
      } catch (error) {
        return { data: { session: null, user: null }, error: { message: error instanceof Error ? error.message : 'Không tạo được người dùng.' } }
      }
    },
    async resetPasswordForEmail(email: string, options?: { redirectTo?: string }) {
      try {
        await request('/auth', { action: 'reset_password', email, ...options })
        return { data: null, error: null }
      } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : 'Không gửi được email.' } }
      }
    },
    async signInWithOAuth(_options?: unknown) {
      return { data: { provider: null, url: null }, error: { name: 'Unsupported', message: 'Đăng nhập mạng xã hội chưa được hỗ trợ qua API mobile.' } }
    },
    async signOut() {
      await saveSession(null)
      authCallbacks.forEach((callback) => callback('SIGNED_OUT', null))
      return { error: null }
    },
    onAuthStateChange(callback: AuthCallback) {
      authCallbacks.add(callback)
      loadSession().then((session) => callback('INITIAL_SESSION', session))
      return { data: { subscription: { unsubscribe: () => authCallbacks.delete(callback) } } }
    },
  },
  storage: {
    from: (bucket = '') => ({
      upload: (path = '', file: Blob, options?: { upsert?: boolean; contentType?: string }) => uploadFile(bucket, path, file, options),
      getPublicUrl: (path = '') => ({ data: { publicUrl: uploadedPublicUrls.get(`${bucket}:${path}`) || '' } }),
    }),
  },
  channel: (_name?: string) => ({
    on(..._args: unknown[]) { return this },
    subscribe(_callback?: unknown) { return this },
    unsubscribe() {},
  }),
  removeChannel: (_channel?: unknown) => undefined,
}
