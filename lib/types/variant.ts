import { IProductImage } from './product'

export type IVariantAttribute = {
  label: string
  value: string
}

export type IProductVariant = {
  id: number
  name: string
  slug: string
  sku: string
  originalPrice: string
  currentPrice: string
  stockQuantity: number
  status: 'active' | 'inactive' | 'discontinued'
  variantAttributes: IVariantAttribute[]
  images: IProductImage[]
}
