'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/axios'
import { IOrder } from '@/lib/types/order'
import { OrderInfo } from '@/app/order-tracking/order-info'
import { FRONTEND_PATH } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const orderNumber = params.orderNumber as string

  useEffect(() => {
    if (!orderNumber) return

    const fetchOrderDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get(`/orders/${orderNumber}`)
        setOrder(response.data.order)
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderNumber])

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes('Network Error') || err.message.includes('fetch')) {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
      }
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      }
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        return 'Bạn không có quyền truy cập đơn hàng này.'
      }
      if (err.message.includes('404')) {
        return 'Không tìm thấy đơn hàng.'
      }
      if (err.message.includes('500')) {
        return 'Lỗi hệ thống. Vui lòng thử lại sau.'
      }
      return 'Có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng thử lại.'
    }
    return 'Có lỗi không xác định. Vui lòng thử lại sau.'
  }

  if (isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto'>
        <div className='w-full mt-12 lg:mt-20 py-4 lg:py-8'>
          <div className='max-w-screen-2xl mx-auto p-4 lg:p-6 lg:px-20 lg:pt-8 lg:mt-0 mt-2'>
            <div className='flex justify-center py-12'>
              <div className='text-base lg:text-lg text-gray-600'>Đang tải thông tin đơn hàng...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className='max-w-screen-2xl mx-auto'>
        <div className='w-full mt-12 lg:mt-20 py-4 lg:py-8'>
          <div className='max-w-screen-2xl mx-auto p-4 lg:p-6 lg:px-20 lg:pt-8 lg:mt-0 mt-2'>
            <div className='text-center py-12'>
              <div className='text-base lg:text-lg text-red-600 mb-4'>
                {error || 'Không tìm thấy thông tin đơn hàng'}
              </div>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  variant='outline'
                  className='border-gray-300 text-gray-700 hover:bg-gray-50'
                  onClick={() => router.push(FRONTEND_PATH.orders)}
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Quay lại danh sách đơn hàng
                </Button>
                <Button
                  variant='outline'
                  className='border-gray-300 text-gray-700 hover:bg-gray-50'
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto'>
      <div className='w-full mt-12 lg:mt-20 py-4 lg:py-8'>
        <div className='max-w-screen-2xl mx-auto p-4 lg:p-6 lg:px-20 lg:pt-8 lg:mt-0 mt-2'>
          <div className='mb-6'>
            <Link
              href={FRONTEND_PATH.orders}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='text-sm'>Quay lại danh sách đơn hàng</span>
            </Link>
          </div>

          <OrderInfo order={order} hideNav />
        </div>
      </div>
    </div>
  )
}
