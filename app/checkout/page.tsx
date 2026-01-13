import { Metadata } from 'next'
import { Suspense } from 'react'

import CheckoutPage from './checkout-page'

export const metadata: Metadata = {
  title: 'Đặt hàng và Thanh toán',
  description: 'Tiến hành đặt hàng và thanh toán đơn hàng của bạn tại Vinyl Sài Gòn.',
  openGraph: {
    title: 'Đặt hàng và Thanh toán | Vinyl Sài Gòn',
    description: 'Tiến hành đặt hàng và thanh toán đơn hàng của bạn tại Vinyl Sài Gòn.',
    type: 'website',
  },
}

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full mt-12 lg:mt-19 min-h-360'>
        <CheckoutPage />
      </div>
    </Suspense>
  )
}

export default Page
