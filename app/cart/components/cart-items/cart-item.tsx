'use client'

import { BundleBadge } from '@/app/cart/components/cart-items/bundle-badge'
import CartItemDetails from '@/app/cart/components/cart-items/cart-item-details'
import CartItemImage from '@/app/cart/components/cart-items/cart-item-image'
import CartItemPrice from '@/app/cart/components/cart-items/cart-item-price'
import CartItemRemoveButton from '@/app/cart/components/cart-items/cart-item-remove-button'
import QuantityControls from '@/app/cart/components/cart-items/quantity-controls'
import type { CartItem as CartItemType } from '@/app/cart/types/cart.types'
import { getItemBundlePromotions } from '@/app/cart/utils/bundle-helper'
import { useCartStore } from '@/app/store/cart-store'
import * as React from 'react'

interface CartItemProps {
  item: CartItemType
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const cartItems = useCartStore((state) => state.cartItems)
  const cart = useCartStore((state) => state.cart)
  const updateItem = useCartStore((state) => state.updateItem)
  const removeItem = useCartStore((state) => state.removeItem)

  const bundlePromotions = getItemBundlePromotions(item, cart)

  const getLatestQuantity = () => {
    const latestItem = cartItems.find((i) => i.id === item.id)
    return latestItem ? latestItem.quantity : item.quantity
  }

  const handleQuantityChange = (newQuantity: number) => {
    updateItem(item.id, newQuantity)
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  return (
    <div
      className='
        grid w-full items-center pb-4
        [grid-template-areas:"image_item_quantity_price_remove"]
        grid-cols-[3.75rem_1.2fr_1fr_1fr_3rem]
        grid-rows-1 gap-4
      '
      role='listitem'
      tabIndex={-1}
      aria-label={`Cart item: ${item.name}, variant: ${item.variant?.name ?? ''}, quantity: ${item.quantity}, price: ${item.price}`}
    >
      <div className='image flex items-center justify-center [grid-area:image]'>
        <div className='max-w-[60px] w-full h-auto object-cover rounded'>
          <CartItemImage
            imageUrl={item.image || item.productImageUrl || ''}
            alt={item.name || item.productName || ''}
          />
        </div>
      </div>

      <div className='item flex flex-col items-start truncate [grid-area:item] md:max-w-53'>
        <CartItemDetails
          name={item.name || item.productName || ''}
          variant={item.variant?.name ?? ''}
        />
      </div>

      <div className='quantity'>
        <div className='w-full md:w-auto'>
          <QuantityControls value={getLatestQuantity()} onChange={handleQuantityChange} />
        </div>
      </div>

      <div className='price [grid-area:price]'>
        <span className='w-full flex gap-2'>
          <CartItemPrice item={item} />

          {bundlePromotions.length > 0 && (
            <div className='size-6 flex gap-1 flex-wrap'>
              {bundlePromotions.map((promotion) => (
                <BundleBadge
                  key={promotion.id}
                  promotion={promotion}
                  badgeClassName='size-6 px-0.5!'
                />
              ))}
            </div>
          )}
        </span>
      </div>

      <div className='remove flex items-center justify-end [grid-area:remove] md:justify-center'>
        <CartItemRemoveButton onRemove={handleRemove} />
      </div>
    </div>
  )
}

export default CartItem
