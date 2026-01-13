import { OrderContent } from './order-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi',
  description: 'Xem và quản lý các đơn hàng của bạn tại Vinyl Sài Gòn.',
  openGraph: {
    title: 'Đơn Hàng Của Tôi | Vinyl Sài Gòn',
    description: 'Xem và quản lý các đơn hàng của bạn tại Vinyl Sài Gòn.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/orders`,
  },
}

export default function MyOrdersPage() {
  return <OrderContent />
}
