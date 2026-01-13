'use client'

import { useEffect, useState } from 'react'

interface LocalCartState {
  totalItems: number
  lastUpdated: number
}

const CART_STORAGE_KEY = 'cart-state'

const defaultCartState: LocalCartState = {
  totalItems: 0,
  lastUpdated: Date.now(),
}

export const useLocalCart = () => {
  const [cartState, setCartState] = useState<LocalCartState>(defaultCartState)

  // Load cart state from localStorage on mount
  useEffect(() => {
    const loadCartState = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as LocalCartState
          setCartState(parsed)
        }
      } catch (error) {
        console.error('Failed to load cart state from localStorage:', error)
        // Reset to default state if parsing fails
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(defaultCartState))
      }
    }

    loadCartState()

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue) as LocalCartState
          setCartState(newState)
        } catch (error) {
          console.error('Failed to parse cart state from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const updateCartState = (newState: Partial<LocalCartState>) => {
    const updatedState: LocalCartState = {
      ...cartState,
      ...newState,
      lastUpdated: Date.now(),
    }

    setCartState(updatedState)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedState))
  }

  return {
    cartState,
    updateCartState,
    totalItems: cartState.totalItems,
  }
}

// Utility functions for other components to update cart state
// Debounce utility
let cartEventTimeout: ReturnType<typeof setTimeout> | null = null
let pendingCartState: LocalCartState | null = null

export const updateLocalCartTotalItems = (totalItems: number) => {
  const currentState = getLocalCartState()
  const newState: LocalCartState = {
    ...currentState,
    totalItems,
    lastUpdated: Date.now(),
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState))

  // Debounced custom event dispatch
  pendingCartState = newState
  if (cartEventTimeout) clearTimeout(cartEventTimeout)
  cartEventTimeout = setTimeout(() => {
    if (pendingCartState) {
      window.dispatchEvent(new CustomEvent('cartStateChange', { detail: pendingCartState }))
      pendingCartState = null
    }
  }, 200) // 200ms debounce interval
}

export const getLocalCartState = (): LocalCartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as LocalCartState
    }
  } catch (error) {
    console.error('Failed to get cart state from localStorage:', error)
  }
  return defaultCartState
}
