// Authentication components
export { ProtectedRoute } from './ProtectedRoute'
export { PublicRoute } from './PublicRoute'
export { withRouteGuard, withProtectedRoute, withPublicRoute } from './withRouteGuard'

// Re-export auth hook
export { useAuthGuard } from '../../hooks/use-auth-guard'
