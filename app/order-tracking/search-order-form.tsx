'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import * as React from 'react'
import { FormEventHandler, useState } from 'react'
import { z } from 'zod'

import { montserrat } from '../fonts'

const orderTrackingSchema = z.object({
  email: z.email('Email không hợp lệ.').min(1, 'Vui lòng nhập địa chỉ email.'),
  orderNumber: z.string().min(1, 'Vui lòng nhập mã đơn hàng.'),
})

type Props = {
  loading: boolean
  handleSearch: (email: string, orderNumber: string) => Promise<void>
}

export const FindOrderForm: React.FC<Props> = ({ loading, handleSearch }) => {
  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    orderNumber?: string
  }>({})

  const validateField = (name: string, value: string) => {
    try {
      if (name === 'email') {
        orderTrackingSchema.pick({ email: true }).parse({ email: value })
        setValidationErrors((prev) => ({ ...prev, email: undefined }))
      } else if (name === 'orderNumber') {
        orderTrackingSchema.pick({ orderNumber: true }).parse({ orderNumber: value })
        setValidationErrors((prev) => ({ ...prev, orderNumber: undefined }))
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues[0]?.message
        setValidationErrors((prev) => ({ ...prev, [name]: fieldError }))
      }
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setValidationErrors({})

    try {
      const validatedData = orderTrackingSchema.parse({ email, orderNumber })
      await handleSearch(validatedData.email, validatedData.orderNumber)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { email?: string; orderNumber?: string } = {}
        err.issues.forEach((error) => {
          if (error.path[0] === 'email') {
            errors.email = error.message
          } else if (error.path[0] === 'orderNumber') {
            errors.orderNumber = error.message
          }
        })
        setValidationErrors(errors)
      }
    }
  }

  return (
    <form
      className='max-w-md mx-auto bg-white rounded-lg py-6 lg:px-6 space-y-6 mb-8'
      autoComplete='on'
      noValidate
      onSubmit={onSubmit}
    >
      <div className='text-center mb-4'>
        <h1 className={cn('mt-8 text-2xl tracking-tight', montserrat.className)}>
          Theo dõi đơn hàng
        </h1>
        <p className='mt-4 text-sm text-gray-600 text-pretty mx-4'>
          Vui lòng nhập địa chỉ email và mã đơn hàng để tra cứu thông tin đơn hàng của bạn.
        </p>
      </div>
      <div>
        <label htmlFor='email' className='block font-medium mb-1'>
          <span className='text-red-500'>*</span> Email
        </label>
        <Input
          id='email'
          type='email'
          name='email'
          autoComplete='email'
          className={`w-full border px-3 py-2 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
          aria-required='true'
          aria-invalid={!!validationErrors.email}
          disabled={loading}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            validateField('email', e.target.value)
          }}
          onBlur={(e) => validateField('email', e.target.value)}
        />
        {validationErrors.email && (
          <span
            className='text-red-500 text-xs mt-1 data-error:block hidden'
            data-error={validationErrors.email ? '' : undefined}
          >
            {validationErrors.email}
          </span>
        )}
      </div>
      <div>
        <label htmlFor='orderNumber' className='font-medium mb-1 flex items-center gap-2'>
          <span>
            <span className='text-red-500'>*</span> Mã đơn hàng
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} role='button' aria-label='Thông tin về mã đơn hàng'>
                <QuestionMarkCircledIcon className='size-5 hover:text-gray-700 transition-colors' />
              </span>
            </TooltipTrigger>
            <TooltipContent
              side='right'
              className='max-w-[200px] text-pretty'
              style={
                {
                  '--foreground': 'var(--color-gray-950)',
                  '--background': 'white',
                } as React.CSSProperties
              }
            >
              Nằm trong email xác nhận đơn hàng của bạn.
            </TooltipContent>
          </Tooltip>
        </label>
        <Input
          id='orderNumber'
          type='text'
          name='orderNumber'
          className={`w-full border px-3 py-2 ${validationErrors.orderNumber ? 'border-red-500' : 'border-gray-300'}`}
          aria-required='true'
          aria-invalid={!!validationErrors.orderNumber}
          disabled={loading}
          placeholder='ORD-20251007-FA575318'
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value)
            validateField('orderNumber', e.target.value)
          }}
          onBlur={(e) => validateField('orderNumber', e.target.value)}
          style={
            {
              '--muted-foreground': 'var(--color-gray-500)',
            } as React.CSSProperties
          }
        />
        {validationErrors.orderNumber && (
          <span
            className='text-red-500 text-xs mt-1 data-error:block hidden'
            data-error={validationErrors.orderNumber ? '' : undefined}
          >
            {validationErrors.orderNumber}
          </span>
        )}
      </div>
      <Button
        type='submit'
        className='w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition'
        disabled={loading}
      >
        {loading ? 'Đang tra cứu...' : 'Tra cứu đơn hàng'}
      </Button>
      <div className='text-center text-sm text-gray-500 mt-2'>
        <span>Không nhớ mã đơn hàng?</span> <br />
        <span>
          <Link href='/dang-nhap' className='font-bold text-black underline'>
            Đăng nhập
          </Link>{' '}
          để xem lịch sử đơn hàng
        </span>
      </div>
    </form>
  )
}
