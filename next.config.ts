import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false, // Ensure consistent URL structure without trailing slashes
  cacheMaxMemorySize: 256 * 1024 * 1024, // 256MB
  images: {
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9500',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'vinylsaigon.vn',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'app.vinylsaigon.vn',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.vinylsaigon.vn',
      },
      // 3kshop assets
      {
        protocol: 'https',
        hostname: 'assets.3kshop.vn',
      },
      {
        protocol: 'https',
        hostname: 'app.3kshop.vn',
        pathname: '/rails/active_storage/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=600, stale-while-revalidate=1800', // 10min cache
          },
        ],
      },
    ]
  },
  rewrites: async () => {
    return [
      {
        source: '/dang-nhap',
        destination: '/login',
      },
      {
        source: '/dang-ky',
        destination: '/register',
      },
      {
        source: '/quen-mat-khau',
        destination: '/forgot-password',
      },
      {
        source: '/dat-lai-mat-khau',
        destination: '/reset-password',
      },
      {
        source: '/hoan-tat-dang-ky',
        destination: '/complete-account',
      },
      {
        source: '/tai-khoan',
        destination: '/view-profile',
      },
      {
        source: '/tai-khoan/chinh-sua-ho-so',
        destination: '/edit-profile',
      },
      {
        source: '/tai-khoan/don-hang',
        destination: '/orders',
      },
      {
        source: '/tai-khoan/don-hang/:orderNumber',
        destination: '/orders/:orderNumber',
      },
      {
        source: '/tai-khoan/tra-hang',
        destination: '/returns',
      },
      {
        source: '/tin-tuc',
        destination: '/news',
      },
      {
        source: '/tin-tuc/:slug',
        destination: '/news/:slug', // Redirect old news URLs to new ones
      },
      {
        source: '/ket-qua-tim-kiem',
        destination: '/search',
      },
      {
        source: '/san-pham',
        destination: '/products',
      },
      {
        source: '/danh-muc/:slug',
        destination: '/products/category/:slug', // Redirect old news URLs to new ones
      },
      {
        source: '/thuong-hieu',
        destination: '/brands',
      },
      {
        source: '/thuong-hieu/:slug',
        destination: '/brands/:slug',
      },
      {
        source: '/thuong-hieu/:slug/:categorySlug',
        destination: '/brands/:slug/:categorySlug',
      },
      {
        source: '/bo-suu-tap',
        destination: '/collections',
      },
      {
        source: '/bo-suu-tap/:slug',
        destination: '/collections/:slug',
      },
      {
        source: '/bo-suu-tap/:slug/:categorySlug',
        destination: '/collections/:slug/:categorySlug',
      },
      {
        source: '/gio-hang',
        destination: '/cart',
      },
      {
        source: '/thanh-toan',
        destination: '/checkout',
      },
      {
        source: '/thanh-toan/xac-nhan',
        destination: '/checkout/confirmation',
      },
      {
        source: '/tra-cuu-don-hang',
        destination: '/order-tracking',
      },

      // Static pages
      {
        source: '/gioi-thieu',
        destination: '/about',
      },
      {
        source: '/lien-he',
        destination: '/contact',
      },
      {
        source: '/bao-mat-thong-tin-ca-nhan',
        destination: '/privacy-policy',
      },
      {
        source: '/hinh-thuc-thanh-toan',
        destination: '/payment-methods',
      },
      {
        source: '/chinh-sach-van-chuyen',
        destination: '/shipping-policy',
      },
      {
        source: '/huong-dan-mua-tra-gop',
        destination: '/installment-guide',
      },
      {
        source: '/cam-ket-hang-hoa',
        destination: '/product-guarantee',
      },
      {
        source: '/khong-tim-thay-trang',
        destination: '/not-found',
      },
      // Generic product slug rewrite, must be last
      {
        source: '/san-pham/:slug',
        destination: '/products/:slug',
      },
    ]
  },
  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
}

export default nextConfig
