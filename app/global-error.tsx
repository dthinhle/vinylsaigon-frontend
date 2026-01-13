'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  const isServerError = error.digest || // Next.js server errors have digest
    error.message?.includes('NEXT_NOT_FOUND') ||
    error.message?.includes('NEXT_REDIRECT') ||
    error.stack?.includes('at ServerComponent') ||
    error.stack?.includes('at async')

  if (!isServerError) {
    return null
  }

  return (
    <html lang='vi'>
      <body className='antialiased'>
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
          <div className='max-w-md w-full space-y-8 text-center'>
            <div>
              <div className='text-9xl font-bold text-red-400 mb-4'>!</div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>Oops!</h1>
              <p className='text-lg text-gray-600 mb-8'>
                Đã xảy ra lỗi không mong muốn. <br/>Vui lòng tải lại trang hoặc liên hệ hỗ trợ.
              </p>
            </div>

            <div className='space-y-4'>
              <button
                onClick={reset}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
              >
                Tải lại ứng dụng
              </button>

              <Link
                href='/'
                className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
              >
                Về trang chủ
              </Link>
            </div>

            <div className='mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <p className='text-sm text-gray-600'>
                <strong>Mã lỗi:</strong> {error.digest || 'CRITICAL_ERROR'}
              </p>
              <p className='text-xs text-gray-500 mt-1'>Liên hệ: support@3kshop.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
