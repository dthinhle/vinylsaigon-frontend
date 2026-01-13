'use client'

import LoadingSpinner from '@/app/components/blog/loading-spinner'
import { useAuthStore } from '@/app/store/auth-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  redirectTo = FRONTEND_PATH.signIn,
  fallback,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <LoadingSpinner />
        </div>
      )
    )
  }

  // If no user, don't render children (redirect is handled by useEffect)
  if (!user) {
    return null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
