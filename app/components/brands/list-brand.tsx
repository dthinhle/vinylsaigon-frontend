import { stylized } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { IBrandList } from '@/lib/types/global'
import { cn } from '@/lib/utils'
import LogoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'

export const ListBrand = ({ brands }: { brands: IBrandList }) => {
  return (
    <div className='max-w-[calc(var(--breakpoint-2xl)-12rem)] mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:mx-4 mx-2 gap-2'>
      {brands.brands.map((brand) => (
        <Link href={FRONTEND_PATH.brandDetail(brand.slug)} key={brand.id} className='group'>
          <div
            key={`brand-${brand.slug}`}
            className='p-4 border hover:border-atomic-tangerine-100 border-transparent rounded-none cursor-pointer h-full'
          >
            <div className="aspect-square w-full flex items-center mb-4">
              <Image
                src={brand.logoUrl || LogoBlack}
                alt={brand.name}
                className='transition-[padding] w-full h-auto group-hover:lg:p-4 lg:p-8 p-4'
                width={800}
                height={800}
                loading='lazy'
                unoptimized
              />
            </div>

            {/* Brand title */}
            <h3
              className={cn(
                stylized.className,
                'lg:text-lg font-semibold mt-8 lg:p-4 text-pretty',
              )}
            >
              {brand.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
