import React from 'react'
import { renderHook, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '../AuthContext'
import { supabase } from '../../lib/supabase'

jest.mock('../../lib/supabase')

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  let authStateCallback: ((event: string, session: any) => void) | null = null

  beforeEach(() => {
    jest.clearAllMocks()
    authStateCallback = null

    // Default: capture auth state change callback
    ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback: any) => {
      authStateCallback = callback
      return { data: { subscription: { unsubscribe: jest.fn() } } }
    })
  })

  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('should sign in successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'sale' },
        error: null,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    const response = await result.current.signIn('test@example.com', 'password')

    expect(response.role).toBe('sale')
    expect(response.error).toBeUndefined()
  })

  it('đăng nhập thành công → cập nhật user và profile', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'sale', full_name: 'Nguyễn Văn A' },
        error: null,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    const response = await result.current.signIn('test@example.com', 'password')

    expect(response.role).toBe('sale')
    expect(response.error).toBeUndefined()

    // Simulate onAuthStateChange firing after sign in (real Supabase behavior)
    authStateCallback?.('SIGNED_IN', { user: mockUser })

    await waitFor(() => {
      expect(result.current.user).not.toBeNull()
    })

    expect(result.current.user?.role).toBe('sale')
    expect(result.current.user?.email).toBe('test@example.com')
  })

  it('should handle sign in error', async () => {
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    const response = await result.current.signIn('test@example.com', 'wrong')

    expect(response.error).toBe('Invalid credentials')
  })

  it('đăng nhập thất bại → trả về lỗi, user vẫn null', async () => {
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Thông tin đăng nhập không hợp lệ' },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    const response = await result.current.signIn('test@example.com', 'wrong')

    expect(response.error).toBe('Thông tin đăng nhập không hợp lệ')
    expect(result.current.user).toBeNull()
  })

  it('should sign out successfully', async () => {
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({})

    const { result } = renderHook(() => useAuth(), { wrapper })

    await result.current.signOut()

    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it('đăng xuất → xóa trạng thái user', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }

    // Setup initial session
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'sale', full_name: 'Nguyễn Văn A' },
        error: null,
      }),
    })

    // Make signOut trigger auth state change
    ;(supabase.auth.signOut as jest.Mock).mockImplementation(() => {
      authStateCallback?.('SIGNED_OUT', null)
      return Promise.resolve({})
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.user).not.toBeNull())
    expect(result.current.user?.role).toBe('sale')

    await result.current.signOut()

    await waitFor(() => expect(result.current.user).toBeNull())
  })

  // Role-based profile loading
  const roles = [
    { role: 'sale', label: 'Nhân viên kinh doanh' },
    { role: 'customer', label: 'Khách hàng' },
    { role: 'warehouse', label: 'Nhân viên kho' },
    { role: 'accountant', label: 'Kế toán' },
    { role: 'director', label: 'Giám đốc' },
  ]

  roles.forEach(({ role, label }) => {
    it(`tải profile đúng vai trò ${label} (${role})`, async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      })

      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { role, full_name: 'Người dùng Test' },
          error: null,
        }),
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.user?.role).toBe(role)
      expect(result.current.user?.full_name).toBe('Người dùng Test')
    })
  })

  it('duy trì phiên đăng nhập qua onAuthStateChange', async () => {
    const mockUser = { id: 'user-456', email: 'session@example.com', phone: '0912345678' }

    // Start with no session
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()

    // Simulate session being created elsewhere
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'admin', full_name: 'Admin Test' },
        error: null,
      }),
    })

    authStateCallback?.('SIGNED_IN', { user: mockUser })

    await waitFor(() => {
      expect(result.current.user).not.toBeNull()
    })

    expect(result.current.user?.role).toBe('admin')
    expect(result.current.user?.email).toBe('session@example.com')
  })
})
