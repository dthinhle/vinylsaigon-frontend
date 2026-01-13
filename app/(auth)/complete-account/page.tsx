'use client'

import { getUser, updateUser } from '@/app/api/user'
import { stylized } from '@/app/fonts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FRONTEND_PATH } from '@/lib/constants'
import { IUser } from '@/lib/types/user'
import { cn } from '@/lib/utils'
import logoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { z } from 'zod'

// Zod validation schema
const completeAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được vượt quá 50 ký tự'),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true // Optional field
      const phoneRegex = /^(\+84|0|84)\d*$$/
      return phoneRegex.test(val)
    }, 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'),
})

export default function CompleteAccountPage() {
  const [, setUser] = useState<IUser | null>(null)
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [subscribe, setSubscribe] = useState(true)
  const [privacyTos, setPrivacyTos] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ name?: string; phoneNumber?: string }>(
    {},
  )

  // Validate fields on change
  const validateField = (fieldName: string, value: string) => {
    try {
      if (fieldName === 'name') {
        completeAccountSchema.pick({ name: true }).parse({ name: value })
        setValidationErrors((prev) => ({ ...prev, name: undefined }))
      } else if (fieldName === 'phoneNumber') {
        completeAccountSchema.pick({ phoneNumber: true }).parse({ phoneNumber: value })
        setValidationErrors((prev) => ({ ...prev, phoneNumber: undefined }))
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors((prev) => ({ ...prev, [fieldName]: fieldError }))
      }
    }
  }

  // Load user profile data and redirect if not authenticated
  useEffect(() => {
    const profile = async () => {
      try {
        const user = (await getUser()) as IUser
        if (user) {
          setUser(user)
          setName(user.name || '')
          setPhoneNumber(user.phoneNumber || '')
        } else {
          // Redirect to login if user is not authenticated
          window.location.href = FRONTEND_PATH.signIn
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Redirect to login on error
        window.location.href = FRONTEND_PATH.signIn
      }
    }
    profile()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setValidationErrors({})

    try {
      // Validate with Zod before submitting
      const validatedData = completeAccountSchema.parse({
        name: name.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      })

      await updateUser({
        name: validatedData.name,
        phoneNumber: validatedData.phoneNumber || '',
        subscribeNewsletter: subscribe,
      })
      window.location.href = FRONTEND_PATH.viewProfile
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
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
      }
      setIsLoading(false)
      return
    }
  }

  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center text-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>
          Hoàn tất tài khoản
        </h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Vui lòng nhập các trường cần thiết để hoàn tất đăng ký tài khoản của bạn
        </p>
      </div>
      <form onSubmit={onSubmit} className='space-y-6 mt-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
            Tên <span className='text-red-500'>*</span>
          </label>
          <Input
            id='name'
            name='name'
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              validateField('name', e.target.value)
            }}
            onBlur={(e) => validateField('name', e.target.value)}
            className={cn(
              'h-12 selection:bg-blue-200 selection:text-gray-900',
              validationErrors.name && 'border-red-500 focus-visible:ring-red-500',
            )}
            autoComplete='given-name'
            aria-invalid={!!validationErrors.name}
          />
          {validationErrors.name && (
            <p className='mt-1 text-sm text-red-600'>{validationErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-1'>
            Số điện thoại <span className='text-gray-700 font-light'>(tùy chọn)</span>
          </label>
          <Input
            id='phoneNumber'
            name='phoneNumber'
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value)
              validateField('phoneNumber', e.target.value)
            }}
            onBlur={(e) => validateField('phoneNumber', e.target.value)}
            className={cn(
              'h-12 selection:bg-blue-200 selection:text-gray-900',
              validationErrors.phoneNumber && 'border-red-500 focus-visible:ring-red-500',
            )}
            autoComplete='tel'
            aria-invalid={!!validationErrors.phoneNumber}
          />
          {validationErrors.phoneNumber && (
            <p className='mt-1 text-sm text-red-600'>{validationErrors.phoneNumber}</p>
          )}
        </div>
        <div className='mt-2 grid gap-1 grid-cols-[min-content_1fr]'>
          <input
            id='subscribe'
            name='subscribe'
            type='checkbox'
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className='self-start mt-1 rounded border-gray-300 text-black focus:ring-black accent-gray-900'
          />
          <label htmlFor='subscribe' className='ml-2 text-sm text-gray-700'>
            Tôi muốn nhận thông tin về sản phẩm mới, ưu đãi độc quyền và nhiều hơn nữa.
          </label>
          <input
            id='privacyTos'
            name='privacyTos'
            type='checkbox'
            checked={privacyTos}
            onChange={(e) => setPrivacyTos(e.target.checked)}
            className='self-start mt-1 rounded border-gray-300 text-black focus:ring-black accent-gray-900'
          />
          <label htmlFor='privacyTos' className='ml-2 text-sm text-gray-700'>
            Tôi đã xem và đồng ý với{' '}
            <Link href='/privacy-policy' className='underline'>
              Chính sách quyền riêng tư
            </Link>
          </label>
        </div>
        <Button
          type='submit'
          className='w-full bg-black text-white hover:bg-gray-800 hover:text-white mt-4'
          disabled={
            isLoading ||
            !name.trim() ||
            !privacyTos ||
            !!validationErrors.name ||
            !!validationErrors.phoneNumber
          }
        >
          {isLoading ? 'Đang hoàn tất...' : 'Hoàn tất'}
        </Button>
      </form>
    </div>
  )
}
