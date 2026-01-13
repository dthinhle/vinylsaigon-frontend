'use client'

import { stylized } from '@/app/fonts'
import { useAuthStore } from '@/app/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import logoBlack from '@/public/assets/logo-black.svg'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'

// Zod validation schema
const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Định dạng email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .refine((password) => {
      const hasLower = /[a-z]/.test(password)
      const hasUpper = /[A-Z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
      const metCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
      return metCount >= 3
    }, 'Mật khẩu phải chứa ít nhất 3 trong 4 loại: chữ thường, chữ hoa, số, ký tự đặc biệt'),
})

export function RegisterContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const signUp = useAuthStore((state) => state.signUp)
  const user = useAuthStore((state) => state.user)

  // Validate fields on change
  const validateField = (name: string, value: string) => {
    try {
      if (name === 'email') {
        registerSchema.pick({ email: true }).parse({ email: value })
        setValidationErrors((prev) => ({ ...prev, email: undefined }))
      } else if (name === 'password') {
        registerSchema.pick({ password: true }).parse({ password: value })
        setValidationErrors((prev) => ({ ...prev, password: undefined }))
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors((prev) => ({ ...prev, [name]: fieldError }))
      }
    }
  }

  // Password requirements for enabling submit
  const minLength = password.length >= 8
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  const metCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
  const atLeastThree = metCount >= 3

  const getIcon = (ok: boolean) =>
    ok ? (
      <svg
        width='20'
        height='20'
        className='text-green-500'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
      </svg>
    ) : (
      <svg width='16' height='16' className='text-gray-400' fill='currentColor' viewBox='0 0 16 16'>
        <circle cx='8' cy='8' r='4' />
      </svg>
    )

  const passwordChecklist = () => (
    <div className='mt-4 mb-2 p-4 rounded border border-gray-300 bg-white'>
      <div className='font-medium mb-2 text-gray-700'>Mật khẩu của bạn phải chứa:</div>
      <ul className='space-y-1 text-sm'>
        <li className='flex items-center gap-2'>
          {getIcon(minLength)}
          <span className={minLength ? 'text-green-500' : 'text-gray-700'}>Ít nhất 8 ký tự</span>
        </li>
        <li className='flex items-center gap-2'>
          {getIcon(atLeastThree)}
          <span className={atLeastThree ? 'text-green-500' : 'text-gray-700'}>
            Có ít nhất 3 trong các loại sau:
          </span>
        </li>
        <ul className='ml-6 space-y-1'>
          <li className='flex items-center gap-2'>
            {getIcon(hasLower)}
            <span className={hasLower ? 'text-green-500' : 'text-gray-700'}>Chữ thường (a-z)</span>
          </li>
          <li className='flex items-center gap-2'>
            {getIcon(hasUpper)}
            <span className={hasUpper ? 'text-green-500' : 'text-gray-700'}>Chữ hoa (A-Z)</span>
          </li>
          <li className='flex items-center gap-2'>
            {getIcon(hasNumber)}
            <span className={hasNumber ? 'text-green-500' : 'text-gray-700'}>Số (0-9)</span>
          </li>
          <li className='flex items-center gap-2'>
            {getIcon(hasSpecial)}
            <span className={hasSpecial ? 'text-green-500' : 'text-gray-700'}>
              Ký tự đặc biệt (ví dụ !@#$%^&*)
            </span>
          </li>
        </ul>
      </ul>
    </div>
  )

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
      const validatedData = registerSchema.parse({ email, password })

      await signUp(validatedData)
      setError(null)
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: { email?: string; password?: string } = {}
        err.issues.forEach((error) => {
          if (error.path[0] === 'email') {
            errors.email = error.message
          } else if (error.path[0] === 'password') {
            errors.password = error.message
          }
        })
        setValidationErrors(errors)
      } else {
        setError((err as Error).message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // check if user is logged in, if yes redirect to profile page
  useEffect(() => {
    // get current user profile
    if (user) {
      window.location.href = FRONTEND_PATH.viewProfile
    }
  }, [user])

  // Check if form is valid
  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    !validationErrors.email &&
    !validationErrors.password &&
    minLength &&
    atLeastThree

  return (
    <div className='w-full max-w-100 space-y-8 bg-white p-8 rounded-lg shadow-sm'>
      <div className='flex flex-col items-center justify-center'>
        <Link href='/'>
          <Image src={logoBlack} alt='Vinyl Sài Gòn' className='w-32 h-auto' priority unoptimized />
        </Link>
        <h1 className={cn('mt-8 text-2xl tracking-tight', stylized.className)}>
          Chào bạn đến với Vinyl Sài Gòn!
        </h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Đăng ký để theo dõi đơn hàng và nhận những ưu đãi đặc biệt.
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
                className={cn(
                  'mt-2 h-12 border-gray-300 selection:bg-blue-200 selection:text-gray-900',
                  validationErrors.email && 'border-red-500 focus-visible:ring-red-500',
                )}
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateField('email', e.target.value)
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                aria-invalid={!!validationErrors.email}
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
                  autoComplete='new-password'
                  required
                  placeholder='Mật khẩu *'
                  className={cn(
                    'mt-2 h-12 pr-10 border-gray-300 selection:bg-blue-200 selection:text-gray-900',
                    validationErrors.password && 'border-red-500 focus-visible:ring-red-500',
                  )}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validateField('password', e.target.value)
                  }}
                  onBlur={(e) => validateField('password', e.target.value)}
                  aria-invalid={!!validationErrors.password}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
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
              {/* Password requirements checklist */}
              {password.length > 0 && passwordChecklist()}
            </div>
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
              <span>
                {error === 'Please fill in all fields' ? 'Vui lòng điền đầy đủ thông tin' : error}
              </span>
            </div>
          )}
          <Button
            type='submit'
            className='w-full bg-black text-white hover:text-white hover:bg-black hover:cursor-pointer'
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Tiếp tục'}
          </Button>
          <div className='text-center text-sm'>
            <span className='text-gray-600'>Đã có tài khoản? </span>
            <Link href='/dang-nhap' className='font-medium text-black hover:underline'>
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
