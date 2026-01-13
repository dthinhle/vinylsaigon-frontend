import { stylized } from '@/app/fonts'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICategory } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import { sortCategoriesByTitle } from '@/lib/utils/sort-categories'
import logoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

interface SubcategoryGridProps {
  subcategories: ICategory[]
}

const SubcategoryCard: React.FC<{ className?: string; subcategory: ICategory }> = ({
  className,
  subcategory,
}) => {
  const thumbnailSrc = subcategory.thumbnail ? subcategory.thumbnail.url : logoBlack.src
  return (
    <Link href={FRONTEND_PATH.productCategory(subcategory.slug)} className='group block'>
      <div className={cn('relative overflow-hidden rounded-sm bg-gray-200', className)}>
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
              stylized.className,
              'text-white lg:text-xl text-lg font-bold group-hover:text-gray-200 transition-colors',
            )}
          >
            {subcategory.title}
          </h3>
          {subcategory.description && (
            <p className={cn( 'text-gray-200 text-sm line-clamp-2')}>
              {subcategory.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export const SubcategoryGrid: React.FC<SubcategoryGridProps> = ({ subcategories }) => {
  const sortedSubcategories = React.useMemo(() => sortCategoriesByTitle(subcategories), [subcategories])

  const shouldUseCarousel = sortedSubcategories.length >= 4

  if (shouldUseCarousel) {
    return (
      <div className='bg-white/10 backdrop-blur-sm my-4 border-t border-white/20'>
        <div className='max-w-screen-2xl mx-auto'>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className='w-full'
          >
            <CarouselContent>
              {sortedSubcategories.map((subcategory) => (
                <CarouselItem
                  key={subcategory.id}
                  className='lg:first:ml-8 lg:last:mr-8 pl-6 basis-2/5 lg:basis-2/7 xl:basis-3/13'
                >
                  <SubcategoryCard
                    subcategory={subcategory}
                    className='lg:aspect-3/4 aspect-square'
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='disabled:hidden sm:flex left-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
            <CarouselNext className='disabled:hidden sm:flex right-6 bg-gray-50 border-white/30 text-gray-800 hover:bg-gray-200' />
          </Carousel>
        </div>
      </div>
    )
  }

  const classNames = {
    grid: '',
    card: '',
  }
  switch (sortedSubcategories.length) {
    case 1:
      classNames.grid = 'grid-cols-1 mx-auto'
      break
    case 2:
      classNames.grid = 'grid-cols-1 sm:grid-cols-2 mx-auto'
      break
    case 3:
      classNames.grid = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto'
      break
    case 4:
      classNames.grid = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto'
      break
  }

  return (
    <div className='bg-white/10 backdrop-blur-sm my-4 border-t border-white/20'>
      <div className='max-w-screen-2xl mx-auto px-6 lg:px-10 py-6'>
        <div className={cn('grid gap-4', classNames.grid)}>
          {sortedSubcategories.map((subcategory) => (
            <SubcategoryCard key={subcategory.id} subcategory={subcategory} className='h-60' />
          ))}
        </div>
      </div>
    </div>
  )
}
