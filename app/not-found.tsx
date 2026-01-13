import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Không tìm thấy trang - 3K Shop',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
}

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <div className='text-9xl font-bold text-gray-300 mb-4'>404</div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Không tìm thấy trang</h1>
          <p className='text-lg text-gray-600 mb-8'>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/'
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
