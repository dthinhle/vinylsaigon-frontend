'use client'

import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { CheckIcon, Cross2Icon, LockClosedIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export const CheckoutButton: React.FC = () => {
  const cartItems = useCartStore((state) => state.cartItems)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    // TODO: Simulate checkout process
    setTimeout(() => {
      if (cartItems.length) {
        router.push('/thanh-toan')
      } else {
        setError('Cart is empty.')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='mt- flex flex-col items-center w-full'>
      <Button
        type='button'
        className='h-12 w-full px-6 py-3 bg-amber-300 hover:bg-amber-500/70 active:bg-amber-600 font-semibold text-base transition-transform duration-150 active:scale-95 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer rounded'
        variant='default'
        onClick={handleCheckout}
        disabled={loading || !cartItems.length}
        aria-label='Continue to Checkout'
        aria-busy={loading}
      >
        {loading ? (
          <>
            <ReloadIcon
              className='animate-spin motion-reduce:animate-none size-5 mr-2 text-zinc-950'
              aria-hidden='true'
            />
            Đang xử lý...
          </>
        ) : (
          <>
            <span className='mx-auto'>Tiếp tục thanh toán</span>
            <span className='flex items-center'>
              <LockClosedIcon className='size-5 text-zinc-950' aria-hidden='true' />
            </span>
          </>
        )}
      </Button>
      {error && (
        <div
          className='text-xs text-red-600 mt-2 flex items-center'
          role='alert'
          aria-live='polite'
        >
          <Cross2Icon className='size-4 mr-1 flex-shrink-0 text-red-500' aria-hidden='true' />
          {error === 'Cart is empty.' ? 'Vui lòng thêm sản phẩm để tiếp tục.' : error}
        </div>
      )}
      {success && (
        <div
          className='text-xs text-green-600 mt-2 flex items-center'
          role='status'
          aria-live='polite'
        >
          <CheckIcon className='size-4 mr-1 flex-shrink-0 text-green-500' aria-hidden='true' />
          Đơn hàng đã được đặt! Bạn sẽ sớm nhận được email xác nhận.
        </div>
      )}
    </div>
  )
}
