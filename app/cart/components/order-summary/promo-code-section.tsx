'use client'

import { Input } from '@/app/cart/ui/input'
import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons'
import * as React from 'react'

export const PromoCodeSection: React.FC = () => {
  const applyPromotion = useCartStore((state) => state.applyPromotion)
  const [input, setInput] = React.useState('')
  const [promoCodeState, setPromoCodeState] = React.useState({
    code: '',
    isApplied: false,
    discountAmount: 0,
    success: false,
    error: undefined as string | undefined,
    isLoading: false,
  })
  const [loading, setLoading] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [justApplied, setJustApplied] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      setExpanded((v) => !v)
    }
  }

  const handleApply = async () => {
    if (!input.trim()) return

    setLoading(true)
    setPromoCodeState((prev) => ({ ...prev, error: undefined }))

    try {
      const cart = await applyPromotion([input.trim()])

      const discountAmount = cart.discountTotal ? parseFloat(cart.discountTotal) : 0

      setPromoCodeState({
        code: input,
        isApplied: true,
        discountAmount,
        success: true,
        error: undefined,
        isLoading: false,
      })
      setJustApplied(true)
      setTimeout(() => setJustApplied(false), 3000)
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid promo code'
      setPromoCodeState({
        code: input,
        isApplied: false,
        discountAmount: 0,
        error: errorMessage,
        success: false,
        isLoading: false,
      })
      setJustApplied(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='mt-6' aria-label='Promo code section'>
        <Button
          type='button'
          className='flex items-center w-full justify-between text-md font-medium text-gray-700 focus:outline-none rounded transition-colors focus:ring-0 focus:border-0 focus:shadow-none active:ring-0 active:border-0 active:shadow-none border-none shadow-none !pl-0'
          aria-expanded={expanded}
          aria-controls='promo-code-content'
          onClick={() => {
            setExpanded((v) => !v)
          }}
          onKeyDown={handleHeaderKeyDown}
          id='promo-code-toggle'
        >
          <span>Bạn có mã khuyến mãi?</span>
          <ChevronDownIcon
            className={cn(
              'size-5 ml-2 transform transition-transform duration-300',
              expanded ? 'rotate-180' : '',
            )}
            aria-hidden='true'
          />
        </Button>
        <div
          id='promo-code-content'
          ref={contentRef}
          className={cn(
            'lg:overflow-visible overflow-hidden transition-all duration-300',
            expanded
              ? 'max-h-[500px] opacity-100 pointer-events-auto'
              : 'max-h-0 opacity-0 pointer-events-none',
          )}
          aria-hidden={!expanded}
          tabIndex={expanded ? 0 : -1}
        >
          <div className='flex items-center lg:gap-4 gap-2 mt-4 lg:p-0 p-0.5'>
            <Input
              id='promo-code'
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              error={promoCodeState.error}
              loading={loading}
              aria-label='Nhập mã khuyến mãi'
              aria-invalid={!!promoCodeState.error}
              aria-describedby={promoCodeState.error ? 'promo-error' : undefined}
              disabled={loading}
              placeholder='Nhập mã khuyến mãi'
              className='flex-1 border h-[48px] w-full pl-4 focus-visible:border-none'
            />
            <Button
              onClick={handleApply}
              disabled={loading || !input}
              variant='default'
              aria-label='Áp dụng mã khuyến mãi'
              className='bg-black text-white hover:bg-black/70 border-none rounded-none shadow-none focus:ring-2 focus:ring-sea-buckthorn-400 min-h-[48px] min-w-[90px]'
            >
              Áp dụng
            </Button>
          </div>
          {promoCodeState.error && (
            <div
              id='promo-error'
              className='text-xs text-red-600 mt-2 animate-fade-in motion-reduce:animate-none flex items-center'
              role='alert'
              aria-live='polite'
            >
              <Cross2Icon className='size-4 mr-1 flex-shrink-0 text-red-500' aria-hidden='true' />
              {promoCodeState.error}
            </div>
          )}
        </div>
      </div>
      {justApplied && promoCodeState.success && (
        <div
          className='flex items-center text-green-500 animate-fade-in motion-reduce:animate-none mt-2'
          role='status'
          aria-live='polite'
        >
          <CheckIcon className='size-5 mr-1' aria-hidden='true' />
          Mã khuyến mãi đã được áp dụng thành công!
        </div>
      )}
    </>
  )
}
