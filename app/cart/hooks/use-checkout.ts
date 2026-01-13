'use client'

// src: useCheckout.ts
import { useCallback, useState } from 'react'

import { CartError, CartState } from '../types/cart.types'

// Analytics stub
function trackEvent(_event: string, _payload?: Record<string, unknown>) {
  // Replace with real analytics integration
  // e.g. window.gtag('event', event, payload)
}

const SESSION_CART_KEY = 'checkout_session_cart'

export const useCheckout = (cart: CartState | null) => {
  const [status, setStatus] = useState<'idle' | 'initiated' | 'persisted' | 'emailed' | 'error'>(
    'idle',
  )
  const [errors, setErrors] = useState<CartError[]>([])
  const [feedback, setFeedback] = useState<string>('')

  // Initiate checkout
  const initiateCheckout = useCallback(() => {
    if (!cart || cart.items.length === 0) {
      setErrors([{ code: 'EMPTY_CART', message: 'Cart is empty' }])
      setStatus('error')
      setFeedback('Cannot checkout with empty cart.')
      return
    }
    setStatus('initiated')
    setFeedback('Checkout initiated.')
    trackEvent('checkout_initiated', { cart })
  }, [cart])

  // Persist cart for session (localStorage)
  const persistCartForLater = useCallback(() => {
    if (!cart) {
      setErrors([{ code: 'NO_CART', message: 'No cart to persist' }])
      setStatus('error')
      setFeedback('No cart to persist.')
      return
    }
    try {
      localStorage.setItem(SESSION_CART_KEY, JSON.stringify({ data: cart, timestamp: Date.now() }))
      setStatus('persisted')
      setFeedback('Cart saved for later.')
      trackEvent('cart_persisted', { cart })
    } catch (_e) {
      setErrors([{ code: 'PERSIST_FAIL', message: 'Failed to persist cart' }])
      setStatus('error')
      setFeedback('Failed to save cart.')
    }
  }, [cart])

  // Email cart for later (stub)
  const emailCart = useCallback(
    (email: string) => {
      if (!cart) {
        setErrors([{ code: 'NO_CART', message: 'No cart to email' }])
        setStatus('error')
        setFeedback('No cart to email.')
        return
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrors([{ code: 'INVALID_EMAIL', message: 'Invalid email address' }])
        setStatus('error')
        setFeedback('Invalid email address.')
        return
      }
      // Replace with real email logic
      setStatus('emailed')
      setFeedback('Cart emailed for later.')
      trackEvent('cart_emailed', { cart, email })
    },
    [cart],
  )

  // Track abandonment (call on unmount or navigation away)
  const trackAbandonment = useCallback(() => {
    if (cart && cart.items.length > 0) {
      trackEvent('cart_abandoned', { cart })
    }
  }, [cart])

  return {
    status,
    errors,
    feedback,
    initiateCheckout,
    persistCartForLater,
    emailCart,
    trackAbandonment,
  }
}
