import { ICategory } from './category'

export interface IHeroBannerImage {
  url: string
  filename: string
  contentType: string
  byteSize: number
}

export interface IHeroBanner {
  id: number
  mainTitle: string
  description: string
  textColor: string
  url: string | null
  image: IHeroBannerImage | null
}

export interface LandingPageResponse {
  banners: IHeroBanner[]
  rootCategories: Array<ICategory>
}
