'use client'

import { DEFAULT_VARIANT_NAME, FRONTEND_PATH } from '@/lib/constants'
import { PhoneNumber } from '@/app/components/phone-number'
import { IOrder, OrderStatus, OrderStatusLabels } from '@/lib/types/order'
import { cn } from '@/lib/utils'
import { formatVND, genFullAddress } from '@/lib/utils/format'
import OnePayLogo from '@/public/assets/onepay_logo.svg'
import { Banknote, Building2, ChevronLeft, CreditCard, Receipt, Store, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useShopStore } from '../store/shop-store'

interface OrderInfoProps {
  order: IOrder
  hideNav?: boolean
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order, hideNav = false }) => {
  const store = useShopStore((state) => state.store)
  const stores = store?.addresses || []

  const getStatusDisplay = (status: string) => {
    const orderStatus = status as OrderStatus
    return OrderStatusLabels[orderStatus] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.FULFILLED:
        return 'text-blue-700'
      case OrderStatus.CONFIRMED:
      case OrderStatus.PAID:
        return 'text-green-700'
      case OrderStatus.AWAITING_PAYMENT:
        return 'text-orange-700'
      case OrderStatus.CANCELED:
      case OrderStatus.FAILED:
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  const getPaymentMethodDisplay = (paymentMethod: string) => {
    const paymentMethods = {
      cod: {
        name: 'Thanh toán khi nhận hàng (COD)',
        icon: <Banknote className='size-5' />,
      },
      onepay: {
        name: 'Thanh toán OnePay',
        icon: <Image alt='onepay-logo' src={OnePayLogo} className='w-8 h-auto' unoptimized />,
      },
      bank_transfer: {
        name: 'Chuyển khoản ngân hàng',
        icon: <Building2 className='size-5' />,
      },
      installment: {
        name: 'Thanh toán trả góp',
        icon: <Receipt className='size-5' />,
      },
    }

    return (
      paymentMethods[paymentMethod as keyof typeof paymentMethods] || {
        name: paymentMethod,
        icon: <CreditCard className='size-5' />,
      }
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const paymentInfo = getPaymentMethodDisplay(order.paymentMethod)
  const selectedStore =
    order.shippingMethod === 'ship_to_address'
      ? null
      : stores.find((s) => s.id.toString() === order.storeAddressId?.toString())

  return (
    <div className='max-w-screen-xl mx-auto sm:px-6 lg:px-8 py-8'>
      {
        !hideNav && (
          <Link
            className='flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-900'
            href={FRONTEND_PATH.orderTracking}
          >
            <ChevronLeft className='size-4' />
            <p className='text-sm'>Tra cứu đơn hàng khác</p>
          </Link>
        )
      }
      <div className='p-4 my-6 border-t-1 border-gray-300'>
        <h1 className={cn('text-2xl font-bold mb-2', getStatusColor(order.status))}>
          {getStatusDisplay(order.status)}
        </h1>
        <p className='text-sm text-gray-500 mb-2'>
          Đặt hàng ngày:{' '}
          <span className='text-gray-900 font-medium'>{formatDate(order.createdAt)}</span>
        </p>
        <p className='text-sm text-gray-500'>
          Mã đơn hàng: <span className='text-gray-900 font-medium'>{order.orderNumber}</span>
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8'>
          <div className='bg-white md:mb-6 border-t-1 border-gray-300'>
            <div className='space-y-6'>
              {order.items.map((item) => (
                <div key={item.id} className='flex flex-row sm:gap-6 gap-2 sm:p-4 p-2'>
                  <div className='flex-shrink-0'>
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        width={160}
                        height={160}
                        className='md:size-40 size-32 rounded-lg object-cover'
                      />
                    ) : (
                      <div className='md:size-40 size-32 bg-gray-200 rounded-lg flex items-center justify-center'>
                        <span className='text-gray-400 text-sm'>No image</span>
                      </div>
                    )}
                  </div>
                  <div className='flex-1 space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-900'>{item.productName}</h3>
                    {item.variantName != DEFAULT_VARIANT_NAME && (
                      <p className='text-sm text-gray-600 italic'>{item.variantName}</p>
                    )}

                    <div className='flex flex-wrap items-center gap-4'>
                      <p className='text-lg font-bold text-gray-900'>
                        {formatVND(item.unitPriceVnd)}
                      </p>
                      {item.originalUnitPriceVnd > item.unitPriceVnd && (
                        <p className='text-sm text-gray-500 line-through'>
                          {formatVND(item.originalUnitPriceVnd)}
                        </p>
                      )}
                    </div>

                    <div className='text-sm text-gray-600 space-y-1'>
                      <p>Số lượng: {item.quantity}</p>
                      <p>Thành tiền: {formatVND(item.subtotalVnd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='lg:col-span-4'>
          <div className='border-t-1 border-gray-300'>
            {order.shippingMethod === 'ship_to_address' && order.shippingAddress && (
              <div className='bg-white p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Truck className='size-5 text-gray-600' />
                  <h3 className='text-lg font-semibold text-gray-900'>Địa chỉ giao hàng</h3>
                </div>

                <div className='text-sm text-gray-600 space-y-1'>
                  <p className='font-medium text-gray-900'>{order.name}</p>
                  <p>{order.email}</p>
                  <p>{order.phoneNumber}</p>
                  <p>{genFullAddress(order.shippingAddress)}</p>
                </div>
              </div>
            )}

            {order.shippingMethod === 'pick_up_at_store' && selectedStore && (
              <div className='bg-white p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Store className='size-5 text-gray-600' />
                  <h3 className='text-lg font-semibold text-gray-900'>Nhận hàng tại</h3>
                </div>

                <div className='text-sm text-gray-600 space-y-1'>
                  <div className='text-sm text-gray-700'>
                    <strong>{selectedStore.name}:</strong>
                    <br />
                    <Link
                      href={selectedStore.mapUrl}
                      target='_blank'
                      className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                        after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
                    >
                      {selectedStore.address}, {selectedStore.ward}, {selectedStore.district}
                    </Link>
                    <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
                  </div>
                </div>
              </div>
            )}

            <div className='bg-white p-6 border-t-1 border-gray-300'>
              <div className='flex items-center gap-2 mb-4'>
                <CreditCard className='size-5 text-gray-600' />
                <h3 className='text-lg font-semibold text-gray-900'>Phương thức thanh toán</h3>
              </div>

              <div className='border border-gray-300 rounded-lg p-3 max-w-fit'>
                <div className='flex items-center gap-3'>
                  <div className='text-gray-600'>{paymentInfo.icon}</div>
                  <p className='font-medium text-gray-600 text-sm'>{paymentInfo.name}</p>
                </div>
              </div>
            </div>

            <div className='bg-white border-t border-gray-300 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tóm tắt đơn hàng</h3>

              <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-gray-600'>
                  <span>Tạm tính</span>
                  <span>{formatVND(order.subtotalVnd)}</span>
                </div>

                <div className='flex justify-between text-gray-600'>
                  <span>Phí vận chuyển</span>
                  <span>{formatVND(order.shippingVnd)}</span>
                </div>

                {order.discountVnd > 0 && (
                  <div className='flex justify-between text-green-600'>
                    <span>Giảm giá</span>
                    <span>-{formatVND(order.discountVnd)}</span>
                  </div>
                )}

                <div className='flex justify-between text-lg font-semibold text-gray-900'>
                  <span>Tổng cộng</span>
                  <span>{formatVND(order.totalVnd)}</span>
                </div>
              </div>
            </div>

            <div className='bg-white border-t-1 border-gray-300 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Cần hỗ trợ?</h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>Các chính sách</h4>
                  <div className='space-y-2 text-sm'>
                    <Link
                      href={FRONTEND_PATH.shippingPolicy}
                      className='block text-gray-600 hover:text-gray-900 underline'
                    >
                      Chính sách vận chuyển
                    </Link>
                    <Link
                      href={FRONTEND_PATH.guarantee}
                      className='block text-gray-600 hover:text-gray-900 underline'
                    >
                      Chính sách bảo hành
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
