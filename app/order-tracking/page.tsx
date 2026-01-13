import { BreadcrumbNav } from '@/app/components/page/breadcrumb-nav'
import { OrderTracking } from '@/app/order-tracking/order-tracking'
import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng',
  description:
    'Kiểm tra trạng thái đơn hàng của bạn tại 3K Shop. Tra cứu quá trình xử lý, vận chuyển và giao hàng nhanh chóng, chính xác.',
  openGraph: {
    title: 'Tra cứu đơn hàng | 3K Shop',
    description:
      'Kiểm tra trạng thái đơn hàng của bạn tại 3K Shop. Tra cứu quá trình xử lý, vận chuyển và giao hàng nhanh chóng, chính xác.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/tra-cuu-don-hang`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Tra cứu đơn hàng 3K Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tra cứu đơn hàng | 3K Shop',
    description:
      'Kiểm tra trạng thái đơn hàng của bạn tại 3K Shop. Tra cứu quá trình xử lý, vận chuyển và giao hàng nhanh chóng, chính xác.',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/tra-cuu-don-hang`,
  },
}

const breadcrumbNodes = [
  {
    label: 'Trang chủ',
    link: FRONTEND_PATH.root,
  },
  {
    label: 'Tra cứu đơn hàng',
    link: FRONTEND_PATH.orderTracking,
  },
]

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full lg:mt-19'>
        <div className='px-6 mb-2 lg:px-10 max-w-screen-2xl mx-auto lg:pt-6 pt-20'>
          <BreadcrumbNav
            classNames={{
              root: 'text-base space-y-2',
              link: 'tracking-tight text-gray-800 hover:text-gray-600 lg:text-sm',
            }}
            nodes={breadcrumbNodes}
            renderLastSeparator={true}
          />
        </div>
        <div className='px-6 mb-2 lg:px-10 max-w-screen-2xl mx-auto'>
          <OrderTracking />
        </div>
      </div>
    </Suspense>
  )
}

export default Page
