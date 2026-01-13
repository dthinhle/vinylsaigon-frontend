import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import PaymentMethods from '../components/static-pages/payment-methods'

export const dynamic = 'force-static'

export const metadata: Metadata = {
 title: 'Hình thức thanh toán',
  description:
    'Các hình thức thanh toán tại 3K Shop. Hỗ trợ thanh toán bằng thẻ ngân hàng, ví điện tử, chuyển khoản và trả góp 0% lãi suất cho các sản phẩm tai nghe, thiết bị âm thanh chính hãng.',
  openGraph: {
    title: 'Hình thức thanh toán | 3K Shop',
    description: 'Các hình thức thanh toán của 3K Shop',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/hinh-thuc-thanh-toan`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Hình thức thanh toán 3K Shop',
      },
    ],
 },
  twitter: {
    card: 'summary_large_image',
    title: 'Hình thức thanh toán | 3K Shop',
    description: 'Các hình thức thanh toán của 3K Shop',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/hinh-thuc-thanh-toan`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Hình thức thanh toán',
      link: FRONTEND_PATH.paymentMethods,
    },
  ]

  // FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Những hình thức thanh toán nào được hỗ trợ tại 3K Shop?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3K Shop hỗ trợ nhiều hình thức thanh toán khác nhau bao gồm: thanh toán bằng tiền mặt, thanh toán qua thẻ ngân hàng, chuyển khoản ngân hàng và thanh toán trả góp 0% lãi suất.',
        },
      },
      {
        '@type': 'Question',
        name: 'Tôi có thể thanh toán qua tài khoản ngân hàng nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3K Shop hỗ trợ thanh toán qua nhiều ngân hàng phổ biến tại Việt Nam như: Vietcombank, Sacombank, BIDV, ACB, Agribank, Đông Á, Techcombank. Chủ tài khoản: VO NGOC BAO NGAN.',
        },
      },
      {
        '@type': 'Question',
        name: 'Có thể thanh toán trả góp không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Có, 3K Shop hỗ trợ thanh toán trả góp 0% lãi suất cho các sản phẩm. Quý khách có thể lựa chọn hình thức trả góp khi mua hàng trên website hoặc tại cửa hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thông tin thanh toán có được bảo mật không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tất cả thông tin thanh toán của khách hàng đều được bảo mật tuyệt đối theo chính sách bảo mật của 3K Shop. Chúng tôi sử dụng các công nghệ bảo mật tiên tiến để đảm bảo an toàn thông tin khách hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Có phí giao dịch khi thanh toán không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3K Shop không thu bất kỳ phí giao dịch nào từ khách hàng. Tuy nhiên, một số hình thức thanh toán có thể phát sinh phí từ phía ngân hàng hoặc đơn vị trung gian, khách hàng vui lòng kiểm tra kỹ trước khi thực hiện thanh toán.',
        },
      },
    ],
  }

  return (
    <div>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <PaymentMethods />
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}

export default Page
