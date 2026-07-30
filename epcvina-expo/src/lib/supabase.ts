/**
 * Mock Supabase Client - Replaces real Supabase with local mock data
 * Provides the same chainable query interface for compatibility
 */

// ─── Mock Users / Auth ───────────────────────────────────────────────────────

const MOCK_USER_ID = 'mock-admin-001'

const mockUser = {
  id: MOCK_USER_ID,
  email: 'admin@epcvina.com',
  phone: '0901234567',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: 'Admin EPCVINA' },
  identities: [],
  factors: [],
}

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: mockUser,
}

let currentSession: typeof mockSession | null = mockSession

// ─── Load data from db.json (generated from epcvinasolar) ────────────────────

import dbData from '../data/db.json'

const dataMap: Record<string, any[]> = {
  profiles: dbData.profiles,
  products: dbData.products,
  categories: dbData.categories,
  customers: dbData.customers,
  orders: dbData.orders,
  notifications: dbData.notifications,
  sales_teams: dbData.sales_teams,
  team_members: dbData.team_members,
  brands: dbData.brands,
  discount_policies: dbData.discount_policies,
  gift_policies: dbData.gift_policies,
  customer_special_prices: dbData.customer_special_prices,
}

// ─── Query Builder ───────────────────────────────────────────────────────────

class MockQueryBuilder {
  private _table: string
  private _data: any[] = []
  private _filters: Array<(row: any) => boolean> = []
  private _orderCol: string | null = null
  private _orderAsc = true
  private _limitVal: number | null = null
  private _selectColumns: string[] | null = null
  private _isCountOnly = false
  private _isHeadOnly = false
  private _insertData: any = null
  private _updateData: any = null
  private _isDelete = false
  private _isSingle = false
  private _rangeFrom: number | null = null
  private _rangeTo: number | null = null

  constructor(table: string) {
    this._table = table
    this._data = [...(dataMap[table] || [])]
  }

  select(columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.count === 'exact' && options?.head) {
      this._isCountOnly = true
      this._isHeadOnly = true
    }
    if (columns && columns !== '*' && columns !== '') {
      this._selectColumns = columns.split(',').map(c => c.trim())
    }
    return this
  }

  insert(data: any) {
    this._insertData = Array.isArray(data) ? data : [data]
    return this
  }

  update(data: any) {
    this._updateData = data
    return this
  }

  delete() {
    this._isDelete = true
    return this
  }

  eq(col: string, val: any) {
    this._filters.push(row => row[col] === val)
    return this
  }

  neq(col: string, val: any) {
    this._filters.push(row => row[col] !== val)
    return this
  }

  in(col: string, vals: any[]) {
    this._filters.push(row => vals.includes(row[col]))
    return this
  }

  is(col: string, val: any) {
    if (val === null) {
      this._filters.push(row => row[col] === null || row[col] === undefined)
    } else {
      this._filters.push(row => row[col] === val)
    }
    return this
  }

  gte(col: string, val: any) {
    this._filters.push(row => row[col] >= val)
    return this
  }

  gt(col: string, val: any) {
    this._filters.push(row => row[col] > val)
    return this
  }

  lt(col: string, val: any) {
    this._filters.push(row => row[col] < val)
    return this
  }

  lte(col: string, val: any) {
    this._filters.push(row => row[col] <= val)
    return this
  }

  like(col: string, pattern: string) {
    const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i')
    this._filters.push(row => regex.test(row[col] || ''))
    return this
  }

  ilike(col: string, pattern: string) {
    return this.like(col, pattern)
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this._orderCol = col
    this._orderAsc = opts?.ascending !== false
    return this
  }

  limit(n: number) {
    this._limitVal = n
    return this
  }

  range(from: number, to: number) {
    this._rangeFrom = from
    this._rangeTo = to
    return this
  }

  single() {
    this._isSingle = true
    return this
  }

  maybeSingle() {
    this._isSingle = true
    return this
  }

  // ─── Execute ─────────────────────────────────────────────────────────────

  then(resolve: (value: any) => any, reject?: (error: any) => any) {
    try {
      const result = this._execute()
      resolve(result)
    } catch (err) {
      if (reject) reject(err)
    }
  }

  private _execute() {
    // INSERT
    if (this._insertData) {
      const table = dataMap[this._table]
      if (table) {
        const newRows = this._insertData.map((row: any) => ({
          ...row,
          id: row.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          created_at: row.created_at || new Date().toISOString(),
        }))
        table.push(...newRows)
      }
      return { data: this._insertData, error: null, count: this._insertData.length }
    }

    // UPDATE
    if (this._updateData) {
      const table = dataMap[this._table]
      if (table) {
        let filtered = this._applyFilters(table)
        filtered.forEach(row => Object.assign(row, this._updateData))
      }
      return { data: null, error: null }
    }

    // DELETE
    if (this._isDelete) {
      const table = dataMap[this._table]
      if (table) {
        const toDelete = this._applyFilters(table)
        const deleteIds = new Set(toDelete.map(r => r.id))
        const idx = table.findIndex(r => deleteIds.has(r.id))
        if (idx >= 0) table.splice(idx, 1)
      }
      return { data: null, error: null }
    }

    // SELECT
    let filtered = this._applyFilters(this._data)

    // Count only (head)
    if (this._isCountOnly) {
      return { data: null, error: null, count: filtered.length }
    }

    // Order
    if (this._orderCol) {
      const col = this._orderCol
      filtered.sort((a, b) => {
        const va = a[col], vb = b[col]
        if (va < vb) return this._orderAsc ? -1 : 1
        if (va > vb) return this._orderAsc ? 1 : -1
        return 0
      })
    }

    // Limit
    if (this._limitVal !== null) {
      filtered = filtered.slice(0, this._limitVal)
    }

    // Range (pagination)
    if (this._rangeFrom !== null && this._rangeTo !== null) {
      filtered = filtered.slice(this._rangeFrom, this._rangeTo + 1)
    }

    // Select columns
    if (this._selectColumns) {
      filtered = filtered.map(row => {
        const picked: any = {}
        this._selectColumns!.forEach(col => {
          picked[col] = row[col]
        })
        return picked
      })
    }

    // Single
    if (this._isSingle) {
      return { data: filtered[0] || null, error: filtered.length === 0 ? { message: 'No rows found' } : null }
    }

    return { data: filtered, error: null }
  }

  private _applyFilters(data: any[]) {
    return data.filter(row => this._filters.every(fn => fn(row)))
  }
}

// ─── Mock Auth ───────────────────────────────────────────────────────────────

type AuthChangeCallback = (event: string, session: any) => void
let authChangeCallbacks: AuthChangeCallback[] = []

const mockAuth = {
  getSession: async () => ({
    data: { session: currentSession },
    error: null,
  }),

  getUser: async () => ({
    data: { user: currentSession?.user ?? null },
    error: null,
  }),

  signInWithPassword: async ({ email, password }: { email?: string; password?: string; phone?: string }) => {
    // Accept any credentials in mock mode
    if (__DEV__) console.log('[MockAuth] Sign in:', email || 'phone login')
    currentSession = mockSession
    return {
      data: { user: mockUser, session: currentSession },
      error: null,
    }
  },

  signInWithOAuth: async ({ provider }: { provider: string }) => {
    if (__DEV__) console.log('[MockAuth] OAuth sign in:', provider)
    return {
      data: { url: 'mock://oauth-callback', provider },
      error: null,
    }
  },

  signOut: async () => {
    if (__DEV__) console.log('[MockAuth] Sign out')
    currentSession = null
    authChangeCallbacks.forEach(cb => cb('SIGNED_OUT', null))
    return { error: null }
  },

  onAuthStateChange: (callback: AuthChangeCallback) => {
    authChangeCallbacks.push(callback)
    // Immediately fire current state
    setTimeout(() => callback('INITIAL_SESSION', currentSession), 0)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authChangeCallbacks = authChangeCallbacks.filter(cb => cb !== callback)
          },
        },
      },
    }
  },

  resetPasswordForEmail: async (email: string) => {
    if (__DEV__) console.log('[MockAuth] Reset password for:', email)
    return { data: null, error: null }
  },
}

// ─── Export Mock Client ──────────────────────────────────────────────────────

export const supabase = {
  auth: mockAuth,
  from: (table: string) => new MockQueryBuilder(table),
  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({}) }),
    subscribe: () => ({}),
    unsubscribe: () => ({}),
  }),
  removeChannel: () => ({}),
}

if (__DEV__) {
  console.log('[MockSupabase] Using mock data - no real Supabase connection')
}
