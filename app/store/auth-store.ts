import { getUser } from '@/app/api/user'
import { sessionManager } from '@/app/cart/services/cart-api'
import { apiClient } from '@/lib/axios'
import { IUser } from '@/lib/types/user'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface AuthStore {
  // State
  user: IUser | null
  loading: boolean
  mounted: boolean

  // Actions
  setMounted: (mounted: boolean) => void
  refresh: () => Promise<void>
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signUp: (credentials: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>

  // Internal helpers
  _setUser: (user: IUser | null) => void
  _setLoading: (loading: boolean) => void
  _dispatchAuthStateChange: (user: IUser | null) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      loading: true,
      mounted: false,

      // Internal helper to dispatch auth state change events
      _dispatchAuthStateChange: (userData) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authStateChange', { detail: { user: userData } }))
        }
      },

      // Internal helper to set user and sync to localStorage
      _setUser: (userData) => {
        set({ user: userData })
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          localStorage.removeItem('user')
        }
        get()._dispatchAuthStateChange(userData)
      },

      // Internal helper to set loading state
      _setLoading: (loading) => {
        set({ loading })
      },

      // Set mounted state
      setMounted: (mounted) => {
        set({ mounted })
      },

      // Refresh user data from API
      refresh: async () => {
        const { mounted, _setUser, _setLoading } = get()
        if (!mounted) return

        _setLoading(true)
        try {
          const freshUser = (await getUser()) as IUser
          if (freshUser) {
            const { user: prevUser } = get()
            // Merge fresh data with existing user data
            const updatedUser = prevUser ? { ...prevUser, ...freshUser } : freshUser
            _setUser(updatedUser)
          } else {
            _setUser(null)
          }
        } catch {
          _setUser(null)
        }
        _setLoading(false)
      },

      // Sign out
      signOut: async () => {
        const { _setUser } = get()
        try {
          await apiClient.post('/auth/log_out')
          _setUser(null)
          // Router navigation handled by component
        } catch (error) {
          console.error(error)
          _setUser(null)
          // Router navigation handled by component even on error
        }
      },

      // Sign in
      signIn: async ({ email, password }) => {
        const { _setUser } = get()
        try {
          const res = await apiClient.post(
            '/auth/sign_in',
            { email, password },
            {
              headers: sessionManager.getSessionHeaders(),
            },
          )
          if (res.status === 200) {
            const userData = res.data as IUser
            _setUser(userData)
            // Router navigation handled by component
          } else {
            throw new Error('Sai thông tin đăng nhập')
          }
        } catch (error) {
          console.error(error)
          throw new Error('Đăng nhập thất bại')
        }
      },

      // Sign up
      signUp: async ({ email, password }) => {
        const { _setUser } = get()
        try {
          const res = await apiClient.post('/auth/sign_up', { email, password })
          if (res.status === 200) {
            const userData = res.data
            _setUser(userData)
            // Router navigation handled by component
          } else {
            throw new Error('Đăng ký thất bại')
          }
        } catch (error) {
          console.error(error)
          throw new Error('Đăng ký thất bại')
        }
      },
    }),
    {
      name: 'auth-store',
    },
  ),
)
