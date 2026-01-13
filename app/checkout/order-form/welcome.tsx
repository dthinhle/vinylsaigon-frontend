'use client'

import { cartApi } from '@/app/cart/services/cart-api'
import { CheckoutStep, IOrderForm } from '@/app/hooks/use-checkout'
import { CheckIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'

interface WelcomeProps {
  email: string
  authenticatedSession: Boolean
  setEmail: (email: string) => void
  updateOrderForm: (updates: Partial<IOrderForm>) => void
  onContinue?: () => void
}
interface EmailConsentProps {
  emailConsent: boolean
  setEmailConsent: Dispatch<SetStateAction<boolean>>
}

const EmailConsent: React.FC<EmailConsentProps> = ({ emailConsent, setEmailConsent }) => {
  const handleConsentChange = (checked: boolean) => {
    setEmailConsent(checked)
  }

  return (
    <div className={'flex items-center gap-3'}>
      <div className='flex items-center h-5'>
        <input
          id='toggle-button-id-emailConsent'
          name='emailConsent'
          type='checkbox'
          checked={emailConsent}
          onChange={(e) => handleConsentChange(e.target.checked)}
          className='w-4 h-4 text-black border-gray-300 accent-black'
          data-testid='toggle-button-id-emailConsent'
        />
      </div>
      <div className='flex-1'>
        <label
          htmlFor='toggle-button-id-emailConsent'
          className='text-sm text-gray-600 cursor-pointer'
        >
          Giữ tôi được cập nhật về các sản phẩm mới, ưu đãi độc quyền và nhiều hơn nữa.{' '}
          <Link
            href='/bao-mat-thong-tin-ca-nhan'
            className='text-black font-semibold hover:text-gray-700 underline underline-offset-2 transition-colors'
          >
            Chính sách bảo mật
          </Link>
        </label>
      </div>
    </div>
  )
}

export const Welcome: React.FC<WelcomeProps> = ({
  email,
  authenticatedSession,
  setEmail,
  updateOrderForm,
  onContinue,
}) => {
  const [emailConsent, setEmailConsent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email là bắt buộc'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email không hợp lệ'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email || '')
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    try {
      setLoading(true)
      await cartApi.updateGuestEmail(email)
      setErrors({})
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error updating guest email:', error)
      throw error
    } finally {
      setLoading(false)
    }

    if (onContinue) onContinue()
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setEmail(email)

    if (errors.email) {
      setErrors({ ...errors, email: undefined })
    }
  }

  const toggleEditEmail = () => {
    setIsSubmitted(false)
    updateOrderForm({ checkoutStep: CheckoutStep.Welcome })
  }

  return (
    <div className='bg-white mt-6 pb-8'>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-semibold'>
            {authenticatedSession || isSubmitted ? (
              <CheckIcon className='size-5 text-white font-bold' />
            ) : (
              <span>1</span>
            )}
          </span>
          <h2 className='text-xl font-semibold text-gray-900'>Chào mừng</h2>
        </div>
      </div>

      {authenticatedSession ? (
        <div className='lg:ml-[3rem]'>
          <div className='space-y-4'>
            <p className='text-black text-base'>Đã đăng nhập với tài khoản {email}</p>

            <EmailConsent emailConsent={emailConsent} setEmailConsent={setEmailConsent} />
          </div>
        </div>
      ) : isSubmitted ? (
        <div className='lg:ml-[3rem]'>
          <div className='flex items-center justify-between'>
            <p className='text-black text-base'>Thông báo sẽ được gửi tới {email}</p>
            <button
              onClick={toggleEditEmail}
              className='min-w-18 text-black font-semibold text-sm hover:text-gray-700 underline underline-offset-2 transition-colors cursor-pointer'
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-2 lg:ml-[3rem]'>
          <p className='text-gray-600 text-sm lg:text-base'>
            Tiếp tục với tư cách khách hàng hoặc đăng nhập để có trải nghiệm thanh toán nhanh hơn
          </p>
          <div className='space-y-2'>
            <div>
              <label htmlFor='sp-email' className='block text-base font-semibold text-gray-700'>
                <span className='text-red-500'>*</span> Địa chỉ email
              </label>
            </div>
            <div className='relative'>
              <input
                id='sp-email'
                type='email'
                name='email'
                value={email}
                onChange={handleEmailChange}
                placeholder='example@email.com'
                className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:border-black ${
                  errors.email
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-invalid={!!errors.email}
                data-testid='sp-email'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2 mt-4'>
            <button
              type='submit'
              disabled={loading}
              className='min-w-[210px] bg-black text-white py-3 px-4 rounded-sm font-semibold text-sm hover:bg-gray-900 transition-colors cursor-pointer flex items-center justify-center disabled:bg-gray-500'
            >
              {loading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-500'></div>
              ) : (
                <span>Tiếp tục với tư cách khách</span>
              )}
            </button>

            <span className='text-gray-500 text-sm'>hoặc</span>
            <Link
              href={'/dang-nhap'}
              className='text-black font-semibold text-sm hover:text-gray-700 underline underline-offset-2 transition-colors'
            >
              Đăng nhập
            </Link>
          </div>

          <EmailConsent emailConsent={emailConsent} setEmailConsent={setEmailConsent} />
        </form>
      )}
    </div>
  )
}
