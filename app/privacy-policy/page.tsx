import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import PrivacyPolicy from '../components/static-pages/privacy-policy'

export const dynamic = 'force-static'

export const metadata: Metadata = {
 title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin cá nhân khách hàng của 3K Shop',
  openGraph: {
    title: 'Chính sách bảo mật | 3K Shop',
    description: 'Chính sách bảo mật thông tin cá nhân khách hàng của 3K Shop',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/chinh-sach-bao-mat-thong-tin-ca-nhan`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Chính sách bảo mật 3K Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chính sách bảo mật | 3K Shop',
    description:
      'Chính sách bảo mật thông tin cá nhân khách hàng của 3K Shop. Cam kết bảo vệ dữ liệu, quyền riêng tư và an toàn thông tin khi mua sắm tại cửa hàng tai nghe, thiết bị âm thanh chính hãng.',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/chinh-sach-bao-mat-thong-tin-ca-nhan`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Chính sách bảo mật',
      link: FRONTEND_PATH.privacyPolicy,
    },
  ]

  // FAQPage structured data
 const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Những thông tin nào được thu thập từ khách hàng?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chúng tôi thu thập thông tin cá nhân như Email, Họ tên, Số điện thoại liên lạc... khi bạn đăng ký trên website. Ngoài ra, chúng tôi cũng thu thập thông tin về số lần viếng thăm, bao gồm số trang bạn xem, số links bạn click và những thông tin khác liên quan đến việc kết nối đến vinylsaigon.vn.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thông tin cá nhân được sử dụng như thế nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'vinylsaigon.vn sử dụng thông tin cá nhân của bạn để hỗ trợ khách hàng khi mua sản phẩm, giải đáp thắc mắc, cung cấp thông tin mới nhất trên website, xem xét và nâng cấp nội dung và giao diện của website, thực hiện các bản khảo sát khách hàng và các hoạt động quảng bá liên quan đến sản phẩm và dịch vụ của 3K Shop.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thông tin cá nhân có được chia sẻ với bên thứ ba không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ngoại trừ các trường hợp về sử dụng thông tin cá nhân như đã nêu trong chính sách này, 3K Shop cam kết sẽ không tiết lộ thông tin cá nhân bạn ra ngoài. Trong một số trường hợp, chúng tôi có thể thuê một đơn vị độc lập để tiến hành các dự án nghiên cứu thị trường và khi đó thông tin của bạn sẽ được cung cấp cho đơn vị này với thỏa thuận bảo mật.',
        },
      },
      {
        '@type': 'Question',
        name: 'Làm thế nào để bảo mật thông tin cá nhân?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3K Shop cam kết bảo mật thông tin cá nhân của quý khách bằng mọi cách thức có thể. Chúng tôi sử dụng nhiều công nghệ bảo mật thông tin khác nhau như: chuẩn quốc tế PCI, SSL,... nhằm bảo vệ thông tin này không bị truy lục, sử dụng hoặc tiết lộ ngoài ý muốn.',
        },
      },
      {
        '@type': 'Question',
        name: 'Chính sách về Cookie của 3K Shop là gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3K Shop dùng Cookie để giúp cá nhân hóa và nâng cao tối đa hiệu quả sử dụng thời gian trực tuyến của khách hàng. Cookie giúp cung cấp những tiện ích để tiết kiệm thời gian khi truy cập website vinylsaigon.vn hoặc viếng thăm website lần nữa mà không cần đăng ký lại thông tin sẵn có.',
        },
      },
    ],
  }

  return (
    <div>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <PrivacyPolicy />
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}

export default Page
