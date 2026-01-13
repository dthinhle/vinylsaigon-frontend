'use client'

import { RelatedProductRow } from '@/app/cart/components/recommend-product/recommend-product'
import { useToast } from '@/app/cart/ui/toast'
import { stylized } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { IProduct } from '@/lib/types/product'
import { IProductVariant } from '@/lib/types/variant'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import ProductAdditionalInfo from './product-additional-info'
import ProductImages from './product-images'
import ProductInfo from './product-info'

type Props = {
  product: IProduct
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  const preselectedVariant = product.variants?.find(
    (variant) => variant.slug === searchParams.get('variant'),
  )
  const [selectedVariant, setSelectedVariant] = useState(
    preselectedVariant || product.variants.find(p => p.status == 'active') || product.variants?.[0],
  )
  const handleSelectVariant = (selectedVariant: IProductVariant) => {
    const variant = product.variants.find((v) => v.slug === selectedVariant.slug)
    if (variant) {
      setSelectedVariant(variant)
      const url = variant.slug ? FRONTEND_PATH.productDetail(product.slug) + `?variant=${encodeURIComponent(variant.slug)}` : FRONTEND_PATH.productDetail(product.slug)
      router.replace( url, { scroll: false })
    } else {
      addToast({
        title: 'Lỗi',
        message: 'Phiên bản sản phẩm không tồn tại.',
        type: 'error',
      })
    }
  }

  const productImages = product.variants.flatMap((variant) => variant.images)
  const images = !!selectedVariant ? selectedVariant.images : productImages

  return (
    <>
      <div className='product-details__page max-w-screen-2xl mx-auto lg:pt-4 md:px-2 lg:px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] lg:grid-cols-[1.7fr_1fr] relative lg:mb-24 mb-6'>
          <ProductImages images={images} productName={product.name} />
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={handleSelectVariant}
          />
        </div>
        <ProductAdditionalInfo product={product} />
      </div>

      <div className='text-center space-y-2 py-6'>
        <div className='max-w-screen-2xl mx-auto'>
          <p
            className={cn(
              stylized.className,
              'md:px-2 lg:px-6 px-4 text-left text-xl lg:text-2xl font-medium mb-6',
            )}
          >
            Sản phẩm mua cùng
          </p>
          <RelatedProductRow products={product.relatedProducts} />
        </div>
      </div>
      <div className='text-center space-y-2 py-6 bg-zinc-900 text-gray-50'>
        <div className='max-w-screen-2xl mx-auto'>
          <p
            className={cn(
              stylized.className,
              'md:px-2 lg:px-6 px-4 text-left text-xl lg:text-2xl font-medium mb-6',
            )}
          >
            Các sản phẩm liên quan
          </p>
          <RelatedProductRow products={product.otherProducts} dark />
        </div>
      </div>
    </>
  )
}

export default ProductDetails
