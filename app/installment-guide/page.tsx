import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import InstallmentGuide from '../components/static-pages/installment-guide'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Hướng dẫn mua trả góp',
  description: 'Hướng dẫn mua trả góp tại Vinyl Sài Gòn',
  openGraph: {
    title: 'Hướng dẫn mua trả góp | Vinyl Sài Gòn',
    description: 'Hướng dẫn mua trả góp tại Vinyl Sài Gòn',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/huong-dan-mua-tra-gop`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Hướng dẫn mua trả góp Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hướng dẫn mua trả góp | Vinyl Sài Gòn',
    description: 'Hướng dẫn mua trả góp tại Vinyl Sài Gòn',
    images: [ogImage.src],
  },
 alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/huong-dan-mua-tra-gop`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Hướng dẫn mua trả góp',
      link: FRONTEND_PATH.installmentGuide,
    },
  ]

  // FAQPage structured data
 const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Có những hình thức mua trả góp nào tại Vinyl Sài Gòn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vinyl Sài Gòn cung cấp 3 hình thức mua trả góp: 1) Trả góp qua thẻ tín dụng bằng dịch vụ mPos, 2) Trả góp qua công ty tài chính HD Saigon, 3) Trả góp qua thẻ tín dụng tại website Vinyl Sài Gòn.',
        },
      },
      {
        '@type': 'Question',
        name: 'Điều kiện để mua hàng trả góp là gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Để mua hàng trả góp, tổng giá trị đơn hàng phải từ 3.000.000đ trở lên. Khách hàng cần có thẻ tín dụng hoặc đáp ứng điều kiện của công ty tài chính HD Saigon (từ 19 tuổi trở lên).',
        },
      },
      {
        '@type': 'Question',
        name: 'Cần những giấy tờ gì để mua trả góp qua HD Saigon?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Đối với khoản vay dưới 10 triệu: cần CMND + Giấy phép lái xe. Đối với khoản vay trên 10 triệu: cần CMND + Hộ khẩu + Hóa đơn điện/nước.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thời gian trả góp là bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khi mua trả góp qua thẻ tín dụng tại website Vinyl Sài Gòn, bạn có thể lựa chọn 1 trong 4 thời hạn trả góp khác nhau: 3, 6, 9 hoặc 12 tháng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Có thể hủy đơn hàng trả góp sau khi thanh toán không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khách hàng không được hủy đơn hàng sau khi đã chuyển đổi giao dịch sang phương thức trả góp. Đơn hàng tham gia chương trình trả góp qua thẻ tín dụng sẽ không được đổi trả.',
        },
      },
    ],
  }

  return (
    <div>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <InstallmentGuide />
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}

export default Page
