import BlogList from '@/app/components/blog/blog-list'
import ScrollToTop from '@/app/components/blog/scroll-to-top'
import { Banner } from '@/app/components/page/banner'
import { FRONTEND_PATH } from '@/lib/constants'
import newsBanner from '@/public/assets/news-banner.png'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/tin-tuc`
  const canonical = baseUrl

  const metadata: Metadata = {
    title: 'Tin Tức',
    description:
      'Tin tức mới nhất về tai nghe, audio, công nghệ âm thanh và các sản phẩm điện tử tại Vinyl Sài Gòn',
    alternates: {
      canonical,
    },
    openGraph: {
      title: 'Tin Tức | Vinyl Sài Gòn',
      description:
        'Tin tức mới nhất về tai nghe, audio, công nghệ âm thanh và các sản phẩm điện tử tại Vinyl Sài Gòn',
      type: 'website',
      url: canonical,
      images: [
        {
          url: newsBanner.src,
          alt: 'Tin Tức | Vinyl Sài Gòn',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tin Tức | Vinyl Sài Gòn',
      description:
        'Tin tức mới nhất về tai nghe, audio, công nghệ âm thanh và các sản phẩm điện tử tại Vinyl Sài Gòn',
      images: [newsBanner.src],
    },
  }
  return metadata
}

// Enable ISR with revalidation every 24 hours
export const revalidate = 86400

export default function NewsPage() {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Tin tức',
      link: FRONTEND_PATH.news,
    },
  ]

  return (
    <>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={newsBanner.src} />
      <div className='max-w-screen-2xl mx-auto'>
        <div className='flex flex-col items-center justify-center h-full'>
          {/* Description */}
          <p className='text-gray-700 mt-6 text-sm lg:text-base text-center text-pretty lg:max-w-1/2 md:max-w-3/4 max-w-full md:mx-0 mx-6'>
            Cập nhật những tin tức mới nhất về
            <br className='lg:block hidden' />
            công nghệ âm thanh, đánh giá sản phẩm, sự kiện và xu hướng audio tại Vinyl Sài Gòn.
          </p>
          <BlogList />
          <ScrollToTop />
        </div>
      </div>
    </>
  )
}
