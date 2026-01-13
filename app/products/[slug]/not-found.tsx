import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sản phẩm không tìm thấy - Vinyl Sài Gòn',
  description: 'Sản phẩm bạn đang tìm kiếm có thể đã hết hàng hoặc không còn tồn tại.',
}

export default function ProductNotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Sản phẩm không tìm thấy</h2>
        <p className='text-gray-600 mb-8'>
          Sản phẩm bạn đang tìm kiếm có thể đã hết hàng hoặc không còn tồn tại.
        </p>
        <div className='flex gap-4 justify-center'>
          <Link
            href='/san-pham'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base text-zinc-950 font-medium rounded-md shadow-sm text-white bg-amber-300 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors'
          >
            Xem tất cả sản phẩm
          </Link>
          <Link
            href='/'
            className='inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
