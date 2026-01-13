import { ProductVariant } from '@/app/components/products/static-list-product'

import { ICategoryBase } from './category'
import { IProductVariant, IVariantAttribute } from './variant'

export type IProductStatus = 'active' | 'inactive' | 'discontinued' | 'temporarily_unavailable'
export type IStockStatus = 'in_stock' | 'out_of_stock' | 'low_stock'
export type IProductFlag =
  | 'installment-plan'
  | 'free-shipping'
  | 'backorder'
  | 'arrive-soon'
  | 'just-arrived'

export const PRODUCT_STOCK_STATUSES = {
  DEFAULT: 'DEFAULT',
  INACTIVE_PRODUCT: 'INACTIVE_PRODUCT',
  ARRIVE_SOON: 'ARRIVE_SOON',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED_PRODUCT: 'DISCONTINUED_PRODUCT',
} as const

export type TProductStockStatus =
  | 'INACTIVE_PRODUCT'
  | 'ARRIVE_SOON'
  | 'DISCONTINUED_PRODUCT'
  | 'OUT_OF_STOCK'
  | 'DEFAULT'

export interface IProductImage {
  url: string
  filename?: string
  contentType?: string
}

export interface ISimpleProduct {
  id: number
  name: string
  sku: string
  slug: string
  brands: string[]
  collections: string[]
  tags: string[]
  flags: IProductFlag[]
  stockQuantity: number
  variants: ProductVariant[]
}


export interface ISimpleRelatedProduct {
  id: number
  name: string
  sku: string
  slug: string
  brands: string[]
  flags: IProductFlag[]
  status: IProductStatus
  variants: ProductVariant[]
}

export type ProductBundle = {
  promotionId: number
  discountValue: number
  otherProducts: Array<{
    productName: string
    productSlug: string
    quantity: number
  }>
}

export type IProduct = {
  id: number
  name: string
  sku: string
  brands: Array<{ name: string; slug: string }>
  description: string
  shortDescription: string
  status: IProductStatus
  stockStatus: IStockStatus
  stockQuantity: number
  weight: string
  metaTitle: string
  metaDescription: string
  slug: string
  category: ICategoryBase
  freeInstallmentFee: boolean
  variants: IProductVariant[]
  productAttributes: IVariantAttribute[]
  flags: IProductFlag[]
  warrantyMonths: number

  // Bundle Info
  productBundles: Array<ProductBundle>


  // Related Products
  relatedProducts: ISimpleProduct[]
  otherProducts: ISimpleProduct[]
}
