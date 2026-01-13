import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vinyl Sài Gòn - Tai Nghe & Thiết Bị Âm Thanh',
    short_name: 'Vinyl Sài Gòn',
    description: 'Vinyl Sài Gòn chuyên tai nghe cao cấp, thiết bị âm thanh chính hãng',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-chrome-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/android-chrome-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
