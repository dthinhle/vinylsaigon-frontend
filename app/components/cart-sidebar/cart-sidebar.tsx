'use client'

import { getItemBundlePromotions } from '@/app/cart/utils/bundle-helper'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_VARIANT_NAME } from '@/lib/constants'
import { cn, formatPrice } from '@/lib/utils'
import { sumBy } from 'lodash'
import { BadgeCheck, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback } from 'react'

import logoBlack from '@/public/assets/logo-black.svg'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../components/ui/sheet'
import QuantityControls from '../../cart/components/cart-items/quantity-controls'
import { Cart, CartItem } from '../../cart/types/cart.types'
import { useCartStore } from '../../store/cart-store'
import * as React from 'react'

type Props = {
  open: boolean
  onOpenChange: () => void
}

type CartItemProps = {
  item: CartItem
  cart: Cart | null
  handleQuantityChange: (item: CartItem, newQty: number) => void
  handleRemoveItem: (itemId: string) => void
}

const CartItemList = ({ item, handleQuantityChange, handleRemoveItem, cart }: CartItemProps) => {
  const isLoading = useCartStore((state) => state.loading)
  const bundlePromotions = getItemBundlePromotions(item, cart)

  return (
    <div key={item.id} className='flex gap-4 items-start p-4'>
      <div className='relative w-20 h-20'>
        <Image
          src={item.productImageUrl || logoBlack.src}
          alt={item.productName || 'Product'}
          fill
          className='object-cover rounded-md bg-gray-50'
          unoptimized
        />
      </div>

      <div className='flex-1 min-h-20 flex flex-col justify-between'>
        <div className='flex justify-between items-start'>
          <h3 className='font-medium line-clamp-2'>{item.productName}</h3>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className={cn('text-gray-950 hover:text-gray-700', isLoading && 'cursor-not-allowed animate-pulse')}
              aria-label='Remove item'
              disabled={isLoading}
            >
              <X className='size-4' />
            </button>
        </div>

        <div className='w-full flex gap-2'>
          {item.variant &&
            item.variant.name !== DEFAULT_VARIANT_NAME &&
            Object.keys(item.variant).length > 0 && (
              <div className='variant-wrap'>
                <span className='text-xs bg-sea-buckthorn-400 text-white flex-0 py-1 rounded-sm px-2 whitespace-nowrap'>
                  {item.variant.name}
                </span>
              </div>
            )}
          {bundlePromotions.length > 0 && (
            <Badge variant='bundle' className={'mt-0.5 gap-1 px-1.5 cursor-auto'}>
              <BadgeCheck className='size-3' />
              Combo
            </Badge>
          )}
        </div>

        <div className='mt-2 flex justify-between items-center'>
          <QuantityControls
            value={item.quantity}
            onChange={(newQty) => handleQuantityChange(item, newQty)}
            max={item.maxQuantity || 99}
          />
          <span className='font-medium'>{formatPrice(item.currentPrice)}</span>
        </div>
      </div>
    </div>
  )
}

const CartSidebar: React.FC<Props> = ({ open, onOpenChange }) => {
  const cartItems = useCartStore((state) => state.cartItems)
  const cart = useCartStore((state) => state.cart)
  const isLoading = useCartStore((state) => state.loading)
  const cartSummary = useCartStore((state) => state.cartSummary)
  const updateItem = useCartStore((state) => state.updateItem)
  const removeItem = useCartStore((state) => state.removeItem)

  const totalItems = sumBy(cartItems, (item) => item.quantity)

  const handleQuantityChange = useCallback(
    async (item: CartItem, newQty: number) => {
      if (newQty <= 0) {
        await removeItem(item.id)
      } else {
        await updateItem(item.id, newQty)
      }
    },
    [removeItem, updateItem],
  )

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      await removeItem(itemId)
    },
    [removeItem],
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className='border-none bg-white gap-0 w-full'
        closeButtonClassName='text-gray-950 h-6 hover:text-gray-700'
      >
        <SheetHeader className='border-b border-gray-200'>
          <SheetTitle className={'text-lg gap-3 flex items-center'}>
            Giỏ hàng ({totalItems})
            {isLoading && <div className='animate-spin inline-flex mr-2 align-baseline rounded-full size-4 border-2 border-gray-300 border-t-gray-500'></div>}
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          {cartItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <p className='text-gray-500'>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {cartItems.map((item) => (
                <CartItemList
                  key={item.id}
                  item={item}
                  cart={cart}
                  handleQuantityChange={handleQuantityChange}
                  handleRemoveItem={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className='border-t border-gray-200 pt-3'>
            <div className='flex justify-between items-center px-4'>
              <span className='text-gray-600'>Tạm tính</span>
              <span className='font-bold text-lg'>{formatPrice(cartSummary.subtotal)}</span>
            </div>
            {cart?.promotions && cart.promotions.length > 0 && (
              <div className='px-4 mt-2 space-y-1'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Giảm giá</span>
                  <span className='font-medium'>-{formatPrice(cartSummary.discount)}</span>
                </div>
                <ul>
                  {cart.promotions.map((promotion) => (
                    <li key={promotion.id} className='flex justify-between items-center pl-2'>
                      <span className='text-green-600 text-sm'>{promotion.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='flex justify-between items-center px-4 mt-3 pt-3 border-t border-gray-200'>
              <span className='text-gray-900 font-semibold'>Tổng cộng</span>
              <span className='font-bold text-xl'>{formatPrice(cartSummary.total)}</span>
            </div>
            <a
              href='/gio-hang'
              className='block w-full text-center bg-black text-white py-3 hover:bg-gray-800 transition-colors mt-4'
            >
              Xem giỏ hàng và thanh toán
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSidebar
