import Home from '@/app/ui/home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang Chủ | 3K Shop',
  description: '3kshop chuyên tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động.',
  openGraph: {
    title: 'Trang Chủ | 3K Shop',
    description: '3kshop chuyên tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn',
  },
}

export const revalidate = 86400

export default function HomePage() {
  return <Home />
}
