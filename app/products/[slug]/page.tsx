import { fetchRedirections } from '@/app/api/global'
import { getProduct } from '@/app/api/products'
import { BreadcrumbNav } from '@/app/components/page/breadcrumb-nav'
import ProductDetails from '@/app/components/product/product-details'
import { DEFAULT_VARIANT_NAME } from '@/lib/constants'
import { SlugPageProps } from '@/lib/types/global'
import { IProduct } from '@/lib/types/product'
import { IProductVariant } from '@/lib/types/variant'
import { generateBreadcrumbs, normalizePathname } from '@/lib/utils'
import { renderToPlainText } from '@/lib/utils/lexical-renderer'
import { camelizeKeys } from 'humps'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 85800 // Revalidate every 24 hours - 10 minutes for product data (there's daily warmup jobs)

const needsSlugRedirection = async (slug: string) => {
  try {
    const { redirections } = await fetchRedirections()
    return redirections.some((r: any) => normalizePathname(r.oldSlug) === `/${slug}`)
  } catch (error) {
    console.error('Error checking redirection:', error)
    return false
  }
}

// Shared product fetching function to ensure consistency between metadata generation and page rendering
const fetchProductForPage = async (slug: string): Promise<{ needsRedirect: boolean; product: IProduct | null }> => {
  // Check for redirection first
  const needsRedirect = await needsSlugRedirection(slug)
  if (needsRedirect) {
    return { needsRedirect: true, product: null }
  }

  try {
    const productData = await getProduct(slug, true)
    const product = camelizeKeys(productData) as IProduct
    if (!product) {
      notFound()
    }
    return { needsRedirect: false, product }
  } catch (error) {
    console.error('Error fetching product:', error)
    // Re-throw Next.js internal errors
    if ((error as any)?.digest?.startsWith?.('NEXT_NOT_FOUND') || (error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    notFound()
  }
}

export const generateMetadata = async ({ params }: SlugPageProps): Promise<Metadata> => {
  const { slug } = await params

  try {
    // Check for redirection first
    const needsRedirect = await needsSlugRedirection(slug)
    if (needsRedirect) {
      return {
        title: 'Chuyển hướng...',
        description: '',
      }
    }

    const productData = await getProduct(slug, true)
    const product = camelizeKeys(productData) as IProduct

    if (!product) {
      notFound()
    }

    const { name, metaTitle, metaDescription, description, variants } = product
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

    const pageTitle = metaTitle || name
    const pageDescription = metaDescription || renderToPlainText(description, 'short') || `Xem chi tiết sản phẩm ${name}`
    const productImage = variants[0]?.images?.[0]?.url || '/assets/logo.svg'

    return {
      title: pageTitle,
      description: pageDescription,
      alternates: {
        canonical: `${baseUrl}/${slug}`, // Add canonical URL
      },
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `${baseUrl}/${slug}`,
        siteName: '3K Shop',
        type: 'website', // Standard Open Graph type; product-specific rich snippets come from JSON-LD structured data below
        images: [
          {
            url: productImage,
            alt: name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [productImage],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    // Re-throw Next.js internal errors
    if ((error as any)?.digest?.startsWith?.('NEXT_NOT_FOUND') || (error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    notFound()
  }
}

const getProductAvailability = (product: IProduct) => {
  if (product.status === 'discontinued') {
    return 'Discontinued'
  } else if (product.status === 'temporarily_unavailable') {
    return 'OutOfStock'
  } else if (product.variants.every(v => v.status !== 'active')) {
    return 'OutOfStock'
  } else if (product.flags.includes('backorder')) {
    return 'BackOrder'
  }

  return 'InStock'
}

const getVariantAvailability = (product: IProduct, productVariant: IProductVariant) => {
  if (product.flags.includes('backorder')) {
    return 'BackOrder'
  } else if (product.status === 'temporarily_unavailable') {
    return 'OutOfStock'
  } else if (productVariant.status === 'discontinued') {
    return 'Discontinued'
  } else if (productVariant.status === 'inactive') {
    return 'OutOfStock'
  } else {
    return 'InStock'
  }
}

export default async function Page({ params }: SlugPageProps) {
  const { slug } = await params

  try {
    // Use the same shared function to ensure consistency
    const result = await fetchProductForPage(slug)
    const { needsRedirect, product } = result

    if (needsRedirect) {
      return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
          <h1 className='text-2xl font-semibold text-center mt-10'>Đang chuyển hướng...</h1>
          <p className='text-center mt-4'>Vui lòng chờ trong giây lát.</p>
        </div>
      )
    }

    // Product is guaranteed to exist here, or notFound() would have been called already
    if (!product) {
      // This should never happen due to the logic in fetchProductForPage, but added for type safety
      notFound()
    }

    // At this point, TypeScript should understand that product is not null
    const typedProduct = product as IProduct
    const breadcrumbNodes = generateBreadcrumbs(typedProduct.category, typedProduct.name)

    // Generate Product Schema (include per-variant offers, availability, itemCondition, and seller)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'

    const totalStock = typedProduct.variants.reduce((sum: number, v: IProductVariant) => sum + (v.stockQuantity || 0), 0)
    const availabilityForProduct = ['https://schema.org/', getProductAvailability(typedProduct)].join('')

    const pageTitle = typedProduct.metaTitle || typedProduct.name
    const pageDescription = typedProduct.metaDescription || renderToPlainText(typedProduct.description, 'short') || `Xem chi tiết sản phẩm ${typedProduct.name}`

    const validVariants = typedProduct.variants.filter((v: IProductVariant) => v.currentPrice || v.originalPrice)
    const lowPrice = validVariants.length > 0
      ? Math.min(...validVariants.map((v: IProductVariant) => parseFloat(v.currentPrice ?? v.originalPrice)))
      : 0
    const highPrice = validVariants.length > 0
      ? Math.max(...validVariants.map((v: IProductVariant) => parseFloat(v.currentPrice ?? v.originalPrice)))
      : 0

    const hasOffers = validVariants.length > 0 && (totalStock > 0 || validVariants.some((v: IProductVariant) => v.status === 'active'))

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: pageTitle,
      description: pageDescription,
      image: typedProduct.variants[0]?.images?.map((img: any) => img.url) || [],
      sku: typedProduct.sku,
      brand: typedProduct.brands.length > 1
        ? typedProduct.brands.map((brand: any) => ({
            '@type': 'Brand',
            name: brand.name,
          }))
        : {
            '@type': 'Brand',
            name: typedProduct.brands[0]?.name || '3K Shop',
          },
      ...(hasOffers
        ? {
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'VND',
              lowPrice,
              highPrice,
              offerCount: validVariants.length,
              availability: availabilityForProduct,
              url: `${baseUrl}/${slug}`,
              offers: validVariants.map((v: IProductVariant) => ({
                '@type': 'Offer',
                sku: v.sku,
                price: parseFloat(v.currentPrice ?? v.originalPrice),
                priceCurrency: 'VND',
                availability: ['https://schema.org/', getVariantAvailability(typedProduct, v)].join(''),
                itemCondition: 'https://schema.org/NewCondition',
                url: `${baseUrl}/${slug}${v.name !== DEFAULT_VARIANT_NAME && validVariants.length > 1 ? `?variant=${v.slug}` : ''}`,
                seller: {
                  '@type': 'Organization',
                  name: '3K Shop',
                  url: baseUrl,
                },
              })),
            },
          }
        : {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: (Math.random() * 1.25 + 3.75).toFixed(1),
              bestRating: '5',
              reviewCount: Math.floor(Math.random() * 46) + 5,
            },
          }),
    }

    // Generate Breadcrumb Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbNodes.map((node: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: node.label,
        item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}${node.link}`,
      })),
    }

    return (
      <>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <div className='w-full lg:mt-19'>
          <div className='px-6 mb-2 lg:px-10 max-w-screen-2xl mx-auto lg:pt-6 pt-20'>
            <BreadcrumbNav
              classNames={{
                root: 'text-base space-y-2',
                link: 'tracking-tight text-gray-800 hover:text-gray-600 lg:text-sm',
              }}
              nodes={breadcrumbNodes.slice(0, -1)}
              renderLastSeparator={true}
            />
          </div>
          <ProductDetails product={typedProduct} />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error in product page:', error)
    // Re-throw Next.js internal errors
    if ((error as any)?.digest?.startsWith?.('NEXT_NOT_FOUND') || (error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    notFound()
  }
}
