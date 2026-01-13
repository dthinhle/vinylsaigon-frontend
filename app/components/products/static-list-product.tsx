import { Hit } from 'instantsearch.js'

// Types
export interface ProductVariant {
  name: string
  slug: string
  shortDescription: string | null
  originalPrice: string
  currentPrice: string
  variantAttributes: Record<string, string>
  images: string[]
  status?: 'active' | 'inactive' | 'discontinued'
}

export interface ArticleHit extends Hit {
  id: number
  title: string
  slug: string
  featuredImageUrl: string | null
  createdAt: string
}

export interface ProductHit extends Hit {
  id: number
  name: string
  description: string
  slug: string
  tags: string[]
  collections: string[]
  seo: {
    title: string
    description: string
  }
  categories: {
    lv0: string
    lv1: string
  }
  variants: ProductVariant[]
  originalPrice: string
  currentPrice: string
  brands: string[]
  flags: string[]
  status: 'active' | 'discontinued'
}

// Static constants
export const FLAGS_TRANSLATIONS = {
  'installment-plan': 'Trả góp 0%',
  'free-shipping': 'Miễn phí vận chuyển',
  backorder: 'Đặt hàng',
  'arrive-soon': 'Hàng sắp về',
  'just-arrived': 'Mới',
} as const

export const PRODUCT_ATTRIBUTES = {
  QUERY: 'query',
  NAME: 'name',
  FLAGS: 'flags',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  COLLECTIONS: 'collections',
  ORIGINAL_PRICE: 'originalPrice',
  CURRENT_PRICE: 'currentPrice',
  UPDATED_AT: 'updatedAt',
  CATEGORIES_LV0: 'categories.lv0',
  CATEGORIES_LV1: 'categories.lv1',
} as const

export type FlagValue = keyof typeof FLAGS_TRANSLATIONS

export const FACET_TRANSLATIONS = {
  brands: 'Thương hiệu',
  'categories.lv0': 'Danh mục',
  'categories.lv1': 'Danh mục con',
  collections: 'Bộ sưu tập',
  flags: 'Ưu đãi',
  originalPrice: 'Giá mở bán',
  currentPrice: 'Giá',
} as const

export type FacetValue = keyof typeof FACET_TRANSLATIONS

export const SHARED_CLASSES = {
  refinementList: {
    root: 'text-base space-y-2',
    item: 'block w-full text-left px-2 py-0.5 hover:bg-gray-100 rounded',
    label: 'flex items-center cursor-pointer',
    labelText: 'ml-2 flex-grow text-nowrap text-ellipsis overflow-hidden',
    checkbox: 'accent-sea-buckthorn-400',
    count: 'ml-2 p-1.25 text-[10px]/2 bg-gray-500 text-white rounded',
    showMore: 'text-sm/3 block mx-auto my-2 text-sea-buckthorn-500 hover:underline cursor-pointer',
  },
  hierarchicalMenu: {
    root: 'text-base space-y-2',
    link: 'flex items-center cursor-pointer',
    item: 'block w-full text-left px-2 py-0.5 not-[&.ais-HierarchicalMenu-item--parent]:hover:bg-gray-100 rounded',
    selectedItem: '[&>a>span.ais-HierarchicalMenu-label]:font-bold',
    label: 'flex flex-grow cursor-pointer',
    labelText: 'ml-2 flex-grow text-nowrap text-ellipsis overflow-hidden',
    checkbox: 'accent-sea-buckthorn-400',
    count: 'mx-2 p-1.25 text-[10px]/2 bg-gray-500 text-white rounded',
    showMore:
      'text-base/3 block mx-auto mt-2 text-sea-buckthorn-500 hover:underline cursor-pointer',
  },
}
