'use client'

import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronDownIcon, Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export const EmailCartButton: React.FC = () => {
  const emailCart = useCartStore((state) => state.emailCart)
  const emailLoading = useCartStore((state) => state.emailLoading)
  const emailSuccess = useCartStore((state) => state.emailSuccess)
  const emailError = useCartStore((state) => state.emailError)
  const resetEmailState = useCartStore((state) => state.resetEmailState)
  const initializeCart = useCartStore((state) => state.initializeCart)
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [expanded, setExpanded] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const successTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setExpanded((v) => !v)
    }
  }

  const sendEmailToCart = React.useCallback(async () => {
    try {
      await emailCart(email, false)
      setEmail('') // Clear input on success

      // Auto-collapse after 5 seconds
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      successTimeoutRef.current = setTimeout(async () => {
        resetEmailState()
        setExpanded(false)

        await router.push(FRONTEND_PATH.root)
        initializeCart(true)
      }, 3000)
    } catch (_err) {
      // Error is already handled in the hook
    }
  }, [email, router, initializeCart, emailCart, resetEmailState])

  // Debounced version of sendEmailToCart
  const handleSend = React.useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout (debounce)
    timeoutRef.current = setTimeout(() => {
      sendEmailToCart()
    }, 300)
  }, [sendEmailToCart])

  return (
    <div
      className='mt-6 flex flex-col md:flex-row gap-4 justify-end w-full'
      aria-label='Email cart section'
    >
      <div>
        <Button
          type='button'
          variant='ghost'
          className='flex w-full justify-start md:justify-end text-md text-gray-800 font-medium rounded transition-colors focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none active:ring-0 active:border-0 active:shadow-none cursor-pointer !pl-0'
          aria-expanded={expanded}
          aria-controls='email-cart-content'
          onClick={() => setExpanded((v) => !v)}
          onKeyDown={handleHeaderKeyDown}
          id='email-cart-toggle'
        >
          <span>Gửi giỏ hàng qua email</span>
          <ChevronDownIcon
            className={`size-5 ml-2 transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden='true'
          />
        </Button>
        <div
          id='email-cart-content'
          ref={contentRef}
          className={cn(
            'lg:overflow-visible overflow-hidden transition-all duration-300 lg:p-0 p-0.5',
            expanded
              ? 'max-h-[500px] opacity-100 pointer-events-auto'
              : 'max-h-0 opacity-0 pointer-events-none',
          )}
          aria-hidden={!expanded}
          tabIndex={expanded ? 0 : -1}
        >
          <div className='flex items-center gap-2 mt-4'>
            <Input
              id='email-cart'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label='Nhập địa chỉ email'
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              disabled={emailLoading}
              placeholder='Nhập địa chỉ email'
              className='flex-1 border h-[48px] w-full lg:pl-4 pl-2 rounded-none text-gray-600'
            />
            <Button
              type='button'
              onClick={handleSend}
              disabled={emailLoading || !email}
              aria-label='Send cart to email'
              className='hover:bg-black/70 rounded-none bg-black text-white border-none shadow-none focus:ring-2 focus:ring-gray-500 min-h-[48px] min-w-[90px] cursor-pointer'
            >
              {emailLoading ? (
                <>
                  <ReloadIcon
                    className='animate-spin motion-reduce:animate-none h-4 w-4 mr-2 text-gray-500'
                    aria-hidden='true'
                  />
                  Đang gửi...
                </>
              ) : (
                'Gửi'
              )}
            </Button>
          </div>
          {emailError && (
            <div
              id='email-error'
              className='text-xs text-red-600 mt-2 flex items-center'
              role='alert'
              aria-live='polite'
            >
              <Cross2Icon className='size-4 mr-1 flex-shrink-0 text-red-500' aria-hidden='true' />
              {emailError}
            </div>
          )}
          {emailSuccess && (
            <div
              className='text-xs text-green-600 mt-2 flex items-center'
              role='status'
              aria-live='polite'
            >
              <CheckIcon className='size-4 mr-1 flex-shrink-0 text-green-500' aria-hidden='true' />
              Giỏ hàng đã được gửi đến email của bạn
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
