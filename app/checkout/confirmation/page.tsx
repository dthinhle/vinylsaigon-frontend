import { Metadata } from 'next'
import { Suspense } from 'react'

import OrderConfirmation from './order-confirmation'

export const metadata: Metadata = {
  title: 'Xác nhận thanh toán đơn hàng',
  description: 'Xác nhận thanh toán đơn hàng tại 3K Shop.',
  openGraph: {
    title: 'Xác nhận thanh toán đơn hàng | 3K Shop',
    description: 'Xác nhận thanh toán đơn hàng tại 3K Shop.',
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
