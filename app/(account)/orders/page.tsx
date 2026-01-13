import { OrderContent } from './order-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi',
  description: 'Xem và quản lý các đơn hàng của bạn tại 3K Shop.',
  openGraph: {
    title: 'Đơn Hàng Của Tôi | 3K Shop',
    description: 'Xem và quản lý các đơn hàng của bạn tại 3K Shop.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/orders`,
  },
}

export default function MyOrdersPage() {
  return <OrderContent />
}
