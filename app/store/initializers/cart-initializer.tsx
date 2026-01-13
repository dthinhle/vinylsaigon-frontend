'use client'

import { useEffect, useRef } from 'react'

import { useCartStore } from '../cart-store'

/**
 * CartInitializer component
 *
 * This component properly initializes the cart store on the client-side,
 * avoiding SSR/hydration issues. It should be rendered once in the app layout.
 *
 * Usage:
 * ```tsx
 * // In your root layout or a top-level client component
 * <CartInitializer />
 * ```
 */
export function CartInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return
    initialized.current = true

    // Initialize cart on client-side mount
    useCartStore.getState().initializeCart()
  }, [])

  return null
}
