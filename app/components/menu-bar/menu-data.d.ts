export interface RightSection {
  imageSrc: string
  link: string
  label: string
}

export interface MenuLink {
  type: 'link'
  label: string
  link: string
  subItems?: MenuLink[]
}

interface MenuHeader {
  type: 'header'
  label: string
  link?: string
  subItems?: MenuLink[]
}

export type MenuItem = MenuLink | MenuHeader

export interface ProductMenu {
  leftSection: MenuItem[]
  mainSection: MenuItem[]
  rightSection: RightSection
}

export interface ProductItem {
  type: 'product'
  id: number
  name: string
  slug: string
}

export interface CollectionItem {
  type: 'collection'
  id: number
  name: string
  slug: string
}

export interface CategoryItem {
  type: 'category'
  id: number
  title: string
  slug: string
}

export type PopularSearch = ProductItem | CategoryItem
export type ForYouContent = CollectionItem | CategoryItem

export interface ISearchSuggestions {
  popularSearches: PopularSearch[]
  forYouContent: ForYouContent[]
}
