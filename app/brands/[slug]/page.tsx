import { SlugPageProps } from '@/lib/types/global'
import logoBlack from '@/public/assets/logo-black.svg'
import type { Metadata } from 'next'

import { BaseBrandsPage, getBrandData } from './base-brand-page'

export const revalidate = 86400

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ page?: string; per_page?: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const brand = await getBrandData(slug)
  if (!brand) {
    return {
      title: 'Thương hiệu không tìm thấy - Vinyl Sài Gòn',
    }
  }

  const page = Number(resolvedSearchParams?.page ?? 1)
  const perPage = Number(resolvedSearchParams?.per_page ?? 24)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'
  const brandUrlBase = `${baseUrl}/thuong-hieu/${brand.slug}`
  const brandUrl = page > 1 ? `${brandUrlBase}?page=${page}&per_page=${perPage}` : brandUrlBase

  const metaTitle = brand.name
  const metaDescription = `Khám phá bộ sưu tập sản phẩm ${brand.name} chính hãng tại Vinyl Sài Gòn. Tai nghe, máy nghe nhạc, loa di động ${brand.name} với đầy đủ các dòng sản phẩm mới nhất. Bảo hành chính hãng, tư vấn miễn phí.`

  // Prepare metadata with pagination structure as per SEO analysis
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: brandUrl, // Add canonical URL
    },
    openGraph: {
      title: `${metaTitle} | Vinyl Sài Gòn`,
      description: metaDescription,
      url: brandUrl,
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

  // According to SEO analysis #20, if pagination is implemented,
  // we should add rel="prev" and rel="next" tags to indicate the relationship between paginated pages
  // This prepares the structure for when pagination is eventually implemented
  // For now, we're just preparing the metadata structure without actual pagination logic
  // since the site currently uses infinite scroll

  return metadata
}

const Brands = async ({ params }: SlugPageProps) => {
  return <BaseBrandsPage params={params} />
}

export default Brands
