'use client'

import { CheckoutButton } from '@/app/cart/components/checkout-actions/checkout-button'
import { OrderSummaryItem } from '@/app/cart/components/order-summary/order-summary-item'
import { PromoCodeSection } from '@/app/cart/components/order-summary/promo-code-section'
import { useCartStore } from '@/app/store/cart-store'
import { cn, formatPrice } from '@/lib/utils'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import * as React from 'react'

import { PaymentMethods } from '../payment-methods/payment-methods'

export const OrderSummary: React.FC = () => {
  const { loading, cartSummary, cart } = useCartStore()
  const [expanded, setExpanded] = React.useState(true)

  const handleHeaderKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setExpanded((v) => !v)
    }
  }, [])

  return (
    <section
      className={cn(
        loading ? 'animate-pulse' : '',
        'bg-white rounded-lg w-full md:max-w-md md:mx-auto md:static md:pt-4 md:mt-0 sticky top-4 z-10 p-0 mt-0',
      )}
      aria-label='Tóm tắt đơn hàng'
    >
      <div
        className='md:hidden border-b border-gray-200 py-4 flex items-center justify-between cursor-pointer focus:outline-none'
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={handleHeaderKeyDown}
        aria-expanded={expanded}
        aria-controls='order-summary-content'
        role='button'
        tabIndex={0}
      >
        <h2 className='text-lg font-semibold text-gray-900'>Tóm tắt đơn hàng</h2>
        <ChevronDownIcon
          className={`h-5 w-5 transform transition-transform ${expanded ? '' : 'rotate-180'}`}
          aria-hidden='true'
        />
      </div>
      <div
        id='order-summary-content'
        data-collapsed={expanded ? undefined : ''}
        className={cn(
          'data-collapsed:max-h-0 data-collapsed:lg:max-h-none',
          'bg-white transition-all duration-300 lg:overflow-visible overflow-hidden md:p-0 ease-in-out lg:block lg:border-b-0',
        )}
        aria-hidden={!expanded}
        aria-labelledby='order-summary-header'
      >
        <h2 className='hidden md:block text-lg font-semibold text-gray-900'>Tóm tắt đơn hàng</h2>
        <hr className='hidden md:block border-gray-200 mt-3' />
        <div className='mt-4 space-y-2'>
          <OrderSummaryItem label='Tạm tính:' value={cartSummary.subtotal} formatString />
          {cart?.promotions && cart.promotions.length > 0 && (
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <span>Giảm giá:</span>
                <span className='text-gray-600'>-{formatPrice(cartSummary.discount)}</span>
              </div>
              <ul>
                {cart.promotions.map((promotion) => (
                  <li
                    key={promotion.id}
                    className='flex justify-between text-sm text-green-600 pl-2'
                  >
                    <span>{promotion.code}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <OrderSummaryItem
            label='Phí vận chuyển:'
            value={cartSummary.freeShipping ? 'Miễn phí vận chuyển' : 'Có tính phí'}
          />
          <OrderSummaryItem
            label='Tổng cộng (ước tính):'
            value={cartSummary.total}
            bold
            formatString
          />
        </div>
        <hr className='mt-5 border-gray-200' />
        <PromoCodeSection />
        <div className='mt-6 hidden md:block'>
          <CheckoutButton />
        </div>
        <div className='block md:hidden'>
          <div className='fixed bottom-0 left-0 w-full z-20 bg-white border-t border-gray-200'>
            <CheckoutButton />
          </div>
        </div>
        <section className='mt-6' aria-label='Payment methods'>
          <PaymentMethods />
        </section>
        <hr className='mt-4 border-gray-300' />
        <section className='py-4 flex justify-end' aria-label='Cart feedback'>
          <span className='text-base font-medium text-gray-700'>
            <b>Để lại phản hồi</b> về trải nghiệm mua hàng của bạn
          </span>
        </section>
      </div>
    </section>
  )
}
