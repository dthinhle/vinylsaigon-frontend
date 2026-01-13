'use client'

import { montserrat } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICategory, ICategoryBase } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import logoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

interface SubcategoryCardProps {
  subcategory: ICategory | ICategoryBase
  isActive?: boolean
}

export const SubcategoryCard: React.FC<SubcategoryCardProps> = ({
  subcategory,
  isActive = false,
}) => {
  const thumbnailSrc = subcategory.thumbnail ? subcategory.thumbnail.url : logoBlack.src
  return (
    <Link href={FRONTEND_PATH.productCategory(subcategory.slug)} className='group block'>
      <div
        className={cn(
          'category-card relative overflow-hidden rounded-sm lg:aspect-3/4 aspect-square bg-gray-200',
          isActive && 'ring-2 ring-white ring-offset-2 ring-offset-transparent',
        )}
      >
        <Image
          src={thumbnailSrc}
          alt={subcategory.title}
          fill
          data-placeholder={subcategory.thumbnail ? undefined : 'true'}
          className='object-cover group-hover:scale-105 transition-transform duration-300 data-[placeholder=true]:opacity-10'
          unoptimized
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent' />

        <div className='absolute bottom-0 left-0 right-0 px-4 py-3'>
          <h3
            className={cn(
              montserrat.className,
              'text-white font-semibold text-lg group-hover:text-gray-200 transition-colors',
            )}
          >
            {subcategory.title}
          </h3>
          {/* {subcategory.description && (
            <p className={cn( 'text-gray-200 text-sm line-clamp-2')}>
              {subcategory.description}
            </p>
          )} */}
        </div>
      </div>
      {isActive && <hr className='mt-1 h-0.75 rounded-t-full bg-gray-950' />}
    </Link>
  )
}
