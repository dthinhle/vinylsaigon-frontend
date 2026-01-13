import { CartItem } from '@/app/cart/types/cart.types'
import { formatPrice } from '@/lib/utils'
import * as React from 'react'

interface CartItemPriceProps {
  item?: CartItem
  price?: number
}

const CartItemPrice: React.FC<CartItemPriceProps> = ({ item, price }) => {
  if (price !== undefined) {
    return <span className='text-md md:text-base text-gray-900'>{formatPrice(price)}</span>
  }

  if (!item) {
    return null
  }

  const hasDiscount = item.originalPrice > item.currentPrice

  return (
    <div className='flex flex-col items-start md:gap-0.5 self-start'>
      <span className='text-md md:text-base text-gray-900 font-medium'>
        {formatPrice(item.currentPrice)}
      </span>
      {hasDiscount && (
        <span className='text-xs text-gray-500 line-through'>
          {formatPrice(item.originalPrice)}
        </span>
      )}
    </div>
  )
}

export default CartItemPrice
