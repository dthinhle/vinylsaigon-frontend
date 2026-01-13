'use client'

import { useEffect, useRef } from 'react'

import { AuthStore, useAuthStore } from '../auth-store'

/**
 * AuthInitializer component
 *
 * This component properly initializes the auth store on the client-side,
 * avoiding SSR/hydration issues. It should be rendered once in the app layout.
 *
 * The initializer:
 * 1. Checks localStorage for stored user data
 * 2. Sets the user if found
 * 3. Fetches fresh user data in the background to verify/update
 * 4. Marks the store as mounted
 *
 * Usage:
 * ```tsx
 * // In your root layout or a top-level client component
 * <AuthInitializer />
 * ```
 */
export function AuthInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return
    initialized.current = true

    // Initialize auth state from localStorage on client-side mount
    const storedUser = localStorage.getItem('user')
    let nextState: Partial<AuthStore> = { mounted: true, loading: false }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        nextState.user = parsedUser

        // Fetch fresh data in the background to verify/update
        setTimeout(() => {
          useAuthStore.getState().refresh()
        }, 0)
      } catch {
        // Invalid JSON in localStorage, clear it
        localStorage.removeItem('user')
      }
    }

    useAuthStore.setState(nextState)
  }, [])

  return null
}
