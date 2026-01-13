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
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'

// Zod validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
      ),
    password_confirmation: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['password_confirmation'],
  })

// Loading component for Suspense fallback
export function ResetPasswordLoading() {
  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center text-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>Đang tải...</h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  )
}

// Main component that uses useSearchParams
export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    password?: string
    password_confirmation?: string
  }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const user = useAuthStore((state) => state.user)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Verify token with backend
  const verifyToken = async (tokenToVerify: string) => {
    try {
      const res = await apiClient.post('/auth/verify_reset_password_token', {
        reset_password_token: tokenToVerify,
      })

      if (res.status === 200) {
        setIsTokenValid(true)
        setUserEmail(res.data.data?.email || '')
      } else {
        setIsTokenValid(false)
        setError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
      }
    } catch (err: any) {
      setIsTokenValid(false)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
      }
    }
  }

  // Get token from URL params and verify it
  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (!urlToken) {
      setError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
      setIsTokenValid(false)
      return
    }
    setToken(urlToken)
    verifyToken(urlToken)
  }, [searchParams]) // Redirect to profile if user is already logged in
  useEffect(() => {
    if (user) {
      window.location.href = FRONTEND_PATH.viewProfile
    }
  }, [user])

  // Validate fields on change
  const validateFields = (passwordValue: string, confirmationValue: string) => {
    try {
      resetPasswordSchema.parse({
        password: passwordValue,
        password_confirmation: confirmationValue,
      })
      setValidationErrors({})
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { password?: string; password_confirmation?: string } = {}
        err.issues.forEach((issue) => {
          if (issue.path[0] === 'password') {
            errors.password = issue.message
          } else if (issue.path[0] === 'password_confirmation') {
            errors.password_confirmation = issue.message
          }
        })
        setValidationErrors(errors)
      }
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!recaptchaRef.current) return
    const recaptchaResponse = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setValidationErrors({})

    if (!token) {
      setError('Token đặt lại mật khẩu không hợp lệ')
      setIsLoading(false)
      return
    }

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
      const validatedData = resetPasswordSchema.parse({
        password: password.trim(),
        password_confirmation: passwordConfirmation.trim(),
      })

      // Call reset password API
      const res = await apiClient.post('/auth/reset_password', {
        reset_password_token: token,
        password: validatedData.password,
        password_confirmation: validatedData.password_confirmation,
      })

      if (res.status === 200) {
        setSuccess('Mật khẩu đã được đặt lại thành công! Đang chuyển hướng đến trang đăng nhập...')

        // Clear form
        setPassword('')
        setPasswordConfirmation('')

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/dang-nhap')
        }, 2000)
      } else {
        throw new Error('Không thể đặt lại mật khẩu')
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: { password?: string; password_confirmation?: string } = {}
        err.issues.forEach((issue) => {
          if (issue.path[0] === 'password') {
            errors.password = issue.message
          } else if (issue.path[0] === 'password_confirmation') {
            errors.password_confirmation = issue.message
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
              setError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
              break
            case 422:
              if (errorData?.error) {
                setError(errorData.error)
              } else {
                setError('Thông tin không hợp lệ')
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

  // Show loading state while verifying token
  if (isTokenValid === null) {
    return (
      <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
        <div className='flex flex-col items-center justify-center text-center'>
          <Link href='/'>
            <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
          </Link>
          <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>
            Đang xác thực...
          </h1>
          <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
            Vui lòng chờ trong khi chúng tôi xác thực token của bạn
          </p>
        </div>
      </div>
    )
  }

  // Show error if token is invalid
  if (isTokenValid === false || (!token && error)) {
    return (
      <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
        <div className='flex flex-col items-center justify-center text-center'>
          <Link href='/'>
            <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
          </Link>
          <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>
            Yêu cầu không hợp lệ
          </h1>
          <div className='flex items-center gap-2 mt-4 text-red-500 text-sm'>
            <svg width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <circle cx='12' cy='12' r='10' strokeWidth='2' />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01'
              />
            </svg>
            <span>{'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'}</span>
          </div>
          <div className='mt-6 space-y-2'>
            <Link
              href='/quen-mat-khau'
              className='block w-full py-2 px-4 bg-black text-white text-center rounded-md hover:bg-gray-800 transition-colors'
            >
              Yêu cầu đặt lại mật khẩu mới
            </Link>
            <Link
              href='/dang-nhap'
              className='block text-center font-medium text-black hover:underline'
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center text-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>
          Đặt lại mật khẩu
        </h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Nhập mật khẩu mới để hoàn tất việc đặt lại
        </p>
        {userEmail && (
          <p className='mt-2 text-sm text-gray-500'>
            Cho tài khoản: <span className='font-medium'>{userEmail}</span>
          </p>
        )}
      </div>

      <div className='mt-8'>
        <form onSubmit={onSubmit} className='space-y-6'>
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          />
          <div className='space-y-4'>
            {/* Password Field */}
            <div>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  placeholder='Mật khẩu mới *'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validateFields(e.target.value, passwordConfirmation)
                  }}
                  onBlur={(e) => validateFields(e.target.value, passwordConfirmation)}
                  className={cn(
                    'mt-2 h-12 border-gray-300 pr-10 selection:bg-blue-200 selection:text-gray-900',
                    (error || validationErrors.password) &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  disabled={isLoading}
                  aria-invalid={!!(error || validationErrors.password)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className='mt-1 text-sm text-red-600'>{validationErrors.password}</p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div>
              <div className='relative'>
                <Input
                  id='password_confirmation'
                  name='password_confirmation'
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  placeholder='Xác nhận mật khẩu mới *'
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value)
                    validateFields(password, e.target.value)
                  }}
                  onBlur={(e) => validateFields(password, e.target.value)}
                  className={cn(
                    'mt-2 h-12 border-gray-300 pr-10 selection:bg-blue-200 selection:text-gray-900',
                    (error || validationErrors.password_confirmation) &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  disabled={isLoading}
                  aria-invalid={!!(error || validationErrors.password_confirmation)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  tabIndex={-1}
                >
                  {showPasswordConfirmation ? (
                    <svg
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password_confirmation && (
                <p className='mt-1 text-sm text-red-600'>
                  {validationErrors.password_confirmation}
                </p>
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
            disabled={
              isLoading ||
              !password.trim() ||
              !passwordConfirmation.trim() ||
              !!validationErrors.password ||
              !!validationErrors.password_confirmation ||
              !token
            }
          >
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
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
