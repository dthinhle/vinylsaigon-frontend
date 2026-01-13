'use client'

import { useAuthStore } from '@/app/store/auth-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { useRouter } from 'next/navigation'

/**
 * Hook for authentication-related utilities
 */
export function useAuthGuard() {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const router = useRouter()

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !loading && !!user

  /**
   * Check if authentication is still loading
   */
  const isLoading = loading

  /**
   * Require authentication - redirect to sign in if not authenticated
   */
  const requireAuth = (redirectTo: string = FRONTEND_PATH.signIn) => {
    if (!loading && !user) {
      router.replace(redirectTo)
      return false
    }
    return !loading && !!user
  }

  /**
   * Require guest - redirect to profile if authenticated
   */
  const requireGuest = (redirectTo: string = FRONTEND_PATH.viewProfile) => {
    if (!loading && user) {
      router.replace(redirectTo)
      return false
    }
    return !loading && !user
  }

  /**
   * Navigate to protected route only if authenticated
   */
  const navigateIfAuthenticated = (path: string) => {
    if (isAuthenticated) {
      router.push(path)
    } else {
      router.push(FRONTEND_PATH.signIn)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    requireAuth,
    requireGuest,
    navigateIfAuthenticated,
  }
}
