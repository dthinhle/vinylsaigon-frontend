import { stylized } from '@/app/fonts'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'

interface BannerTitleProps {
  title: string
  backLink?: string
  className?: string
}

export const BannerTitle: React.FC<BannerTitleProps> = ({ title, backLink, className }) => {
  const titleClassName = cn(
    stylized.className,
    'scroll-m-20 text-gray-950 lg:text-3xl text-2xl font-semibold tracking-tight lg:mt-4 mt-2',
    className,
  )

  if (backLink) {
    return (
      <Link href={backLink} className='cursor-pointer inline-flex'>
        <h1 className={titleClassName}>{title}</h1>
      </Link>
    )
  }

  return <h1 className={titleClassName}>{title}</h1>
}
