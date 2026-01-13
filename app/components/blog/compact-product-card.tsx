import { DEFAULT_VARIANT_NAME, FRONTEND_PATH } from '@/lib/constants'
import { ISimpleRelatedProduct } from '@/lib/types/product'
import { formatPrice } from '@/lib/utils'
import { ProductAdapter } from '@/lib/utils/product'
import logoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'

interface CompactProductCardProps {
  product: ISimpleRelatedProduct
}

export function CompactProductCard({ product: productHit }: CompactProductCardProps) {
  const product = ProductAdapter.fromSimpleProduct(productHit)
  const variant = product.getFirstVariant()
  const priceInfo = product.getDefaultPriceInfo()
  const images = product.getImages()
  const isDiscontinued = productHit.status === 'discontinued' || variant?.status === 'discontinued'
  const displayPrice = priceInfo.displayPrice || 0
  const priceDisplay = isDiscontinued
    ? 'Ngừng kinh doanh'
    : displayPrice > 0
      ? formatPrice(displayPrice)
      : 'Liên hệ'

  return (
    <Link
      href={FRONTEND_PATH.productDetail(product.slug)}
      className='flex gap-4 items-start p-4 hover:bg-gray-50 transition-colors rounded-lg border border-gray-200'
    >
      <div className='relative w-20 h-20 shrink-0'>
        <Image
          src={images[0] || logoBlack.src}
          alt={product.name}
          fill
          className='object-cover rounded-md bg-gray-50'
          unoptimized
        />
      </div>

      <div className='flex-1 min-h-20 flex flex-col justify-between'>
        <p className='text-sm font-medium text-gray-900 line-clamp-2'>{product.brands.join(', ')}</p>
        <p className={'text-gray-900 line-clamp-2'}>{product.name}</p>

        {variant && variant.name && variant.name !== DEFAULT_VARIANT_NAME && (
          <div className='mt-2'>
            <span className='text-xs bg-atomic-tangerine-300 text-white py-1 rounded-sm px-2 whitespace-nowrap'>
              {variant.name}
            </span>
          </div>
        )}

        <div className='mt-auto pt-2'>
          <span className='font-semibold text-gray-900'>{priceDisplay}</span>
        </div>
      </div>
    </Link>
  )
}
