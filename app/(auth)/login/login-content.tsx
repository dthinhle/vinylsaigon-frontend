'use client'

import { stylized } from '@/app/fonts'
import { useAuthStore } from '@/app/store/auth-store'
import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import logoBlack from '@/public/assets/logo-black.svg'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Định dạng email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

export function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const signIn = useAuthStore((state) => state.signIn)
  const user = useAuthStore((state) => state.user)
  const initializeCart = useCartStore((state) => state.initializeCart)
  const router = useRouter()

  // Validate fields on change
  const validateField = (fieldName: string, value: string) => {
    try {
      if (fieldName === 'email') {
        loginSchema.pick({ email: true }).parse({ email: value })
        setValidationErrors((prev) => ({ ...prev, email: undefined }))
      } else if (fieldName === 'password') {
        loginSchema.pick({ password: true }).parse({ password: value })
        setValidationErrors((prev) => ({ ...prev, password: undefined }))
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors((prev) => ({ ...prev, [fieldName]: fieldError }))
      }
    }
  }

  // check if user is logged in, if yes redirect to profile page
  useEffect(() => {
    // get current user profile
    if (user) {
      router.back()
    }
  }, [user, router])

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!recaptchaRef.current) return
    const recaptchaResponse = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()

    setIsLoading(true)
    setError(null)
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
      const validatedData = loginSchema.parse({
        email: email.trim(),
        password: password.trim(),
      })

      await signIn(validatedData)
      await initializeCart()
      setError(null)
      setIsLoading(false)
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: { email?: string; password?: string } = {}
        err.issues.forEach((issue) => {
          if (issue.path[0] === 'email') {
            errors.email = issue.message
          } else if (issue.path[0] === 'password') {
            errors.password = issue.message
          }
        })
        setValidationErrors(errors)
      } else {
        setError((err as Error).message)
      }
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center text-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>Xin chào!</h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Đăng nhập để theo dõi đơn hàng và nhận những ưu đãi đặc biệt.
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
                  validateField('email', e.target.value)
                }}
                onBlur={(e) => validateField('email', e.target.value)}
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

            <div>
              <div className='relative mt-1'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  placeholder='Mật khẩu *'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validateField('password', e.target.value)
                  }}
                  onBlur={(e) => validateField('password', e.target.value)}
                  className={cn(
                    'mt-2 h-12 pr-10 border-gray-300 selection:bg-blue-200 selection:text-gray-900',
                    (error || validationErrors.password) &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  disabled={isLoading}
                  aria-invalid={!!(error || validationErrors.password)}
                />
                <button
                  type='button'
                  className='absolute right-3 top-[30%] text-gray-400 hover:text-gray-600'
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className='mt-1 text-sm text-red-600'>{validationErrors.password}</p>
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
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <Link href='/quen-mat-khau' className='font-medium text-black hover:underline'>
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-black text-white hover:text-white hover:bg-black hover:cursor-pointer'
            disabled={
              isLoading ||
              !email.trim() ||
              !password.trim() ||
              !!validationErrors.email ||
              !!validationErrors.password
            }
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <div className='text-center text-sm'>
            <span className='text-gray-600'>Chưa có tài khoản? </span>
            <Link href='/dang-ky' className='font-medium text-black hover:underline'>
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
