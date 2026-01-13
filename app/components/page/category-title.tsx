import { montserrat } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICategory } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'

interface CategoryTitleProps {
  category: ICategory
  activeSlug?: string
}

export const CategoryTitle: React.FC<CategoryTitleProps> = ({ category, activeSlug }) => {
  const titleClassName = cn(
    montserrat.className,
    'scroll-m-20 text-gray-950 lg:text-3xl text-2xl font-semibold tracking-tight lg:mt-4 mt-2',
  )

  const isClickable = category.slug !== activeSlug

  if (isClickable) {
    return (
      <Link
        href={FRONTEND_PATH.productCategory(category.slug)}
        className='cursor-pointer inline-flex'
      >
        <h1 className={titleClassName}>{category.title}</h1>
      </Link>
    )
  }

  return <h1 className={titleClassName}>{category.title}</h1>
}
