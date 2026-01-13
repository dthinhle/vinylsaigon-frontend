'use client'

import { montserrat } from '@/app/fonts'
import { IHeroBanner } from '@/lib/types/hero-banner'
import { cn, contrastingColor } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import Link from 'next/link'

type Props = {
  banners: IHeroBanner[]
}

const HeroBanner: React.FC<Props> = ({ banners }) => {
  const router = useRouter()
  const progressCircle = useRef<SVGSVGElement>(null)
  const progressContent = useRef<HTMLSpanElement>(null)

  const onAutoplayTimeLeft = (_s: unknown, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress))
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
    }
  }

  const handleImageClick = (banner: IHeroBanner): React.MouseEventHandler<HTMLImageElement> | undefined => {
    if (banner.url && banner.url.length > 0) {
      return () => {
        router.push(banner.url!)
      }
    }
    return undefined
  }

  return (
    <div className='relative mt-18.5 [&_.swiper-pagination-bullet]:bg-white!'>
      <Swiper
        loop
        speed={500}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        modules={[Autoplay, Pagination]}
      >
        {banners.map((banner, index) => {
          const bannerTextColor = banner?.textColor || '#FFFFFF'
          const contrastingTextColor = contrastingColor(bannerTextColor)

          return (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div className='relative lg:aspect-30/14 aspect-2/1'>
                  <Image
                    fill
                    priority={index === 0}
                    sizes='100vw'
                    alt={banner.mainTitle || banner.description || 'Banner khuyến mãi 3K Shop'}
                    src={banner.image?.url || ''}
                    className='w-full h-auto object-cover cursor-pointer'
                    onClick={handleImageClick(banner)}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    fetchPriority={index < 2 ? 'high' : 'auto'}
                  />
                  <div
                    className='absolute z-50 lg:bottom-14 bottom-2 right-4 lg:right-12 -translate-y-1/2'
                    style={{
                      '--text-color': bannerTextColor,
                    } as React.CSSProperties}
                  >
                    <h4
                      className={cn(
                        montserrat.className,
                        isActive ? 'opacity-100 swiper-slide-active-text' : 'opacity-0',
                        'text-(--text-color) md:text-xl lg:text-3xl uppercase font-bold text-right box-shadow',
                      )}
                    >
                      {banner.mainTitle}
                    </h4>

                    <div className='mt-2 hidden md:block md:max-w-[min(300px,80vw)] lg:max-w-[min(600px,80vw)]'>
                      <p className='text-(--text-color) text-sm lg:text-base swiper-slide-active-text text-right text-pretty box-shadow'>
                        {banner.description}
                      </p>
                    </div>
                    {banner.url && (
                      <div className="mt-2 md:mt-4 button-wrapper flex justify-end">
                        <Link
                          href={banner.url}
                          className='grid place-items-center text-sm px-2.5 py-2 md:text-base lg:px-6 lg:py-3 bg-(--background-color) font-bold cursor-pointer transition-all hover:[&>span]:after:w-full'
                          style={{
                            '--background-color': bannerTextColor,
                          } as React.CSSProperties}
                        >
                          <span
                            className={'relative lg:text-base text-xs text-(--button-text) duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gray-900 after:transition-width after:duration-300'}
                            style={{
                              '--button-text': contrastingTextColor,
                            } as React.CSSProperties}
                          >
                            {'Mua ngay'}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default HeroBanner
