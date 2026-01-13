'use client'

import { toast as sonnerToast } from 'sonner'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastOptions {
  type: ToastType
  title: string
  message?: string
  duration?: number
}

/**
 * Custom toast hook using Sonner library
 * Use this instead of calling toast directly for consistent styling
 */
export function useToast() {
  const addToast = (options: ToastOptions) => {
    const { type, title, message, duration } = options
    const description = message || undefined
    const config = {
      duration: duration || 5000,
    }

    switch (type) {
      case 'success':
        sonnerToast.success(title, { description, ...config })
        break
      case 'error':
        sonnerToast.error(title, { description, ...config })
        break
      case 'info':
        sonnerToast.info(title, { description, ...config })
        break
      default:
        sonnerToast(title, { description, ...config })
    }
  }

  return { addToast }
}
