import { SlugPageProps } from '@/lib/types/global'
import logoBlack from '@/public/assets/logo-black.svg'
import type { Metadata } from 'next'

import { BaseCollectionPage, getCollectionData } from './base-collection-page'

export const revalidate = 86400

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollectionData(slug)
  if (!collection) {
    return {
      title: 'Bộ sưu tập không tìm thấy - 3K Shop',
    }
  }

  const metaTitle = collection.name
  const metaDescription =
    collection.description || `Các sản phẩm của ${collection.name} tại 3K Shop`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/bo-suu-tap/${collection.slug}`, // Add canonical URL
    },
    openGraph: {
      title: `${metaTitle} | 3K Shop`,
      description: metaDescription,
      url: `${baseUrl}/bo-suu-tap/${collection.slug}`,
      images: [
        {
          url: collection.bannerUrl || logoBlack.src,
          alt: collection.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | 3K Shop`,
      description: metaDescription,
      images: [collection.bannerUrl || logoBlack.src],
    },
  }
}

export default BaseCollectionPage
