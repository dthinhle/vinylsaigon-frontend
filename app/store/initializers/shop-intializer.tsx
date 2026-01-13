'use client'

import { useEffect, useRef } from 'react'

import { useShopStore } from '../shop-store'

export function ShopInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    useShopStore.getState().fetchStore()
  }, [])

  return null
}
