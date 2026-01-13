import { Banner } from '@/app/components/page/banner'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { IBrandList } from '@/lib/types/global'
import brands from '@/public/assets/brands.jpg'
import { camelizeKeys } from 'humps'
import type { Metadata } from 'next'

import { ListBrand } from '../components/brands/list-brand'

export const metadata: Metadata = {
  title: 'Thương hiệu',
  description:
    'Khám phá các thương hiệu tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/brands`,
  },
  openGraph: {
    title: 'Thương hiệu',
    description:
      'Khám phá các thương hiệu tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/brands`,
    type: 'website',
    images: [
      {
        url: brands.src,
        width: 3000,
        height: 1994,
        alt: 'Thương hiệu | 3K Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thương hiệu',
    description:
      'Khám phá các thương hiệu tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
    images: [brands.src],
  },
}

export const revalidate = 86400

const getBrandsData = async () => {
  const res = await fetch(API_URL + '/api/brands', {
    next: { tags: ['brand-list'] }, // Tag for invalidation
  })
  const data = camelizeKeys(await res.json()) as IBrandList
  return data
}

const Brands = async () => {
  const brandData = await getBrandsData()
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Thương hiệu',
      link: FRONTEND_PATH.brands,
    },
  ]

  return (
    <>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={brands.src} />
      <div className='max-w-screen-2xl mx-auto min-h-360'>
        <div className='flex flex-col items-center justify-center h-full'>
          <ListBrand brands={brandData} />
        </div>
      </div>
    </>
  )
}

export default Brands
