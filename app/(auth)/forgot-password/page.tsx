'use client'

import { stylized } from '@/app/fonts'
import { useAuthStore } from '@/app/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/axios'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import logoBlack from '@/public/assets/logo-black.svg'
import Image from 'next/image'
import Link from 'next/link'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Định dạng email không hợp lệ'),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ email?: string }>({})
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const user = useAuthStore((state) => state.user)

  // Validate email field on change
  const validateField = (value: string) => {
    try {
      forgotPasswordSchema.parse({ email: value })
      setValidationErrors({})
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors({ email: fieldError })
      }
    }
  }

  // Redirect to profile if user is already logged in
  useEffect(() => {
    if (user) {
      window.location.href = FRONTEND_PATH.viewProfile
    }
  }, [user])

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!recaptchaRef.current) return
    const recaptchaResponse = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setValidationErrors({})

    try {
      const response = await fetch('/api/validate-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recaptchaResponse }),
      })

      if (!response.ok) {
        throw new Error('ReCAPTCHA validation failed')
      }

      // Validate with Zod before submitting
      const validatedData = forgotPasswordSchema.parse({
        email: email.trim(),
      })

      // Call forgot password API
      const res = await apiClient.post('/auth/forgot_password', { email: validatedData.email })

      if (res.status === 200) {
        setSuccess(
          'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.',
        )
        setEmail('') // Clear form on success
      } else {
        throw new Error('Không thể gửi email đặt lại mật khẩu')
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: { email?: string } = {}
        err.issues.forEach((issue) => {
          if (issue.path[0] === 'email') {
            errors.email = issue.message
          }
        })
        setValidationErrors(errors)
      } else {
        // Handle API errors
        if (err.response) {
          const status = err.response.status
          const errorData = err.response.data

          switch (status) {
            case 404:
              setError('Không tìm thấy tài khoản với email này')
              break
            case 422:
              if (errorData?.error) {
                setError(errorData.error)
              } else {
                setError('Email không hợp lệ')
              }
              break
            case 429:
              setError('Quá nhiều yêu cầu. Vui lòng thử lại sau')
              break
            case 500:
              setError('Lỗi hệ thống. Vui lòng thử lại sau')
              break
            default:
              setError(`Có lỗi xảy ra (Mã lỗi: ${status})`)
          }
        } else if (err.request) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng')
        } else {
          setError('Có lỗi xảy ra. Vui lòng thử lại')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center text-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>Quên mật khẩu?</h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      <div className='mt-8'>
        <form onSubmit={onSubmit} className='space-y-6'>
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          />
          <div className='space-y-4'>
            <div>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='Địa chỉ email *'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateField(e.target.value)
                }}
                onBlur={(e) => validateField(e.target.value)}
                className={cn(
                  'mt-2 h-12 border-gray-300 selection:bg-blue-200 selection:text-gray-900',
                  (error || validationErrors.email) && 'border-red-500 focus-visible:ring-red-500',
                )}
                disabled={isLoading}
                aria-invalid={!!(error || validationErrors.email)}
              />
              {validationErrors.email && (
                <p className='mt-1 text-sm text-red-600'>{validationErrors.email}</p>
              )}
            </div>

            {error && (
              <div className='flex items-center gap-2 mt-2 text-red-500 text-sm'>
                <svg width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <circle cx='12' cy='12' r='10' strokeWidth='2' />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8v4m0 4h.01'
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className='flex items-center gap-2 mt-2 text-green-600 text-sm'>
                <svg width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <circle cx='12' cy='12' r='10' strokeWidth='2' />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-black text-white hover:text-white hover:bg-black hover:cursor-pointer'
            disabled={isLoading || !email.trim() || !!validationErrors.email}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
          </Button>

          <div className='text-center text-sm space-y-2'>
            <div>
              <Link href='/dang-nhap' className='font-medium text-black hover:underline'>
                ← Quay lại đăng nhập
              </Link>
            </div>
            <div>
              <span className='text-gray-600'>Chưa có tài khoản? </span>
              <Link href='/dang-ky' className='font-medium text-black hover:underline'>
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
