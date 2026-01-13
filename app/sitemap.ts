import { API_URL } from '@/lib/constants'
import { MetadataRoute } from 'next'
import { buildSafeUrl, processPath } from '@/lib/url-sanitizer'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

  try {
    // Fetch dynamic data with proper error handling
    const [productsRes, categoriesRes, collectionsRes, blogsRes, brandsRes, menuItemsRes] =
      await Promise.allSettled([
        fetch(`${API_URL}/api/seo/products`),
        fetch(`${API_URL}/api/seo/categories`),
        fetch(`${API_URL}/api/seo/collections`),
        fetch(`${API_URL}/api/seo/blogs`),
        fetch(`${API_URL}/api/seo/brands`),
        fetch(`${API_URL}/api/seo/menu_items`),
      ])

    // Parse responses safely with error handling
    const [products, categories, collections, blogs, brands, menuItems] = await Promise.all([
      productsRes.status === 'fulfilled' && productsRes.value.ok
        ? productsRes.value.json()
        : { data: [] },
      categoriesRes.status === 'fulfilled' && categoriesRes.value.ok
        ? categoriesRes.value.json()
        : { data: [] },
      collectionsRes.status === 'fulfilled' && collectionsRes.value.ok
        ? collectionsRes.value.json()
        : { data: [] },
      blogsRes.status === 'fulfilled' && blogsRes.value.ok
        ? blogsRes.value.json()
        : { data: [] },
      brandsRes.status === 'fulfilled' && brandsRes.value.ok
        ? brandsRes.value.json()
        : { data: [] },
      menuItemsRes.status === 'fulfilled' && menuItemsRes.value.ok
        ? menuItemsRes.value.json()
        : { data: [] },
    ])

    // Static pages with defensive URL construction
    const staticPages = [
      { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/san-pham`, priority: 0.9, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/thuong-hieu`, priority: 0.8, changeFrequency: 'weekly' as const },
      { url: `${baseUrl}/bo-suu-tap`, priority: 0.8, changeFrequency: 'weekly' as const },
      { url: `${baseUrl}/tin-tuc`, priority: 0.7, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/gioi-thieu`, priority: 0.5, changeFrequency: 'monthly' as const },
      { url: `${baseUrl}/lien-he`, priority: 0.5, changeFrequency: 'monthly' as const },
      { url: `${baseUrl}/cam-ket-hang-hoa`, priority: 0.5, changeFrequency: 'monthly' as const },
      {
        url: `${baseUrl}/bao-mat-thong-tin-ca-nhan`,
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      },
      {
        url: `${baseUrl}/hinh-thuc-thanh-toan`,
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      },
      {
        url: `${baseUrl}/huong-dan-mua-tra-gop`,
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      },
      {
        url: `${baseUrl}/chinh-sach-van-chuyen`,
        priority: 0.5,
        changeFrequency: 'monthly' as const,
      },
    ]

    // Dynamic products with defensive URL construction
    const productPages = Array.isArray(products?.data)
      ? products.data
          .filter((product: any) => product && product.slug) // Filter out invalid entries
          .map((product: any) => {
            const safeUrl = buildSafeUrl(baseUrl, product.slug)
            return safeUrl ? {
              url: safeUrl,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
              priority: 0.8,
              changeFrequency: 'weekly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    // Dynamic categories with defensive URL construction
    const categoryPages = Array.isArray(categories?.data)
      ? categories.data
          .filter((cat: any) => cat && cat.slug) // Filter out invalid entries
          .map((cat: any) => {
            const path = processPath(`danh-muc/${cat.slug}`)
            const safeUrl = path ? buildSafeUrl(baseUrl, path) : null
            return safeUrl ? {
              url: safeUrl,
              lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
              priority: 0.7,
              changeFrequency: 'weekly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    // Dynamic collections with defensive URL construction
    const collectionPages = Array.isArray(collections?.data)
      ? collections.data
          .filter((col: any) => col && col.slug) // Filter out invalid entries
          .map((col: any) => {
            const path = processPath(`bo-suu-tap/${col.slug}`)
            const safeUrl = path ? buildSafeUrl(baseUrl, path) : null
            return safeUrl ? {
              url: safeUrl,
              lastModified: col.updatedAt ? new Date(col.updatedAt) : new Date(),
              priority: 0.7,
              changeFrequency: 'weekly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    // Dynamic blogs with defensive URL construction
    const blogPages = Array.isArray(blogs?.data)
      ? blogs.data
          .filter((blog: any) => blog && blog.slug) // Filter out invalid entries
          .map((blog: any) => {
            const path = processPath(`tin-tuc/${blog.slug}`)
            const safeUrl = path ? buildSafeUrl(baseUrl, path) : null
            return safeUrl ? {
              url: safeUrl,
              lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
              priority: 0.6,
              changeFrequency: 'monthly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    // Dynamic brands with defensive URL construction
    const brandPages = Array.isArray(brands?.data)
      ? brands.data
          .filter((brand: any) => brand && brand.slug) // Filter out invalid entries
          .map((brand: any) => {
            const path = processPath(`thuong-hieu/${brand.slug}`)
            const safeUrl = path ? buildSafeUrl(baseUrl, path) : null
            return safeUrl ? {
              url: safeUrl,
              lastModified: brand.updatedAt ? new Date(brand.updatedAt) : new Date(),
              priority: 0.7,
              changeFrequency: 'weekly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    // Dynamic menu items with defensive URL construction
    const menuPages = Array.isArray(menuItems?.data)
      ? menuItems.data
          .filter((item: any) => item && item.slug) // Filter out invalid entries
          .map((item: any) => {
            const safeUrl = buildSafeUrl(baseUrl, item.slug)
            return safeUrl ? {
              url: safeUrl,
              lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
              priority: 0.6,
              changeFrequency: 'weekly' as const,
            } : null
          })
          .filter((page: any) => page !== null) // Filter out null entries
      : []

    return [
      ...staticPages,
      ...productPages,
      ...categoryPages,
      ...collectionPages,
      ...blogPages,
      ...brandPages,
      ...menuPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return only static pages if API calls fail
    return [
      { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/san-pham`, priority: 0.9, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/thuong-hieu`, priority: 0.8, changeFrequency: 'weekly' as const },
      { url: `${baseUrl}/bo-suu-tap`, priority: 0.8, changeFrequency: 'weekly' as const },
      { url: `${baseUrl}/tin-tuc`, priority: 0.7, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/gioi-thieu`, priority: 0.5, changeFrequency: 'monthly' as const },
      { url: `${baseUrl}/lien-he`, priority: 0.5, changeFrequency: 'monthly' as const },
    ]
  }
}
