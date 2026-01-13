'use client'

import { apiClient } from '@/lib/axios'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

type Status = 'idle' | 'loading' | 'success'

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<Status>('idle')
  const [error, setError] = React.useState('')
  const recaptchaRef = React.useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recaptchaRef.current) return
    const recaptchaResponse = await recaptchaRef.current.executeAsync()

    recaptchaRef.current.reset()

    setError('')
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Vui lòng nhập email hợp lệ.')
      return
    }

    setStatus('loading')
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

      await apiClient.post('/subscribers', { subscriber: { email } })
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err: any) {
      if (err.response && err.status === 409) {
        setError('Email này đã được đăng ký.')
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
      }
      setStatus('idle')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full flex flex-col md:flex-row lg:items-start items-center justify-end gap-3'
    >
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      />
      <div className='input-wrapper w-full max-w-80 relative'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Nhập email của bạn'
          className='py-2 px-4 h-13 border-1 border-white w-full'
          required
          disabled={status !== 'idle'}
        />
        {error && (
          <div className='absolute left-0 -bottom-6 w-full text-left text-red-500 text-sm mt-2'>
            {error}
          </div>
        )}
        {status === 'success' && (
          <div className='absolute left-0 -bottom-6 w-full text-left text-green-500 text-sm mt-2'>
            Đăng ký thành công!
          </div>
        )}
      </div>
      <button
        type='submit'
        className='md:w-40 w-full h-13 py-1 px-6 bg-gray-50 text-gray-950 font-bold text-lg cursor-pointer disabled:cursor-wait disabled:text-gray-800'
        disabled={status === 'loading'}
      >
        {status === 'loading' ? <Loader2 className='animate-spin mx-auto' /> : 'Đăng ký'}
      </button>
    </form>
  )
}

export default NewsletterSignup
