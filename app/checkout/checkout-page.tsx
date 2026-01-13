'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useCheckout } from '../hooks/use-checkout'
import OrderForm from './order-form/order-form'
import OrderNote from './order-note'
import OrderSummary from './order-summary'
import LoadingSpinner from '../components/blog/loading-spinner'

/* eslint-disable react-hooks/exhaustive-deps */

const CheckoutPage: React.FC = () => {
  const {
    cart,
    orderForm,
    setEmail,
    updateOrderForm,
    updateOrderShipping,
    createOrder,
    isCreatingOrder,
    orderError,
    clearOrderError,
    createdOrder,
    boughtCart,
  } = useCheckout()

  const [showEmptyCartModal, setShowEmptyCartModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const handleGoToCart = () => {
    router.push('/cart')
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

  useEffect(() => {
    if (!loading && isEmpty(cart?.items)) {
      setShowEmptyCartModal(true)
    }
  }, [loading])

  useEffect(() => {
    let timer = null
    if (loading && cart?.id) {
      timer = setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [cart?.id])

  return (
    <div className='max-w-screen-xl mx-[2%] xl:mx-auto flex flex-col-reverse lg:flex-row gap-6 pt-[3rem]'>
      <OrderNote className='block lg:hidden mt-0' />
      <OrderForm
        orderForm={orderForm}
        cart={cart}
        setEmail={setEmail}
        updateOrderForm={updateOrderForm}
        updateOrderShipping={updateOrderShipping}
        createOrder={createOrder}
        isCreatingOrder={isCreatingOrder}
        orderError={orderError}
        createdOrder={createdOrder}
        clearOrderError={clearOrderError}
      />
      <OrderSummary cart={cart || boughtCart} />

      <Dialog open={loading || showEmptyCartModal} onOpenChange={() => {}}>
        <DialogOverlay className='bg-black/50' />
        <DialogContent className='max-w-md mx-auto bg-white rounded-lg p-0 overflow-hidden'>
          <div className='relative'>
            { loading &&
              <LoadingSpinner />
            }
            { !loading && showEmptyCartModal &&
              <>
                <div className='p-8 text-center'>
                  <h2 className='text-xl font-bold text-gray-900 mb-6'>
                    Giỏ hàng của bạn hiện đang trống
                  </h2>
                  <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6'>
                    <p className='text-sm text-orange-800'>
                      Chúng tôi xin lỗi vì sự bất tiện này. Các sản phẩm trong giỏ hàng của bạn không
                      còn có sẵn hoặc đã hết hàng. Vui lòng kiểm tra lại giỏ hàng và tiếp tục mua sắm.
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <Button
                      onClick={handleGoToCart}
                      className='w-full bg-black text-white hover:bg-gray-900 py-3 rounded-sm'
                    >
                      Đi tới giỏ hàng
                    </Button>

                    <Button
                      onClick={handleContinueShopping}
                      variant='outline'
                      className='w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-sm'
                    >
                      Tiếp tục mua sắm
                    </Button>
                  </div>
                </div>
              </>
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CheckoutPage
