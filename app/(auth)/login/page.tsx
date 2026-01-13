import type { Metadata } from 'next'
import { LoginContent } from './login-content'

export const metadata: Metadata = {
  title: 'Đăng Nhập',
  description: 'Đăng nhập vào tài khoản 3K Shop của bạn để theo dõi đơn hàng và nhận ưu đãi đặc biệt.',
  openGraph: {
    title: 'Đăng Nhập | 3K Shop',
    description: 'Đăng nhập vào tài khoản 3K Shop của bạn để theo dõi đơn hàng và nhận ưu đãi đặc biệt.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/dang-nhap`,
  },
}

export default function LoginPage() {
  return <LoginContent />
}
