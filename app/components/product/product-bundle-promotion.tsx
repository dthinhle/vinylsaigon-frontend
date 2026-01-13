'use client'

import { useCartStore } from '@/app/store/cart-store'
import { ProductBundle } from '@/lib/types/product'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import CartSidebar from '../cart-sidebar/cart-sidebar'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { FRONTEND_PATH } from '@/lib/constants'

type Props = {
  bundles: ProductBundle[]
}

const ProductBundlePromotion: React.FC<Props> = ({ bundles }) => {
  const addBundle = useCartStore((state) => state.addBundle)
  const isLoading = useCartStore((state) => state.loading)
  const [openCart, setOpenCart] = useState(false)

  const handleAddBundle = async (promotionId: number) => {
    try {
      await addBundle(promotionId)
      setOpenCart(true)
    } catch (error) {
      console.error('Failed to add bundle:', error)
    }
  }

  if (!bundles || bundles.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col gap-3'>
      <p className='font-bold'>Ưu đãi</p>
      <ul className='space-y-2 list-[square]'>
        {bundles.map((bundle) => (
          <li key={bundle.promotionId} className='flex items-center gap-2'>
            <div className='flex-1'>
              <p className='text-sm'>
                Giảm giá <span className='text-red-700 font-bold'>{formatPrice(bundle.discountValue)}</span> khi mua cùng với{' '}
                {bundle.otherProducts.map((item, index) => (
                  <Link key={index} className='font-bold' prefetch={false} href={FRONTEND_PATH.productDetail(item.productSlug)}>
                    {item.quantity < 2 ? '' : item.quantity + ' ⨉'} {item.productName}
                    {index < bundle.otherProducts.length - 1 ? ', ' : ''}
                  </Link>
                ))}
              </p>
            </div>
            <button
              onClick={() => handleAddBundle(bundle.promotionId)}
              className={
                cn(
                  'size-6 flex items-center justify-center rounded-full bg-gray-950 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                  isLoading ? 'cursor-wait bg-gray-600' : 'cursor-pointer',
                )
              }
              aria-label='Thêm combo vào giỏ hàng'
            >
              {
                isLoading
                  ? <div className={cn('size-4 border-2 border-white border-t-gray-500 border-solid rounded-full animate-spin')} />
                  : <Plus className={'size-4'} />
              }
            </button>
          </li>
        ))}
      </ul>
      {openCart && <CartSidebar open={openCart} onOpenChange={() => setOpenCart(false)} />}
    </div>
  )
}

export default ProductBundlePromotion
