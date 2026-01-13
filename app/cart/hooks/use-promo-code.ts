'use client'

// src: usePromoCode.ts
import { useState } from 'react'

import { CartState, PromoCode, PromoCodeState } from '../types/cart.types'

// Mock API endpoint for promo code validation
const _PROMO_API_URL = '/api/promo/validate' // Replace with real endpoint

async function validatePromoCodeAPI(code: string): Promise<PromoCode> {
  // Simulate API call
  // Replace with real fetch logic
  await new Promise((r) => setTimeout(r, 500))
  // Example: "SAVE10" gives $10 off, "PERCENT15" gives 15% off
  if (code === 'SAVE10') {
    return { code, discount: 10, isValid: true }
  }
  if (code === 'PERCENT15') {
    return { code, discount: 0.15, isValid: true } // percent
  }
  return { code, discount: 0, isValid: false, error: 'Invalid promo code' }
}

type UsePromoCodeParams = {
  cart: CartState | null
  setCart: (cart: CartState) => void
}

export const usePromoCode = ({ cart, setCart }: UsePromoCodeParams) => {
  const [promoState, setPromoState] = useState<PromoCodeState>({
    code: '',
    isApplied: false,
    discountAmount: 0,
    error: undefined,
    isLoading: false,
    success: false,
  })

  // Apply promo code
  const applyPromoCode = async (code: string) => {
    if (!cart) {
      setPromoState((prev) => ({
        ...prev,
        error: 'Cart not loaded',
        isApplied: false,
        isLoading: false,
        success: false,
      }))
      return
    }
    if (promoState.isApplied) {
      setPromoState((prev) => ({
        ...prev,
        error: 'Only one promo code can be applied',
        isLoading: false,
        success: false,
      }))
      return
    }
    setPromoState((prev) => ({
      ...prev,
      isLoading: true,
      error: undefined,
      success: false,
    }))

    const result = await validatePromoCodeAPI(code)

    if (!result.isValid) {
      setPromoState((prev) => ({
        ...prev,
        error: result.error || 'Invalid promo code',
        isApplied: false,
        isLoading: false,
        success: false,
      }))
      return
    }

    // Calculate discount
    let discountAmount = 0
    if (result.code === 'SAVE10') {
      discountAmount = 10
    } else if (result.code === 'PERCENT15') {
      discountAmount = Math.round(cart.summary.subtotal * 0.15)
    }

    // Update cart state
    const updatedCart: CartState = {
      ...cart,
      summary: {
        ...cart.summary,
        discount: discountAmount,
        total: cart.summary.subtotal + cart.summary.shipping + cart.summary.tax - discountAmount,
      },
      promoCode: {
        code: result.code,
        isApplied: true,
        discountAmount,
        success: true,
        error: undefined,
      },
    }

    setCart(updatedCart)

    setPromoState({
      code: result.code,
      isApplied: true,
      discountAmount,
      error: undefined,
      isLoading: false,
      success: true,
    })
  }

  // Remove promo code
  const removePromoCode = () => {
    if (!cart || !promoState.isApplied) return
    const updatedCart: CartState = {
      ...cart,
      summary: {
        ...cart.summary,
        discount: 0,
        total: cart.summary.subtotal + cart.summary.shipping + cart.summary.tax,
      },
      promoCode: {
        code: '',
        isApplied: false,
        discountAmount: 0,
        error: undefined,
        success: false,
      },
    }
    setCart(updatedCart)
    setPromoState({
      code: '',
      isApplied: false,
      discountAmount: 0,
      error: undefined,
      isLoading: false,
      success: false,
    })
  }

  return {
    promoCodeState: promoState,
    applyPromoCode,
    removePromoCode,
    error: promoState.error,
    success: promoState.success,
    loading: promoState.isLoading,
  }
}
