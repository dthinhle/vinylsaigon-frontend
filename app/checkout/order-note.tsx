'use client'

import { PhoneNumber } from '@/app/components/phone-number'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import freeShipping from '@/public/assets/free-shipping.svg'
import warranty from '@/public/assets/warranty.svg'
import { CircleQuestionMark } from 'lucide-react'
import Image from 'next/image'

type Props = {
  className: string
}

const OrderNote: React.FC<Props> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className='flex justify-around py-4 border-y border-gray-300'>
        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-2'>
            <Image
              src={freeShipping}
              width={48}
              height={48}
              className='w-full h-full'
              alt='Free shipping'
              unoptimized
            />
          </div>
          <p className='text-xs font-medium'>
            Miễn phí
            <br />
            vận chuyển
          </p>
        </div>

        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-2'>
            <Image
              src={warranty}
              width={48}
              height={48}
              className='w-full h-full'
              alt='Limited warranty'
              unoptimized
            />
          </div>
          <p className='text-xs font-medium'>
            Bảo hành
            <br />
            có giới hạn
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMark className='w-3 h-3 inline ml-1 cursor-help' />
              </TooltipTrigger>
              <TooltipContent
                className='text-pretty'
                style={
                  {
                    '--foreground': 'var(--color-gray-950)',
                    '--background': 'white',
                  } as React.CSSProperties
                }
              >
                <p>Bảo hành sản phẩm theo chính sách của nhà sản xuất</p>
              </TooltipContent>
            </Tooltip>
          </p>
        </div>
      </div>

      <div className='space-y-4 text-sm'>
        <div>
          <h4 className='font-semibold mb-2'>Miễn phí đổi trả</h4>
          <p className='text-gray-600'>
            Miễn phí đổi trả trong vòng 7 ngày làm việc nếu có lỗi từ nhà sản xuất.
          </p>
        </div>

        <div>
          <h4 className='font-semibold mb-2'>Cần hỗ trợ với đơn hàng?</h4>
          <ul className='list-disc ml-4'>
            <li>
              <span>6B Đinh Bộ Lĩnh, P.24, Q. Bình Thạnh</span>
              <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='font-semibold mb-2'>Chi tiết thanh toán</h4>
          <p className='text-gray-600'>
            Vui lòng xem{' '}
            <a href='/hinh-thuc-thanh-toan' className='text-black font-bold underline'>
              Hình thức thanh toán
            </a>{' '}
            để biết thêm thông tin về các phương thức thanh toán
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderNote
