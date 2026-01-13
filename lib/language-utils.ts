/**
 * Language utilities for hreflang generation.
 *
 * Provides a simple mapping between Vietnamese and English frontend routes and
 * helper functions to generate alternate URLs (hreflang) for a given pathname.
 *
 * Usage:
 * import { getAlternateUrls } from '@/lib/language-utils'
 * const alternates = getAlternateUrls(pathname, process.env.NEXT_PUBLIC_APP_URL)
 *
 * - Defaults to Vietnamese as x-default.
 * - Supports simple patterns with one `:slug` parameter (e.g. `/tin-tuc/:slug`).
 *
 * Keep mapping small and explicit to avoid false positives.
 */

type MappingEntry = {
  vi: string
  en: string
}

/**
 * URL language map - add or adjust pairs here as site evolves.
 * Patterns may include a single `:slug` token for dynamic pages.
 */
export const URL_LANGUAGE_MAP: MappingEntry[] = [
  // Root / main sections
  { vi: '/', en: '/' },
  { vi: '/san-pham', en: '/products' },
  { vi: '/thuong-hieu', en: '/brands' },
  { vi: '/bo-suu-tap', en: '/collections' },
  { vi: '/tin-tuc', en: '/news' },
  { vi: '/ket-qua-tim-kiem', en: '/search' },

  // Auth
  { vi: '/dang-nhap', en: '/login' },
  { vi: '/dang-ky', en: '/register' },
  { vi: '/quen-mat-khau', en: '/forgot-password' },
  { vi: '/dat-lai-mat-khau', en: '/reset-password' },
  { vi: '/hoan-tat-dang-ky', en: '/complete-account' },

  // Account area
  { vi: '/tai-khoan', en: '/view-profile' },
  { vi: '/tai-khoan/chinh-sua-ho-so', en: '/edit-profile' },
  { vi: '/tai-khoan/don-hang', en: '/orders' },

  // Cart / Checkout / Order
  { vi: '/gio-hang', en: '/cart' },
  { vi: '/thanh-toan', en: '/checkout' },
  { vi: '/thanh-toan/xac-nhan', en: '/checkout/confirmation' },
  { vi: '/tra-cuu-don-hang', en: '/order-tracking' },

  // Static pages
  { vi: '/lien-he', en: '/contact' },
  { vi: '/gioi-thieu', en: '/about' },
  { vi: '/bao-mat-thong-tin-ca-nhan', en: '/privacy-policy' },
  { vi: '/hinh-thuc-thanh-toan', en: '/payment-methods' },
  { vi: '/chinh-sach-van-chuyen', en: '/shipping-policy' },
  { vi: '/huong-dan-mua-tra-gop', en: '/installment-guide' },
  { vi: '/cam-ket-hang-hoa', en: '/product-guarantee' },

  // Dynamic patterns (support single :slug)
  { vi: '/tin-tuc/:slug', en: '/news/:slug' },
  { vi: '/danh-muc/:slug', en: '/products/category/:slug' },
  { vi: '/thuong-hieu/:slug', en: '/brands/:slug' },
  { vi: '/bo-suu-tap/:slug', en: '/collections/:slug' },

  // Generic product slug -> product detail (last resort)
  { vi: '/:slug', en: '/products/:slug' },
]

/**
 * Try to match a path against a template.
 * Template may contain a single `:slug` token.
 * Returns an object with keys for tokens if matched, otherwise null.
 */
function matchTemplate(template: string, path: string): Record<string, string> | null {
  if (!template.includes(':')) {
    // exact match
    return template === path ? {} : null
  }

  // Only support single :slug token to keep logic simple
  const tokenName = template.split(':')[1]
  const [prefix, suffix] = template.split(`:${tokenName}`)
  const regex = new RegExp('^' + escapeRegex(prefix) + '([^/]+)' + escapeRegex(suffix) + '$')
  const m = path.match(regex)
  if (!m) return null
  return { [tokenName]: decodeURIComponent(m[1]) }
}

/** Escape string for regex */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Substitute params into a template */
function fillTemplate(template: string, params: Record<string, string> = {}) {
  let out = template
  Object.keys(params).forEach((k) => {
    out = out.replace(`:${k}`, encodeURIComponent(params[k]))
  })
  return out
}

/**
 * Get alternate URLs for given pathname.
 * - Returns array of { lang, url } including 'vi' and 'en'.
 * - Always returns x-default pointing to Vietnamese root when baseUrl provided.
 */
export function getAlternateUrls(
  pathname: string,
  baseUrl: string,
): Array<{ lang: string; url: string }> {
  const path = normalizePathname(pathname)
  const alternates: Array<{ lang: string; url: string }> = []

  // Try to find mapping entry that matches path (first exact/static, then pattern)
  // Prefer more specific mappings (longer template)
  const candidates = URL_LANGUAGE_MAP.slice().sort((a, b) => {
    const la = Math.max(a.vi.length, a.en.length)
    const lb = Math.max(b.vi.length, b.en.length)
    return lb - la
  })

  for (const m of candidates) {
    // Try vi -> en
    const viMatch = matchTemplate(m.vi, path)
    if (viMatch !== null) {
      const viUrl = joinUrl(baseUrl, fillTemplate(m.vi, viMatch))
      const enUrl = joinUrl(baseUrl, fillTemplate(m.en, viMatch))
      alternates.push({ lang: 'vi', url: viUrl })
      alternates.push({ lang: 'en', url: enUrl })
      // unique results only
      return normalizeAlternates(alternates, baseUrl)
    }

    // Try en -> vi
    const enMatch = matchTemplate(m.en, path)
    if (enMatch !== null) {
      const viUrl = joinUrl(baseUrl, fillTemplate(m.vi, enMatch))
      const enUrl = joinUrl(baseUrl, fillTemplate(m.en, enMatch))
      alternates.push({ lang: 'vi', url: viUrl })
      alternates.push({ lang: 'en', url: enUrl })
      return normalizeAlternates(alternates, baseUrl)
    }
  }

  // If nothing matched, fall back to homepage alternates
  alternates.push({ lang: 'vi', url: joinUrl(baseUrl, path) })
  alternates.push({ lang: 'en', url: joinUrl(baseUrl, path) }) // best-effort same url for en if not mapped

  return normalizeAlternates(alternates, baseUrl)
}

/** Normalize pathname: ensure leading slash, remove trailing slash (except root) */
function normalizePathname(p: string) {
  if (!p.startsWith('/')) p = '/' + p
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

/** Join base and path safely */
function joinUrl(base: string, path: string) {
  if (!base) return path
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
}

/** Remove duplicates and ensure x-default (vi) is included */
function normalizeAlternates(alts: Array<{ lang: string; url: string }>, baseUrl: string) {
  const seen = new Map<string, string>()
  for (const a of alts) {
    seen.set(a.lang, a.url)
  }

  // Ensure both languages exist
  if (!seen.has('vi')) {
    seen.set('vi', baseUrl)
  }
  if (!seen.has('en')) {
    // best-effort: point en to same as vi
    seen.set('en', seen.get('vi') || baseUrl)
  }

  const result: Array<{ lang: string; url: string }> = []
  for (const [lang, url] of seen.entries()) {
    result.push({ lang, url })
  }

  // add x-default pointing to Vietnamese default
  result.push({ lang: 'x-default', url: seen.get('vi') || baseUrl })

  return result
}
