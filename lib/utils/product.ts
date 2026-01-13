import { ProductHit, ProductVariant } from '@/app/components/products/static-list-product'

import { IProductStatus, ISimpleRelatedProduct, PRODUCT_STOCK_STATUSES, TProductStockStatus } from '../types/product'
import { calculatePriceInfo, PriceInfo } from './format'
import { formatPrice } from '../utils'

export class ProductAdapter {
  private data: ProductHit

  constructor(productHit: ProductHit) {
    this.data = productHit
  }

  get id(): number {
    return this.data.id
  }

  get name(): string {
    return this.data.name
  }

  get description(): string {
    return this.data.description
  }

  get slug(): string {
    return this.data.slug
  }

  get tags(): string[] {
    return this.data.tags
  }

  get collections(): string[] {
    return this.data.collections
  }

  get categories() {
    return this.data.categories
  }

  get variants(): ProductVariant[] {
    return this.data.variants
  }

  get brands(): string[] {
    return this.data.brands
  }

  get flags(): string[] {
    return this.data.flags
  }

  get seo() {
    return this.data.seo
  }

  get status() {
    return this.data.status
  }

  get raw(): ProductHit {
    return this.data
  }

  getImages(): string[] {
    return this.variants.flatMap((variant) => variant.images)
  }

  getFirstVariant(): ProductVariant | undefined {
    return this.variants[0]
  }

  getCheapestVariant(): ProductVariant | undefined {
    return this.variants.reduce((cheapest, variant) => {
      const cheapestPrice = cheapest.currentPrice ?? cheapest.originalPrice ?? Infinity
      const variantPrice = variant.currentPrice ?? variant.originalPrice ?? Infinity
      return variantPrice < cheapestPrice ? variant : cheapest
    }, this.variants[0])
  }

  getVariantBySlug(slug: string): ProductVariant | undefined {
    return this.variants.find((v) => v.slug === slug)
  }

  getSearchResultImage(): string | undefined {
    const variant = this.getCheapestVariant()
    if (variant?.images && variant.images.length > 0) {
      return variant.images[0]
    }

    return this.variants.flatMap((v) => v.images)[0]
  }

  getPriceInfo(variantSlug?: string): PriceInfo {
    const variant = variantSlug ? this.getVariantBySlug(variantSlug) : this.getCheapestVariant()

    if (!variant) {
      return {
        originalPrice: 0,
        currentPrice: 0,
        displayPrice: null,
        isOnSale: false,
        discountPercentage: 0,
      }
    }

    return calculatePriceInfo(variant.originalPrice, variant.currentPrice)
  }

  getDefaultPriceInfo(): PriceInfo {
    return this.getPriceInfo()
  }

  static fromHit(hit: ProductHit): ProductAdapter {
    return new ProductAdapter(hit)
  }

  static fromSimpleProduct(simpleProduct: ISimpleRelatedProduct): ProductAdapter {
    const productHit: ProductHit = {
      __position: 0,
      objectID: '',
      id: simpleProduct.id,
      name: simpleProduct.name,
      slug: simpleProduct.slug,
      tags: [],
      collections: [],
      description: '',
      originalPrice: '',
      currentPrice: '',
      categories: {
        lv0: '',
        lv1: '',
      },
      variants: simpleProduct.variants,
      brands: simpleProduct.brands,
      flags: simpleProduct.flags,
      seo: {
        title: simpleProduct.name,
        description: '',
      },
      status: 'active',
    }

    return new ProductAdapter(productHit)
  }
}


export const stockStatus = (product: ProductHit) => {
  if (!('status' in product)) {
    return PRODUCT_STOCK_STATUSES.DEFAULT
  }
  if (product.status === 'temporarily_unavailable' as IProductStatus) {
    return PRODUCT_STOCK_STATUSES.OUT_OF_STOCK
  } else if (product.status === 'discontinued' as IProductStatus) {
    return PRODUCT_STOCK_STATUSES.DISCONTINUED_PRODUCT
  } else if (product.flags.includes('arrive-soon')) {
    return PRODUCT_STOCK_STATUSES.ARRIVE_SOON
  }
  return PRODUCT_STOCK_STATUSES.DEFAULT
}


export const STATUS_MESSAGES: Record<TProductStockStatus, string> & { DEFAULT: string } = {
  DEFAULT: 'Thêm vào giỏ hàng',
  INACTIVE_PRODUCT: 'Không khả dụng',
  ARRIVE_SOON: 'Sắp có hàng',
  DISCONTINUED_PRODUCT: 'Ngừng kinh doanh',
  OUT_OF_STOCK: 'Tạm hết hàng',
}

export const PriceText = ({ stockStatus, displayPrice }: { stockStatus: string; displayPrice: number | null} ) => {
  switch (stockStatus) {
    case PRODUCT_STOCK_STATUSES.INACTIVE_PRODUCT:
      return 'Không khả dụng'
    case PRODUCT_STOCK_STATUSES.ARRIVE_SOON:
      return 'Sắp có hàng'
    case PRODUCT_STOCK_STATUSES.OUT_OF_STOCK:
      return 'Tạm hết hàng'
  }

  if (displayPrice !== null) {
    return formatPrice(displayPrice)
  }

  return 'Liên hệ'
}

