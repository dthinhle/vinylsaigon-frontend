import { base, stylized } from '@/app/fonts'
import { StoreInitializer } from '@/app/store/initializers'
import Footer from '@/app/ui/layouts/footer'
import Header from '@/app/ui/layouts/header'
import { API_URL } from '@/lib/constants'
import { getAlternateUrls } from '@/lib/language-utils'
import { IStore } from '@/lib/types/global'
import { cn, normalizePathname } from '@/lib/utils'
import ogImage from '@/public/assets/og-image.jpg'
import { camelizeKeys } from 'humps'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import RouterInterceptor from './router-event-provider'

import { ISearchSuggestions, ProductMenu } from './components/menu-bar/menu-data'
import './index.css'
import { WebVitals } from './web-vitals'
import { fetchRedirections } from './api/global'

export const revalidate = 86400

const getMenuConfig = async () => {
  const res = await fetch(API_URL + '/api/menu_bar', {
    next: { tags: ['menu-config'], revalidate: 86400 }, // 24 hours
  })
  const data = camelizeKeys(await res.json()) as ProductMenu
  return data
}

const getGlobalData = async () => {
  const res = await fetch(API_URL + '/api/global', {
    next: { tags: ['global-data'], revalidate: 86400 }, // 24 hours
  })
  const data = camelizeKeys(await res.json()) as IStore
  return data
}

const fetchSearchSuggestions = async () => {
  const res = await fetch(API_URL + '/api/search_items', {
    next: { tags: ['search-suggestions'], revalidate: 86400 }, // 24 hours
  })
  if (!res.ok) {
    throw new Error('Failed to fetch search suggestions')
  }

  return camelizeKeys(await res.json()) as ISearchSuggestions
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'Vinyl Sài Gòn', template: '%s | Vinyl Sài Gòn' },
  description:
    'Vinyl Sài Gòn chuyên tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  openGraph: {
    title: { default: 'Vinyl Sài Gòn', template: '%s | Vinyl Sài Gòn' },
    description:
      'Vinyl Sài Gòn chuyên tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    type: 'website',
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@3kshop',
    creator: '@3kshop',
    title: 'Vinyl Sài Gòn',
    description:
      'Vinyl Sài Gòn chuyên tai nghe cao cấp, tai nghe true wireless, tai nghe chống ồn, mâm đĩa than, đĩa vinyl, máy nghe nhạc, loa di động.',
    images: [ogImage.src],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  const menu = await getMenuConfig()
  const globalData = await getGlobalData()
  const searchSuggestions = await fetchSearchSuggestions()
  const redirections = await fetchRedirections()

  const normalizedPathname = normalizePathname(pathname)
  const redirectionMap = new Map(
    redirections.redirections.map((r) => [normalizePathname(r.oldSlug), r.newSlug]),
  )

  const targetSlug = redirectionMap.get(normalizedPathname)

  if (targetSlug && normalizePathname(targetSlug) !== normalizedPathname) {
    permanentRedirect(targetSlug)
  }

  const alternates = getAlternateUrls(
    normalizedPathname,
    process.env.NEXT_PUBLIC_APP_URL || API_URL || '',
  )

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vinyl Sài Gòn',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/assets/logo.svg`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+84-914-345-357',
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: 'vi',
      },
    ],
    sameAs: [
      'https://www.facebook.com/3Kshop',
      'https://www.tiktok.com/@3kshop_official',
      'https://www.instagram.com/vinylsaigon.vn',
      'https://www.youtube.com/@3KShopChannel',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/ket-qua-tim-kiem?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang='vi'>
      <head>
        {/* Preconnect and DNS-prefetch hints for essential domains */}
        <link rel='preconnect' href='https://vinylsaigon.vn' />
        <link rel='dns-prefetch' href='https://vinylsaigon.vn' />
        <link rel='preconnect' href='https://app.vinylsaigon.vn' />
        <link rel='dns-prefetch' href='https://app.vinylsaigon.vn' />
        <link rel='preconnect' href='https://assets.vinylsaigon.vn' />
        <link rel='dns-prefetch' href='https://assets.vinylsaigon.vn' />
        {process.env.NEXT_PUBLIC_MEILISEARCH_URL && (
          <>
            <link rel='preconnect' href={process.env.NEXT_PUBLIC_MEILISEARCH_URL} />
            <link rel='dns-prefetch' href={process.env.NEXT_PUBLIC_MEILISEARCH_URL} />
          </>
        )}
        {alternates &&
          alternates.map((a) => (
            <link key={a.lang} rel='alternate' hrefLang={a.lang} href={a.url} />
          ))}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={cn(stylized.variable, base.variable, 'antialiased')}>
        <StoreInitializer />
        <NextTopLoader
          color='var(--color-atomic-tangerine-400)'
          height={3}
          showSpinner={false}
          easing='ease-out'
          speed={500}
        />
        <RouterInterceptor />
        <Header menuData={menu} searchSuggestions={searchSuggestions} />
        {children}
        <WebVitals />
        <Footer globalData={globalData} />
      </body>
    </html>
  )
}
