import { ResetPasswordForm, ResetPasswordLoading } from './reset-password-form'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đặt Lại Mật Khẩu',
  description: 'Đặt lại mật khẩu tài khoản Vinyl Sài Gòn của bạn một cách nhanh chóng và an toàn.',
  openGraph: {
    title: 'Đặt Lại Mật Khẩu | Vinyl Sài Gòn',
    description: 'Đặt lại mật khẩu tài khoản Vinyl Sài Gòn của bạn một cách nhanh chóng và an toàn.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/reset-password`,
  },
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
