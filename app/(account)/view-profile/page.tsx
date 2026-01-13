import { ViewProfileContent } from './view-profile-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý Tài Khoản',
  description: 'Xem và quản lý thông tin hồ sơ cá nhân của bạn tại 3K Shop.',
  openGraph: {
    title: 'Quản lý Tài Khoản | 3K Shop',
    description: 'Xem và quản lý thông tin hồ sơ cá nhân của bạn tại 3K Shop.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/view-profile`,
  },
}

export default function ViewProfilePage() {
  return <ViewProfileContent />
}
