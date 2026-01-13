import CategoryBox from '@/app/components/category/category-block'
import HeroBanner from '@/app/components/hero-banner/hero-banner'
import { stylized } from '@/app/fonts'
import { API_URL, FRONTEND_PATH, ROOT_CATEGORIES_FOR_LAYOUT } from '@/lib/constants'
import { ICategory } from '@/lib/types/category'
import { LandingPageResponse } from '@/lib/types/hero-banner'
import { cn } from '@/lib/utils'
import NewsBackground from '@/public/assets/news-background.webp'
import { camelizeKeys } from 'humps'
import Image from 'next/image'
import Link from 'next/link'

const getLandingPageData = async () => {
  const res = await fetch(API_URL + '/api/landing_page', {
    next: {
      tags: ['landing-page'],
      revalidate: 86400, // ISR: revalidate every 24 hours
    },
  })
  return res.json()
}

const Home: React.FC = async () => {
  const { banners, rootCategories } = camelizeKeys(
    await getLandingPageData(),
  ) as LandingPageResponse

  const rootCategoriesBySlug = rootCategories.reduce((acc, category) => {
    acc[category.slug] = category
    return acc
  }, {} as { [key: string]: ICategory })

  const topCategories = ROOT_CATEGORIES_FOR_LAYOUT['top'].map(slug => rootCategoriesBySlug[slug]).filter(Boolean)
  const middleCategories = ROOT_CATEGORIES_FOR_LAYOUT['middle'].map(slug => rootCategoriesBySlug[slug]).filter(Boolean)
  const bottomCategories = ROOT_CATEGORIES_FOR_LAYOUT['bottom'].map(slug => rootCategoriesBySlug[slug]).filter(Boolean)

  return (
    <>
      <HeroBanner banners={banners} />
      <div className='py-4 space-y-4'>
        <section className='flex flex-col md:flex-row flex-wrap items-center gap-4'>
          {topCategories.map((category, index) => {
            return (
              <CategoryBox key={index} category={category} classNamePrefix='top' eagerLoad />
            )
          })}
        </section>
        <section className='middle-categories-section flex content-center-safe lg:px-12'>
          <div className='grid grid-cols-1 place-items-center gap-4 p-0 md:grid-cols-[410px] md:py-12 md:px-0 md:mx-auto lg:grid-cols-[repeat(3,minmax(300px,352px))] xl:grid-cols-[repeat(3,410px)]'>
            {middleCategories.map((category, index) => {
              return (
                <CategoryBox key={index} category={category} classNamePrefix='bottom' eagerLoad />
              )
            })}
          </div>
        </section>
        <section className='flex flex-col md:flex-row flex-wrap items-center gap-4 *:aspect-square xl:*:aspect-4/3'>
          {bottomCategories.map((category, index) => {
            return (
              <CategoryBox key={index} category={category} classNamePrefix='top' />
            )
          })}
          <div className={'w-full lg:w-[calc(50%-.5rem)] relative h-auto overflow-hidden d-block'}>
            <Image
              alt='News'
              fill
              src={NewsBackground.src}
              className='absolute top-0 left-0 w-full h-full object-cover -z-10'
            />
            <div className={'grid-rows-[repeat(3,1fr)] grid-cols-[repeat(3,1fr)] lg:pl-[3vw] grid h-full gap-4 p-3'}>
              <h3
                className={cn(
                  stylized.className,
                  'font-medium text-white text-[1.8rem] lg:text-[2.375rem] self-end',
                )}
              >
                Tin tức
              </h3>
              <p
                className={cn(

                  'self-end grid-cols-[1/-1] row-start-2 col-span-2 text-[1rem] text-white text-pretty',
                )}
              >
                Cập nhật thông tin mới nhất về sản phẩm, chương trình khuyến mãi và các sự kiện đặc
                biệt.
              </p>
              <div className={'row-start-3 content-start self-start'}>
                <Link
                  href={FRONTEND_PATH.news}
                  className='grid place-items-center w-36 h-12 bg-white font-bold cursor-pointer text-base hover:text-lg transition-all hover:[&>span]:after:w-full'
                >
                  <span className='relative duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gray-900 after:transition-width after:duration-300 '>
                    Xem tất cả
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
