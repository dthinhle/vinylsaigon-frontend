import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import ShipingPolicy from '../components/static-pages/shipping-policy'

export const dynamic = 'force-static'

export const metadata: Metadata = {
 title: 'Chính sách vận chuyển',
  description:
    'Chính sách vận chuyển sản phẩm đến tay khách hàng của Vinyl Sài Gòn. Giao hàng nhanh chóng, an toàn, hỗ trợ kiểm tra hàng trước thanh toán cho các sản phẩm tai nghe, thiết bị âm thanh chính hãng.',
  openGraph: {
    title: 'Chính sách vận chuyển | Vinyl Sài Gòn',
    description: 'Chính sách vận chuyển sản phẩm đến tay khách hàng của Vinyl Sài Gòn',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/chinh-sach-van-chuyen`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Chính sách vận chuyển Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chính sách vận chuyển | Vinyl Sài Gòn',
    description: 'Chính sách vận chuyển sản phẩm đến tay khách hàng của Vinyl Sài Gòn',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/chinh-sach-van-chuyen`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Chính sách vận chuyển',
      link: FRONTEND_PATH.shippingPolicy,
    },
  ]

  // FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '3Kshop có giao hàng đến những khu vực nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '3Kshop vận chuyển hàng hóa đến mọi miền đất nước. Giao hàng tại TP.HCM cho các quận nội thành (1, 3, 4, 5, 6, 8, 10, 11, Gò Vấp, Bình Thạnh, Phú Nhuận, Tân Bình, Tân Phú) và các quận, huyện ngoại thành.',
        },
      },
      {
        '@type': 'Question',
        name: 'Phí vận chuyển được tính như thế nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Miễn phí vận chuyển tiêu chuẩn cho các đơn hàng có giá trị từ 1.000.000 trở lên (không áp dụng với đơn hàng đã áp giá Khuyến Mãi). Các đơn hàng dưới 1.000.000 sẽ tính phí vận chuyển tuỳ vào khoảng cách. Các quận, huyện ngoại thành và đơn hàng tỉnh khác sẽ tính phí theo khoảng cách.',
        },
      },
      {
        '@type': 'Question',
        name: 'Có hỗ trợ giao hàng thu tiền tận nơi (COD) không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Có, đơn hàng thanh toán theo phương thức COD sẽ được hỗ trợ giao hàng thu tiền tận nơi, tuy nhiên sẽ có thêm phí thu hộ. Quý khách lưu ý rằng đơn hàng thanh toán COD sẽ không được hỗ trợ việc trải nghiệm sản phẩm ngoài khu vực cửa hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thời gian nhận hàng mất bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thời gian nhận hàng từ 1 đến 5 ngày tùy thuộc từng khu vực. Đối với khách hàng ở các tỉnh khác, sau khi chuyển khoản xong, 3Kshop sẽ chuyển hàng qua dịch vụ chuyển phát nhanh như: GHTK, J&T, Viettel Post, EMS, Tín Thành,...',
        },
      },
      {
        '@type': 'Question',
        name: 'Có thể trải nghiệm sản phẩm trước khi nhận hàng không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quý khách hàng có nhu cầu trải nghiệm sản phẩm, xin vui lòng đến cửa hàng. 3Kshop không hỗ trợ việc trải nghiệm sản phẩm ngoài khu vực cửa hàng.',
        },
      },
    ],
  }

  return (
    <div>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <ShipingPolicy />
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}

export default Page
