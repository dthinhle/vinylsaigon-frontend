'use client'

import { useCartStore } from '@/app/store/cart-store'
import { ShoppingCart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'

export function CartButton() {
  const variants = React.useMemo(
    () => ({
      initial: {
        scale: 0.5,
        opacity: 0,
      },
      change: {
        scale: 1.2,
        opacity: 1,
        translateY: -6,
        scaleY: 0.9,
        filter: 'brightness(1.2)',
      },
      exit: {
        scale: 0,
        opacity: 0,
      },
      idle: {
        scale: 1,
        opacity: 1,
      },
    }),
    [],
  )
  const cart = useCartStore((state) => state.cart)
  const [countVariant, setCountVariant] = React.useState('idle')
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const itemCount = cart?.totalItems || 0

  React.useEffect(() => {
    setCountVariant('change')
    clearTimeout(timeoutRef.current as NodeJS.Timeout)
    timeoutRef.current = setTimeout(() => {
      setCountVariant('idle')
    }, 200)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [itemCount])

  return (
    <Link href='/gio-hang' className='relative'>
      <ShoppingCart strokeWidth={1.25} className='cursor-pointer hover:text-gray-700' />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial='initial'
            animate={countVariant}
            exit='exit'
            variants={variants}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className='absolute -top-1 -right-2 bg-amber-500 text-white text-[8px] min-w-4 rounded-full p-0.5 flex items-center justify-center'
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// Fallback component for when cart provider is not available
export function CartButtonFallback() {
  return (
    <Link href='/gio-hang'>
      <ShoppingCart strokeWidth={1.25} className='cursor-pointer hover:text-gray-700' />
    </Link>
  )
}
