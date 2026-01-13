import { API_URL } from '@/lib/constants'
import { ICategoryBase } from '@/lib/types/category'
import { IProduct } from '@/lib/types/product'

export const getProduct = async (slug: string, cache = false): Promise<IProduct> => {
  const requestOptions = cache
    ? {
      next: {
        revalidate: 600, // ISR: revalidate every 10 minutes
        tags: [`product-${slug}`, 'products'], // Add cache tags for on-demand revalidation
      },
    }
    : {}
  const res = await fetch(API_URL + `/api/product/${slug}`, requestOptions)
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${API_URL}/api/product/${slug}: ${res.status} ${res.statusText || ''}`)
  }
  return await res.json()
}

export const getRootCategories = async (): Promise<Array<ICategoryBase>> => {
  const res = await fetch(API_URL + '/api/categories?root_only=true', {
    next: { revalidate: 86400 }, // Revalidate every 24 hours
  })

  if (!res.ok) {
    return []
  }

  return await res.json()
}

export const getCategory = async (slug: string): Promise<ICategoryBase | null> => {
  const res = await fetch(API_URL + `/api/categories/${slug}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}
