import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Bài viết không tìm thấy</h2>
          <p className='text-gray-600 mb-8'>
            Xin lỗi, bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/tin-tuc'
            className='inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            Quay lại trang tin tức
          </Link>

          <Link
            href='/'
            className='inline-block w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium'
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
