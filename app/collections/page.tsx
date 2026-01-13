import { Banner } from '@/app/components/page/banner'
import { API_URL, FRONTEND_PATH } from '@/lib/constants'
import { ICollectionList } from '@/lib/types/global'
import collections from '@/public/assets/collections.jpg'
import { camelizeKeys } from 'humps'
import type { Metadata } from 'next'

import { ListCollection } from '../components/collections/list-collection'

export const metadata: Metadata = {
  title: 'Bộ sưu tập',
  description:
    'Khám phá các bộ sưu tập tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/collections`,
  },
  openGraph: {
    title: 'Bộ sưu tập',
    description:
      'Khám phá các bộ sưu tập tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}${FRONTEND_PATH.collections}`,
    type: 'website',
    images: [
      {
        url: collections.src,
        width: 3000,
        height: 1994,
        alt: 'Bộ sưu tập | 3K Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bộ sưu tập',
    description:
      'Khám phá các bộ sưu tập tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động tại 3K Shop. Chất lượng cao, giá cả hợp lý.',
    images: [collections.src],
  },
}

export const revalidate = 86400

const getCollectionsData = async () => {
  const res = await fetch(API_URL + '/api/collections', {
    next: { tags: ['collection-list'] }, // Tag for invalidation
  })
  const data = camelizeKeys(await res.json()) as ICollectionList
  return data
}

const Collections = async () => {
  const collectionData = await getCollectionsData()
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Bộ sưu tập',
      link: FRONTEND_PATH.collections,
    },
  ]

  return (
    <>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={collections.src} />
      <div className='max-w-screen-2xl mx-auto'>
        <div className='flex flex-col items-center justify-center h-full'>
          <ListCollection collections={collectionData.collections} />
        </div>
      </div>
    </>
  )
}

export default Collections
