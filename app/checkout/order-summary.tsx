'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatPrice } from '@/lib/utils'
import { Info, Tag } from 'lucide-react'
import Image from 'next/image'

import { Cart } from '../cart/types/cart.types'
import OrderNote from './order-note'

type Props = {
  cart: Cart | null
}

const OrderSummary: React.FC<Props> = ({ cart }) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className='xl:max-w-[440px]'>
        <h3 className='font-bold text-md lg:text-xl'>Tóm tắt đơn hàng</h3>
        <p className='text-gray-500 mt-4'>Giỏ hàng trống</p>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0)
  const discountAmount = parseInt(cart.discountTotal) || 0
  const total = subtotal - discountAmount

  return (
    <div className='xl:max-w-[440px] xl:sticky xl:top-0 xl:h-fit pb-6 lg:pb-0 border-b lg:border-b-0'>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-bold text-md lg:text-xl'>
            Tóm tắt đơn hàng <span>({cart.items.length})</span>
          </h3>
        </div>
      </div>

      <div className='space-y-4 mb-6'>
        {cart.items.map((item) => (
          <div key={item.id} className='flex gap-4'>
            <div className='w-20 h-20 relative'>
              <Image
                src={item.productImageUrl || '/placeholder-product.jpg'}
                alt={item.productName}
                fill
                className='object-cover rounded'
                unoptimized
              />
            </div>

            <div className='flex-1'>
              <div className='flex justify-between'>
                <div className='flex-1'>
                  <h4 className='font-semibold text-base mb-1'>{item.productName}</h4>
                  <p className='text-sm text-gray-600'>
                    {item.variant && <>{item.variant.name}</>}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>Số lượng: {item.quantity}</p>
                </div>

                <div className='text-right flex items-end'>
                  <div className='font-medium text-sm'>
                    {formatPrice(item.currentPrice * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='border-t border-gray-300 pt-4 space-y-3'>
        <div className='flex justify-between text-sm'>
          <span>Tạm tính:</span>
          <span className='font-medium'>{formatPrice(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Khuyến mãi:</span>
              <span className='text-green-600 font-medium'>-{formatPrice(discountAmount)}</span>
            </div>

            {cart.promotions && cart.promotions.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {cart.promotions.map((promo, index) => (
                  <div
                    key={index}
                    className='inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-800 px-2 py-1 rounded text-xs'
                  >
                    <Tag className='w-3 h-3' />
                    {promo.code ? (
                      <span className='font-medium'>{promo.code}</span>
                    ) : (
                      <span className='font-medium'>{promo.title}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className='flex justify-between text-sm'>
          <div className='flex items-center gap-2'>
            <span>Phí vận chuyển:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='w-4 h-4 text-gray-500 cursor-help' />
              </TooltipTrigger>
              <TooltipContent
                className='text-pretty'
                style={
                  {
                    '--foreground': 'var(--color-gray-950)',
                    '--background': 'white',
                  } as React.CSSProperties
                }
              >
                <p>Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {cart.freeShipping ? (
            <span className='text-green-600 font-medium'>Miễn phí</span>
          ) : (
            <span className='text-gray-900 font-medium'>Có tính phí</span>
          )}
        </div>

        <div className='flex justify-between text-lg font-bold pt-3 border-t border-gray-300'>
          <span>Tổng cộng:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <OrderNote className='lg:block hidden mt-8' />
    </div>
  )
}

export default OrderSummary
