import { LexicalContent } from '@/lib/types/lexical-node'
import { ISimpleRelatedProduct } from '@/lib/types/product'

export interface PostShortcut {
  title: string
  slug: string
}
export interface BlogPost {
  id: number
  title: string
  shortDescription?: string
  content: LexicalContent
  imageUrl?: string
  publishedAt: string
  category: {
    name: string
    slug: string
  } | null
  slug: string
  author: string
  viewCount: number
  products?: ISimpleRelatedProduct[]
  nextPost?: PostShortcut | null
  previousPost?: PostShortcut | null
}

export interface BlogCardProps {
  post: BlogPost
}

export interface ApiBlogPost {
  id: number
  title: string
  slug: string
  shortDescription?: string
  content: LexicalContent
  publishedAt: string
  viewCount: number
  metaTitle?: string
  metaDescription?: string
  imageUrl?: string
  author: {
    id: number
    name: string
  }
  category: {
    id: number
    name: string
    slug: string
  } | null
}

export interface BlogsResponse {
  blogs: ApiBlogPost[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    perPage: number
    nextPage: number | null
    prevPage: number | null
    firstPage: boolean
    lastPage: boolean
  }
}
