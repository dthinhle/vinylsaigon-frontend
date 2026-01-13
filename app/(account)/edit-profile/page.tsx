import { EditProfileContent } from './edit-profile-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chỉnh Sửa Hồ Sơ',
  description: 'Cập nhật và chỉnh sửa thông tin hồ sơ cá nhân của bạn tại 3K Shop.',
  openGraph: {
    title: 'Chỉnh Sửa Hồ Sơ | 3K Shop',
    description: 'Cập nhật và chỉnh sửa thông tin hồ sơ cá nhân của bạn tại 3K Shop.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/edit-profile`,
  },
}

export default function EditProfilePage() {
  return <EditProfileContent />
}
