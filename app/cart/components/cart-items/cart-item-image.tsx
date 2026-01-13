import Image from 'next/image'
import * as React from 'react'

interface CartItemImageProps {
  imageUrl: string
  alt: string
}

const CartItemImage: React.FC<CartItemImageProps> = ({ imageUrl, alt }) => (
  <div className='w-15 h-15 flex items-center justify-center bg-gray-50 rounded overflow-hidden'>
    <Image
      src={imageUrl}
      alt={alt}
      className='object-cover w-full h-full'
      height={120}
      width={120}
      draggable={false}
      loading='lazy'
      unoptimized
    />
  </div>
)

export default CartItemImage
