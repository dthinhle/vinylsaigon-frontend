import { ICategoryBase } from './category'

export type IAddress = {
  fullAddress: string
  phoneNumbers: string[]
}

export type IStore = {
  name: string
  facebookUrl: string
  youtubeUrl: string
  instagramUrl: string
  addresses: IAddress[]
}

export type IRelatedCategory = {
  id: number
  title: string
  slug: string
  description: string
  isRoot: boolean
  thumbnail: {
    url: string
  }
  children: Array<ICategoryBase>
}

export type IBrand = {
  id: number
  name: string
  slug: string
  logoUrl: string | null
  bannerUrl: string | null

  categories: IRelatedCategory[]
}

export type IBrandList = {
  brands: IBrand[]
}

export type ICollection = {
  id: number
  name: string
  slug: string
  description: string
  createdAt: string
  updatedAt: string
  bannerUrl: string | null
  thumbnailUrl: string | null

  categories: IRelatedCategory[]
}

export type ICollectionResponse = {
  collection: ICollection
}

export type ICollectionList = {
  collections: ICollection[]
}

export type SlugPageProps = {
  params: Promise<{ slug: string }>
}

export type SlugPageCategoryBrandProps = {
  params: Promise<{
    slug: string
    categorySlug: string
  }>
}

export type RedirectionMapping = {
  old_slug: string
  new_slug: string
}

export type RedirectionMappingCamelized = {
  oldSlug: string
  newSlug: string
}

export type RedirectionResponse = {
  redirections: RedirectionMapping[]
}

export type RedirectionResponseCamelized = {
  redirections: RedirectionMappingCamelized[]
}

export type CachedRedirectionsResponse = {
  redirections: RedirectionMapping[]
  redirectionsMap: Record<string, string>
  count: number
  cachedAt: string
  error?: string
}
