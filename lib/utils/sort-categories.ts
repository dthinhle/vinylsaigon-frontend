import { CATEGORY_TITLE_SORTS } from '@/lib/constants'

export interface CategoryLike {
  title: string
  [key: string]: any
}

export const sortCategoriesByTitle = <T extends CategoryLike>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const indexA = CATEGORY_TITLE_SORTS.indexOf(a.title)
    const indexB = CATEGORY_TITLE_SORTS.indexOf(b.title)
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
}
