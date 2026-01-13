'use client'

import { AuthInitializer } from './auth-initializer'
import { CartInitializer } from './cart-initializer'
import { ShopInitializer } from './shop-intializer'

/**
 * StoreInitializer component
 *
 * This component initializes all Zustand stores on the client-side,
 * avoiding SSR/hydration issues. It should be rendered once in the root layout.
 *
 * Usage:
 * ```tsx
 * // In app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <StoreInitializer />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function StoreInitializer() {
  return (
    <>
      <AuthInitializer />
      <CartInitializer />
      <ShopInitializer />
    </>
  )
}

export { AuthInitializer, CartInitializer }
