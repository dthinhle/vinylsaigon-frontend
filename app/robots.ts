import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tai-khoan/',
          '/thanh-toan/',
          '/tra-cuu-don-hang/',
          '/*?variant=*', // Prevent indexing variant query params
          '/*?*sessionId*',
          '/*?*cartToken*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/tai-khoan/', '/thanh-toan/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
