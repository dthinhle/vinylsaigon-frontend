import { stylized } from '@/app/fonts'
import { cn } from '@/lib/utils'
import * as React from 'react'

import { BreadcrumbNav, BreadcrumbNode } from './breadcrumb-nav'
import Image from 'next/image'

interface BannerProps {
  backgroundImage: string
  breadcrumbNodes: BreadcrumbNode[]
}

export const Banner: React.FC<BannerProps> = ({ backgroundImage, breadcrumbNodes }) => {
  return (
    <div
      id='page-banner'
      className={'w-full lg:mt-21 lg:h-96 h-72 relative'}
    >
      <Image
        src={backgroundImage}
        alt='Banner Background'
        className='absolute top-0 left-0 h-full w-full object-cover'
        width={2560}
        height={960}
        fetchPriority='high'
      />
      <div className='p-6 lg:px-20 max-w-screen-2xl mx-auto pt-8'>
        <BreadcrumbNav
          nodes={breadcrumbNodes.slice(0, -1)}
          renderLastSeparator={true}
          classNames={{ root: 'mt-14 lg:mt-0', link: 'lg:text-sm' }}
        />

        <h1
          className={cn(
            stylized.className,
            'scroll-m-20 text-gray-50 lg:text-4xl text-2xl font-extrabold tracking-tight lg:mt-4 mt-3 drop-shadow',
          )}
        >
          {breadcrumbNodes.at(-1)?.label}
        </h1>
      </div>
    </div>
  )
}
