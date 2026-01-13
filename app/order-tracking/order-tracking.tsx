'use client'

import { useOrderTracking } from '@/app/hooks/use-order-tracking'
import { PhoneNumber } from '@/app/components/phone-number'
import { Toaster } from '@/components/ui/sonner'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import * as React from 'react'

import LoadingSpinner from '../components/blog/loading-spinner'
import { OrderInfo } from './order-info'
import { FindOrderForm } from './search-order-form'

export const OrderTracking: React.FC = () => {
  const { order, showDetails, loading, fetching, handleSearch } = useOrderTracking()

  return (
    <div>
      <Toaster position='top-center' richColors theme='light' className='[&_li]:mt-6' />
      {fetching ? (
        <div className='min-h-[min(120rem,_100dvh]'>
          <LoadingSpinner />
        </div>
      ) : showDetails && order ? (
        <OrderInfo order={order} />
      ) : (
        <FindOrderForm loading={loading} handleSearch={handleSearch} />
      )}
      <div className='flex flex-col lg:py-6 py-0 lg:flex-row border-t border-gray-300'>
        <div className='space-y-4 py-6 lg:py-0 md:px-6 lg:border-r border-gray-300'>
          <h3 className='text-xl font-semibold text-gray-900'>Trạng thái đơn hàng</h3>
          <ul className='space-y-3 text-gray-700'>
            <li className='flex items-start gap-2'>
              <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0'></span>
              <span>
                Sau khi đơn hàng được xử lý, email xác nhận đơn hàng sẽ được gửi đến bạn với mã xác
                nhận đơn hàng. Hãy lưu lại mã này để theo dõi đơn hàng và xử lý việc đổi trả.
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0'></span>
              <span>
                Email xác nhận giao hàng với mã theo dõi sẽ được gửi khi đơn hàng rời khỏi kho của
                chúng tôi.
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0'></span>
              <span>
                Sau khi đặt hàng và thanh toán, đơn hàng không thể hủy bỏ. Nếu sản phẩm đủ điều kiện
                đổi trả, bạn có thể thực hiện quy trình đổi trả trong vòng 7 ngày sau khi nhận hàng.
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0'></span>
              <span>
                Thời gian xử lý và giao hàng ước tính với dịch vụ giao hàng nhanh là khoảng 3-5 ngày
                làm việc, tuy nhiên thời gian này có thể thay đổi tùy theo địa điểm giao hàng.
              </span>
            </li>
          </ul>
        </div>

        <div className='space-y-4 py-6 lg:py-0 md:px-6'>
          <div className='flex items-start gap-4'>
            <QuestionMarkCircledIcon className='size-8 hidden lg:block' />
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Không tìm thấy thông tin bạn cần?
              </h3>
              <p className='text-gray-700 mb-4'>
                Vui lòng liên hệ với đại diện Chăm sóc khách hàng của chúng tôi và chúng tôi sẽ giúp
                giải đáp các câu hỏi của bạn.
              </p>

              <div className='space-y-3'>
                <p className='font-semibold text-gray-900'>Giờ làm việc Chăm sóc khách hàng</p>
                <div className='text-sm text-gray-700'>
                  <strong>Cửa hàng 1:</strong>
                  <br />
                  <Link
                    href={'https://maps.app.goo.gl/p8g4VwmG9WadD3Vh9'}
                    target='_blank'
                    className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                      after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
                  >
                    14 Nguyễn Văn Giai, P. Đa Kao, Q.1
                  </Link>
                  <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
                </div>

                <div className='text-sm text-gray-700'>
                  <strong>Cửa hàng 2:</strong>
                  <br />
                  <Link
                    href={'https://maps.app.goo.gl/LNCo5krNtub6rD326'}
                    target='_blank'
                    className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                      after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
                  >
                    6B Đinh Bộ Lĩnh, P.24, Q. Bình Thạnh
                  </Link>
                  <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
                </div>
              </div>

              <p className='mt-4'>
                <Link href='/contact' className='text-black underline'>
                  Biểu mẫu liên hệ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
