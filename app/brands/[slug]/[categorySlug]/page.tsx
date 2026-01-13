import { SlugPageCategoryBrandProps } from '@/lib/types/global'
import logoBlack from '@/public/assets/logo-black.svg'
import type { Metadata } from 'next'

import { BaseBrandsPage, getBrandData } from '../base-brand-page'

export const revalidate = 86400

export async function generateMetadata({ params }: SlugPageCategoryBrandProps): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrandData(slug)
  if (!brand) {
    return {
      title: 'Thương hiệu không tìm thấy - Vinyl Sài Gòn',
    }
  }

  const metaTitle = brand.name
  const metaDescription = `Khám phá bộ sưu tập sản phẩm ${brand.name} chính hãng tại Vinyl Sài Gòn. Tai nghe, máy nghe nhạc, loa di động ${brand.name} với đầy đủ các dòng sản phẩm mới nhất. Bảo hành chính hãng, tư vấn miễn phí.`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/thuong-hieu/${brand.slug}`, // Add canonical URL
    },
    openGraph: {
      title: `${metaTitle} | Vinyl Sài Gòn`,
      description: metaDescription,
      url: `${baseUrl}/thuong-hieu/${brand.slug}`,
      images: [
        {
          url: brand.logoUrl || logoBlack.src,
          alt: brand.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | Vinyl Sài Gòn`,
      description: metaDescription,
      images: [brand.logoUrl || logoBlack.src],
    },
  }
}

const Brands = async ({ params }: SlugPageCategoryBrandProps) => {
  return <BaseBrandsPage params={params} />
}

export default Brands
