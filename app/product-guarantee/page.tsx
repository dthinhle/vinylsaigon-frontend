import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import Guarantee from '../components/static-pages/product-gurantee'

export const dynamic = 'force-static'

export const metadata: Metadata = {
 title: 'Cam kết hàng hóa',
  description:
    'Cam kết hàng hóa của Vinyl Sài Gòn. Đảm bảo sản phẩm chính hãng 100%, bảo hành dài hạn, đổi trả dễ dàng và dịch vụ hậu mãi chuyên nghiệp cho các sản phẩm tai nghe, thiết bị âm thanh.',
  openGraph: {
    title: 'Cam kết hàng hóa | Vinyl Sài Gòn',
    description: 'Cam kết hàng hóa của Vinyl Sài Gòn',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/cam-ket-hang-hoa`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Cam kết hàng hóa Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cam kết hàng hóa | Vinyl Sài Gòn',
    description: 'Cam kết hàng hóa của Vinyl Sài Gòn',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/cam-ket-hang-hoa`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Cam kết hàng hóa',
      link: FRONTEND_PATH.guarantee,
    },
  ]

 // FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vinyl Sài Gòn có cam kết hàng chính hãng không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3Kshop tuyệt đối nói không với hàng nhái, hàng giả. Tất cả các sản phẩm tại 3Kshop đều là hàng chính hãng với chính sách bảo hành và hỗ trợ khách hàng tốt nhất.',
        },
      },
      {
        '@type': 'Question',
        name: 'Chính sách bảo hành tại Vinyl Sài Gòn như thế nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tất cả các sản phẩm tại Vinyl Sài Gòn đều có chính sách bảo hành và hỗ trợ khách hàng tốt nhất. Chúng tôi cam kết cung cấp dịch vụ hậu mãi chuyên nghiệp và tận tâm cho khách hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Có thể đổi trả sản phẩm không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vinyl Sài Gòn có chính sách đổi trả dễ dàng cho khách hàng. Tuy nhiên, một số điều kiện và điều khoản có thể áp dụng tùy theo loại sản phẩm và hình thức mua hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Làm thế nào để kiểm tra sản phẩm chính hãng?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khách hàng có thể kiểm tra mã vạch, tem bảo hành chính hãng và các đặc điểm nhận diện sản phẩm chính hãng khi nhận hàng. Nhân viên Vinyl Sài Gòn cũng sẽ hướng dẫn chi tiết cách nhận biết sản phẩm chính hãng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Vinyl Sài Gòn có hỗ trợ kỹ thuật sau mua hàng không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Có, Vinyl Sài Gòn cung cấp dịch vụ hỗ trợ kỹ thuật sau mua hàng. Khách hàng có thể liên hệ với bộ phận hỗ trợ để được tư vấn và giải đáp các vấn đề kỹ thuật liên quan đến sản phẩm đã mua.',
        },
      },
    ],
  }

  return (
    <div>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <Guarantee />
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}

export default Page
