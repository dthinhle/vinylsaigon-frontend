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

interface CartItemMobileProps {
  item: CartItemType
}

const CartItemMobile: React.FC<CartItemMobileProps> = ({ item }) => {
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
      className="grid grid-cols-[3.75rem_min(3fr,7rem)_2fr] grid-rows-2 gap-x-2 [grid-template-areas:'image_item_price''._quantity_remove']"
      role='listitem'
      tabIndex={-1}
      aria-label={`Cart item: ${item.name}, variant: ${item.variant?.name ?? ''}, quantity: ${item.quantity}, price: ${item.price}`}
    >
      <div className='flex items-center justify-center [grid-area:image]'>
        <div className='w-16 h-16 object-cover rounded overflow-hidden'>
          <CartItemImage
            imageUrl={item.image || item.productImageUrl || ''}
            alt={item.name || item.productName || ''}
          />
        </div>
      </div>
      <div className='flex [grid-area:item] items-start'>
        <div className='w-full space-y-1'>
          <CartItemDetails
            name={item.name || item.productName || ''}
            variant={item.variant?.name ?? ''}
          />
          {bundlePromotions.length > 0 && (
            <div className='flex gap-1 flex-wrap'>
              {bundlePromotions.map((promotion) => (
                <BundleBadge key={promotion.id} promotion={promotion} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='flex items-center [grid-area:quantity]'>
        <QuantityControls value={getLatestQuantity()} onChange={handleQuantityChange} />
      </div>
      <div className='flex items-center justify-end [grid-area:price]'>
        <CartItemPrice item={item} />
      </div>
      <div className='flex items-center justify-end [grid-area:remove]'>
        <CartItemRemoveButton onRemove={handleRemove} />
      </div>
    </div>
  )
}

export default CartItemMobile
