import { stylized } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICollectionList } from '@/lib/types/global'
import { cn } from '@/lib/utils'
import LogoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'

export const ListCollection = ({ collections }: ICollectionList) => {
  return (
    <div className='max-w-[calc(var(--breakpoint-2xl)-12rem)] mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:mx-4 mx-2 gap-2'>
      {collections.map((collection) => (
        <Link
          href={FRONTEND_PATH.collectionDetail(collection.slug)}
          key={collection.id}
          className='group'
        >
          <div
            key={`collection-${collection.id}`}
            className='p-4 border hover:border-atomic-tangerine-100 border-transparent rounded-none cursor-pointer h-full grid grid-rows-[1fr_auto_1fr_auto] '
          >
            <div className='w-full aspect-square content-center overflow-hidden'>
              <Image
                src={collection.thumbnailUrl || LogoBlack}
                alt={collection.name}
                className='transition object-cover w-full h-auto group-hover:scale-110 lg:p-8 p-4'
                width={800}
                height={800}
                unoptimized
              />
            </div>

            {/* Collection title */}
            <h3
              className={cn(
                stylized.className,
                'lg:text-lg font-semibold mt-8 lg:p-4 text-pretty',
              )}
            >
              {collection.name}
            </h3>

            {/* Description */}
            {collection.description && (
              <p className='text-gray-600 text-sm mt-2 lg:p-4 text-pretty'>
                {collection.description}
              </p>
            )}

            {/* Read More */}
            <div className='mt-6 mb-12 lg:m-4 md:block hidden'>
              <span className='px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 bg-black text-white group-hover:bg-white group-hover:text-black border border-black'>
                XEM THÊM
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
