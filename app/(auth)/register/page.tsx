import type { Metadata } from 'next'
import { RegisterContent } from './register-content'

export const metadata: Metadata = {
  title: 'Đăng Ký',
  description: 'Đăng ký tài khoản Vinyl Sài Gòn để bắt đầu mua sắm tai nghe, DAC/Amp và các sản phẩm audio chất lượng.',
  openGraph: {
    title: 'Đăng Ký | Vinyl Sài Gòn',
    description: 'Đăng ký tài khoản Vinyl Sài Gòn để bắt đầu mua sắm tai nghe, DAC/Amp và các sản phẩm audio chất lượng.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/dang-ky`,
  },
}

export default function RegisterPage() {
  return <RegisterContent />
}
