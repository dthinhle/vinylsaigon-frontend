export interface ICategoryImage {
  url: string
  filename: string
  content_type: string
  byte_size: number
}

export type ICategoryBase = {
  id: number
  title: string
  indexPath: string
  description: string | null
  slug: string
  buttonText: string
  isRoot: boolean
  parent?: ICategory
  thumbnail: ICategoryImage
  children: Array<ICategoryBase>
}

export interface ICategory {
  id: number
  title: string
  indexPath: string
  description: string
  slug: string
  buttonText: string
  isRoot: boolean
  thumbnail: ICategoryImage
  parent?: ICategory
  children: Array<ICategory>
  isActive: boolean
}
