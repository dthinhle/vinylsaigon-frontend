'use client'

import { AccountSidebar } from '@/app/components/account'
import { BreadcrumbNav } from '@/app/components/page/breadcrumb-nav'
import { montserrat } from '@/app/fonts'
import { useAuthStore } from '@/app/store/auth-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { capitalize } from 'lodash'
import Link from 'next/link'
import * as React from 'react'

export function ViewProfileContent() {
  const user = useAuthStore((state) => state.user)

  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Tài khoản',
      link: FRONTEND_PATH.viewProfile,
    },
  ]

  const name = React.useMemo(
    () => (user && user.name ? capitalize(user.name) : 'Người dùng'),
    [user],
  )

  return (
    <div className='max-w-screen-2xl mx-auto'>
      <div className='w-full mt-12 lg:mt-20 py-4 lg:py-8'>
        <div className='max-w-screen-2xl mx-auto p-4 lg:p-6 lg:px-20 lg:pt-8 lg:mt-0 mt-2'>
          {/* Breadcrumb - hidden on mobile */}
          <div className='lg:mb-4 lg:mt-0 mb-6 mt-6'>
            <BreadcrumbNav
              nodes={breadcrumbNodes.slice(0, -1)}
              renderLastSeparator={true}
              classNames={{ link: 'lg:text-sm text-black' }}
            />
            <h1
              className={cn(
                montserrat.className,
                'scroll-m-20 text-black lg:text-2xl text-xl font-medium tracking-tight lg:mt-4 mt-3',
              )}
            >
              {breadcrumbNodes.at(-1)?.label}
            </h1>
          </div>

          <div className='flex flex-col lg:flex-row lg:gap-8 mt-8'>
            {/* Sidebar */}
            <div className='block lg:mb-0 mb-6'>
              <AccountSidebar currentPage='profile' />
            </div>

            {/* Profile Details */}
            <div className='flex-1 lg:border-l lg:border-gray-300 lg:pl-12 space-y-6'>
              <div>
                <div
                  className={cn(montserrat.className, 'mb-1 font-semibold text-base lg:text-xl')}
                >
                  {name}
                </div>

                <Link
                  href={FRONTEND_PATH.editProfile}
                  className='font-medium relative inline-block text-black underline'
                >
                  Chỉnh sửa thông tin
                </Link>
              </div>

              <div>
                <div className='mb-1'>
                  <span className='font-semibold text-sm lg:text-base'>Ngôn ngữ:</span>
                </div>
                <div>
                  <span className='text-base lg:text-lg text-gray-700'>Tiếng Việt</span>
                </div>
              </div>

              <div>
                <div className='mb-1'>
                  <span className='font-semibold text-sm lg:text-base'>Địa chỉ email:</span>
                </div>
                <div>
                  <span className='text-base lg:text-lg text-gray-700'>
                    {user ? user.email : ''}
                  </span>
                </div>
              </div>

              <div>
                <div className='mb-1'>
                  <span className='font-semibold text-sm lg:text-base'>Số điện thoại:</span>
                </div>
                <div>
                  <span className='text-base lg:text-lg text-gray-700'>
                    {user && user.phoneNumber ? user.phoneNumber : 'Chưa có số điện thoại'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
