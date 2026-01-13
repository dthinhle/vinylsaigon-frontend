'use client'

import { updateUser } from '@/app/api/user'
import { BreadcrumbNav } from '@/app/components/page/breadcrumb-nav'
import { stylized } from '@/app/fonts'
import { useAuthStore } from '@/app/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'

// Vietnamese phone validation
const phoneRegex = /^(\+84|0|84)\d*$/

const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được vượt quá 50 ký tự'),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || phoneRegex.test(value), {
      message: 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
    }),
})

export function EditProfileContent() {
  const user = useAuthStore((state) => state.user)
  const refresh = useAuthStore((state) => state.refresh)
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ name?: string; phoneNumber?: string }>(
    {},
  )
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhoneNumber(user.phoneNumber || '')
    }
  }, [user])

  // Validate fields on change
  const validateField = (fieldName: string, value: string) => {
    try {
      if (fieldName === 'name') {
        editProfileSchema.pick({ name: true }).parse({ name: value })
        setValidationErrors((prev) => ({ ...prev, name: undefined }))
      } else if (fieldName === 'phoneNumber') {
        editProfileSchema.pick({ phoneNumber: true }).parse({ phoneNumber: value })
        setValidationErrors((prev) => ({ ...prev, phoneNumber: undefined }))
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors((prev) => ({ ...prev, [fieldName]: fieldError }))
      }
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setValidationErrors({})
    setSuccessMessage('')

    try {
      // Validate form data
      const validatedData = editProfileSchema.parse({ name, phoneNumber })

      // Update user profile
      await updateUser({
        name: validatedData.name,
        phoneNumber: validatedData.phoneNumber || '',
      })

      // Refresh user context to get updated data
      refresh()
      setSuccessMessage('Thông tin tài khoản đã được cập nhật thành công!')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { name?: string; phoneNumber?: string } = {}
        error.issues.forEach((issue) => {
          if (issue.path[0] === 'name') {
            errors.name = issue.message
          } else if (issue.path[0] === 'phoneNumber') {
            errors.phoneNumber = issue.message
          }
        })
        setValidationErrors(errors)
      } else {
        console.error('Error updating user profile:', error)
        setValidationErrors({ name: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.' })
      }
    }
    setIsLoading(false)
  }

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
                stylized.className,
                'scroll-m-20 text-black lg:text-2xl text-xl font-medium tracking-tight lg:mt-4 mt-3',
              )}
            >
              {breadcrumbNodes.at(-1)?.label}
            </h1>
          </div>
          <div className='flex flex-col lg:flex-row lg:gap-8 mt-8'>
            <div className='flex-1  lg:border-gray-300 lg:pl-12'>
              {/* Edit Form */}
              <div className='mx-auto w-full lg:w-3/7'>
                <div className='mb-6 text-center'>
                  <span className={cn(stylized.className, 'font-semibold text-lg lg:text-xl')}>
                    Chỉnh sửa thông tin tài khoản
                  </span>

                  <p className='py-4'>Cập nhật thông tin cá nhân của bạn</p>
                </div>

                {successMessage && (
                  <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
                    {successMessage}
                  </div>
                )}

                <form onSubmit={onSubmit}>
                  <div className='mb-6'>
                    <label
                      htmlFor='email'
                      className='block font-semibold text-sm lg:text-base mb-2'
                    >
                      Địa chỉ email:
                    </label>
                    <Input
                      type='email'
                      value={user?.email || ''}
                      disabled
                      placeholder='Nhập email của bạn'
                      className='h-12 w-full border border-gray-600 bg-gray-100'
                    />
                    <p className='text-sm text-gray-500 mt-1'>Địa chỉ email không thể thay đổi</p>
                  </div>

                  <div className='mb-6'>
                    <label htmlFor='name' className='block font-semibold text-sm lg:text-base mb-2'>
                      Tên <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      id='name'
                      type='text'
                      value={name}
                      required
                      placeholder='Nhập tên của bạn'
                      onChange={(e) => {
                        setName(e.target.value)
                        validateField('name', e.target.value)
                      }}
                      className='h-12'
                    />
                    {validationErrors.name && (
                      <p className='text-red-500 text-sm mt-1'>{validationErrors.name}</p>
                    )}
                  </div>

                  <div className='mb-8'>
                    <label
                      htmlFor='phoneNumber'
                      className='block font-semibold text-sm lg:text-base mb-2'
                    >
                      Số điện thoại:
                    </label>
                    <Input
                      id='phoneNumber'
                      type='tel'
                      value={phoneNumber}
                      required
                      placeholder='Nhập số điện thoại của bạn'
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        validateField('phoneNumber', e.target.value)
                      }}
                      className='h-12'
                    />
                    {validationErrors.phoneNumber && (
                      <p className='text-red-500 text-sm mt-1'>{validationErrors.phoneNumber}</p>
                    )}
                  </div>

                  <div className='flex mt-4 justify-center'>
                    <Button
                      type='submit'
                      className='bg-gray-950 text-white hover:bg-gray-800 cursor-pointer w-full py-6'
                      disabled={
                        isLoading ||
                        !name.trim() ||
                        !!validationErrors.name ||
                        !!validationErrors.phoneNumber
                      }
                    >
                      {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                    </Button>
                  </div>
                  <div className='flex mt-8 justify-center'>
                    <Button
                      type='button'
                      variant='outline'
                      className=' cursor-pointer w-full lg:w-40 py-6'
                      onClick={() => router.push(FRONTEND_PATH.viewProfile)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
