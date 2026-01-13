import { Metadata } from 'next'
import { Suspense } from 'react'

import OrderConfirmation from './order-confirmation'

export const metadata: Metadata = {
  title: 'Xác nhận thanh toán đơn hàng',
  description: 'Xác nhận thanh toán đơn hàng tại Vinyl Sài Gòn.',
  openGraph: {
    title: 'Xác nhận thanh toán đơn hàng | Vinyl Sài Gòn',
    description: 'Xác nhận thanh toán đơn hàng tại Vinyl Sài Gòn.',
    type: 'website',
  },
}

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <div className='w-full mt-12 lg:mt-19 min-h-360'>
        <OrderConfirmation />
      </div>
    </Suspense>
  )
}

export default Page
