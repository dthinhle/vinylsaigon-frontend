'use client'

import { searchOrder } from '@/app/api/order'
import { IOrder, PaymentMethodType } from '@/lib/types/order'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import OrderNote from '../order-note'
import OrderSuccess from '../order-success'
import OrderSummary from '../order-summary'

const OrderConfirmation: React.FC = () => {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order_number')
  const email = searchParams.get('email')

  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber || !email) {
        setError('Thiếu thông tin đơn hàng hoặc email')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await searchOrder(email, orderNumber)
        const { order } = response.data
        setOrder(order)
      } catch (err: any) {
        console.error('Error fetching order:', err)
        setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber, email])

  // generate order form from order data
  const generateOrderFormFromOrder = (orderData: IOrder) => {
    return {
      email: orderData.email || '',
      name: orderData.name || '',
      phone_number: orderData.phoneNumber || '',
      shipping_method: orderData.shippingMethod,
      payment_method: orderData.paymentMethod as PaymentMethodType,
      authenticatedSession: false,
      checkoutStep: 3, // Success step
      store_address_id: null,
      shipping_address: null,
    }
  }

  if (loading) {
    return (
      <div className='max-w-screen-xl mx-[2%] xl:mx-auto flex items-center justify-center pt-[3rem] min-h-[60vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-screen-xl mx-[2%] xl:mx-auto pt-[3rem]'>
        <div className='max-w-md mx-auto text-center'>
          <div className='bg-white rounded-lg shadow-sm p-8'>
            <div className='text-red-500 mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Có lỗi xảy ra</h1>
            <p className='text-gray-600 mb-8'>{error}</p>
            <Link
              href='/'
              className='bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-900 transition-colors inline-block'
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='max-w-screen-xl mx-[2%] xl:mx-auto pt-[3rem]'>
        <div className='max-w-md mx-auto text-center'>
          <div className='bg-white rounded-lg shadow-sm p-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Không tìm thấy đơn hàng</h1>
            <p className='text-gray-600 mb-8'>
              Không tìm thấy đơn hàng với mã số và email đã cung cấp.
            </p>
            <Link
              href='/'
              className='bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-900 transition-colors inline-block'
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const orderForm = generateOrderFormFromOrder(order)

  return (
    <div className='max-w-screen-xl mx-[2%] xl:mx-auto flex flex-col-reverse lg:flex-row gap-6 pt-[3rem]'>
      <OrderNote className='block lg:hidden mt-0' />
      <div className='w-full lg:max-w-[66%]'>
        <OrderSuccess order={order} orderForm={orderForm} />
      </div>
      <div className='lg:w-1/3'>
        <OrderSummary cart={order.cart} />
      </div>
    </div>
  )
}

export default OrderConfirmation
