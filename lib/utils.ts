import { ProductHit } from '@/app/components/products/static-list-product'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { FRONTEND_PATH } from './constants'
import { ICategoryBase } from './types/category'
import { ISimpleProduct } from './types/product'

interface BreadcrumbNode {
  label: string
  link: string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return numericPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export const extractHitImages = (hit: ProductHit | ISimpleProduct): string[] => {
  if ('variants' in hit && Array.isArray(hit.variants)) {
    return hit.variants.flatMap((variant) => variant.images)
  }
  return []
}

const memoizedBreadcrumbs = new Map<string, BreadcrumbNode[]>()
const getBreadcrumbKey = (category: ICategoryBase, productName: string): string => {
  return `${category.slug}-${productName}`
}

export const getCategoryHierarchy = (cat: ICategoryBase): ICategoryBase[] => {
  const hierarchy: ICategoryBase[] = []
  let currentCat: ICategoryBase | undefined = cat

  while (currentCat) {
    hierarchy.unshift(currentCat) // Add to beginning of array
    currentCat = currentCat.parent
  }

  return hierarchy
}

export const generateBreadcrumbs = (
  category: ICategoryBase,
  productName: string,
): BreadcrumbNode[] => {
  const key = getBreadcrumbKey(category, productName)

  if (memoizedBreadcrumbs.has(key)) {
    return memoizedBreadcrumbs.get(key)!
  }

  const breadcrumbNodes: BreadcrumbNode[] = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
  ]

  const categoryHierarchy = getCategoryHierarchy(category)

  categoryHierarchy.forEach((cat) => {
    breadcrumbNodes.push({
      label: cat.title,
      link: FRONTEND_PATH.productCategory(cat.slug),
    })
  })

  breadcrumbNodes.push({
    label: productName,
    link: '#',
  })

  memoizedBreadcrumbs.set(key, breadcrumbNodes)
  return breadcrumbNodes
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Normalize pathname by removing trailing slash except for root path
 * Used for consistent path comparison in redirections
 */
export const normalizePathname = (pathname: string): string => {
  return pathname === '/' ? pathname : pathname.replace(/\/$/, '')
}

export const blurImageDataUrl = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export const contrastingColor = (hex: string, factorAlpha = false): string => {
  let [r,g,b,a]=hex.replace(/^#?(?:(?:(..)(..)(..)(..)?)|(?:(.)(.)(.)(.)?))$/, '$1$5$5$2$6$6$3$7$7$4$8$8').match(/(..)/g)?.map(rgb=>parseInt('0x'+rgb)) || [0,0,0,255]
  return ((~~(r*299) + ~~(g*587) + ~~(b*114))/1000) >= 128 || (!!(~(128/a) + 1) && factorAlpha) ? '#000' : '#FFF'
}
