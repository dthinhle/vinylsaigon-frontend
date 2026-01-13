'use client'

import { ComponentType } from 'react'

import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

interface RouteGuardOptions {
  type: 'protected' | 'public'
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * Higher-order component for route protection
 * @param Component - The component to wrap
 * @param options - Route guard configuration
 */
export function withRouteGuard<T extends object>(
  Component: ComponentType<T>,
  options: RouteGuardOptions,
) {
  const WrappedComponent = (props: T) => {
    if (options.type === 'protected') {
      return (
        <ProtectedRoute redirectTo={options.redirectTo} fallback={options.fallback}>
          <Component {...props} />
        </ProtectedRoute>
      )
    }

    return (
      <PublicRoute redirectTo={options.redirectTo} fallback={options.fallback}>
        <Component {...props} />
      </PublicRoute>
    )
  }

  // Set display name for debugging
  WrappedComponent.displayName = `withRouteGuard(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Convenience functions for common use cases
export const withProtectedRoute = <T extends object>(
  Component: ComponentType<T>,
  redirectTo?: string,
  fallback?: React.ReactNode,
) => withRouteGuard(Component, { type: 'protected', redirectTo, fallback })

export const withPublicRoute = <T extends object>(
  Component: ComponentType<T>,
  redirectTo?: string,
  fallback?: React.ReactNode,
) => withRouteGuard(Component, { type: 'public', redirectTo, fallback })
