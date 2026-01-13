import { DEFAULT_VARIANT_NAME } from '@/lib/constants'
import * as React from 'react'

interface CartItemDetailsProps {
  name: string | number
  variant: string | number
}

const CartItemDetails: React.FC<CartItemDetailsProps> = ({ name, variant }) => (
  <div className=''>
    <div className='text-md font-bold max-w-30 lg:max-w-50 md:text-base truncate'>{String(name)}</div>
    {
      variant !== DEFAULT_VARIANT_NAME && (
        <div className='text-sm truncate text-gray-500'>{String(variant)}</div>
      )
    }
  </div>
)

export default CartItemDetails
