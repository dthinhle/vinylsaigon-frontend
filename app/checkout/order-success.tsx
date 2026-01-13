'use client'

import { CreateOrderResponse } from '@/app/api/order'
import { IOrderForm } from '@/app/hooks/use-checkout'
import Link from 'next/link'

interface Props {
  order: CreateOrderResponse['order']
  orderForm: IOrderForm
}
const getStatusDisplay = (status: string) => {
  const statusMap = {
    awaiting_payment: {
      text: 'Chờ thanh toán',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
    },
    paid: {
      text: 'Đã thanh toán',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    canceled: {
      text: 'Đã hủy',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
    confirmed: {
      text: 'Đã xác nhận',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    fulfilled: {
      text: 'Đã hoàn thành',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
    refunded: {
      text: 'Đã hoàn tiền',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    failed: {
      text: 'Thất bại',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  }

  return (
    statusMap[status as keyof typeof statusMap] || {
      text: status,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    }
  )
}

export default function OrderSuccess({ order, orderForm }: Props) {
  const isPickupAtStore = orderForm.shipping_method === 'pick_up_at_store'
  const contactInfo = orderForm.email
  const statusDisplay = getStatusDisplay(order.status)

  return (
    <div className='w-full bg-white rounded-lg p-8 pt-0'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold text-gray-900 mb-2'>
          Chúng tôi đã nhận được đơn hàng của bạn
        </h1>
        <p className='text-lg text-gray-600 mb-2'>
          Cảm ơn bạn đã đặt hàng{orderForm.name ? `, ${orderForm.name}` : ''}
        </p>
        <p className='text-gray-600 mb-6'>
          Email xác nhận với chi tiết đơn hàng đang được gửi đến: <br />
          <span className='font-semibold text-gray-900'>{contactInfo}</span>
        </p>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-2'>Mã đơn hàng:</h2>

        <div className='max-w-fit bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-2'>
          <span className='text-base font-mono font-bold text-gray-900'>{order.orderNumber}</span>
        </div>
        <p className='text-md text-gray-600 mb-4 pb-6 border-b border-gray-300'>
          Hãy lưu giữ số này để tiện tra cứu khi có thắc mắc về đơn hàng của bạn.
        </p>

        <div className='grid grid-cols-1 gap-4 text-sm pb-6 border-b border-gray-300'>
          <div className='text-left'>
            <span className='text-gray-600'>Tổng tiền:</span>
            <span className='font-semibold text-gray-900 ml-2'>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(order.totalVnd)}
            </span>
          </div>

          <div className='text-left'>
            <span className='text-gray-600'>Phương thức giao hàng:</span>
            <span className='font-semibold text-gray-900 ml-2'>
              {orderForm.shipping_method === 'ship_to_address'
                ? 'Giao hàng tận nơi'
                : 'Nhận tại cửa hàng'}
            </span>
          </div>

          <div className='text-left'>
            <span className='text-gray-600'>Phương thức thanh toán:</span>
            <span className='font-semibold text-gray-900 ml-2'>
              {orderForm.payment_method === 'cod' && 'Thanh toán khi nhận hàng'}
              {orderForm.payment_method === 'onepay' && 'OnePay'}
              {orderForm.payment_method === 'bank_transfer' && 'Chuyển khoản ngân hàng'}
              {orderForm.payment_method === 'installment' && 'Tranh toán trả góp'}
            </span>
          </div>

          <div className='text-left'>
            <span className='text-gray-600'>Trạng thái:</span>
            <span
              className={`px-3 py-1 ${statusDisplay.bgColor} ${statusDisplay.textColor} rounded-full text-xs ml-2`}
            >
              {statusDisplay.text}
            </span>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8'>
        <h3 className='font-semibold text-gray-900 mb-3'>Bước tiếp theo:</h3>
        <ul className='space-y-2 text-sm text-gray-800'>
          {isPickupAtStore ? (
            <>
              <li>
                • Chúng tôi sẽ liên hệ với bạn qua số điện thoại khi đơn hàng sẵn sàng để nhận
              </li>
              <li>• Vui lòng mang theo mã đơn hàng khi đến nhận hàng</li>
              <li>• Thời gian chuẩn bị: 1-2 ngày làm việc</li>
            </>
          ) : (
            <>
              <li>• Đơn hàng sẽ được xử lý trong vòng 24 giờ</li>
              <li>• Thời gian giao hàng: 2-5 ngày làm việc</li>
              <li>• Bạn sẽ nhận được thông báo khi đơn hàng được giao</li>
            </>
          )}
        </ul>
      </div>

      <Link
        href='/'
        className='bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-900 transition-colors text-center'
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  )
}
