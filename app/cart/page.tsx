'use client'

import CartItem from '@/app/cart/components/cart-items/cart-item'
import CartItemMobile from '@/app/cart/components/cart-items/cart-item-mobile'
import { CheckoutButton } from '@/app/cart/components/checkout-actions/checkout-button'
import { EmailCartButton } from '@/app/cart/components/checkout-actions/email-cart-button'
import { OrderSummary } from '@/app/cart/components/order-summary/order-summary'
import { RelatedProductRow } from '@/app/cart/components/recommend-product/recommend-product'
import { CartItem as CartItemType } from '@/app/cart/types/cart.types'
import { useCartStore } from '@/app/store/cart-store'
import { Toaster } from '@/components/ui/sonner'
import { ISimpleProduct } from '@/lib/types/product'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { Suspense } from 'react'

import { CartApiError, cartApi, ensureSession } from './services/cart-api'
import { useToast } from './ui/toast'

const CartPage = () => {
  return (
    <>
      <Toaster position='top-center' richColors theme='light' className='[&_li]:mt-6' />
      <Suspense fallback={null}>
        <SharedCartHandler />
      </Suspense>
      <main aria-label='Cart Page' className='min-h-screen mt-[76px]'>
        <div className='mx-auto py-8 max-w-[calc(min(var(--breakpoint-2xl),100vw)-4rem)]'>
          <CartItemsSection />
        </div>
      </main>
    </>
  )
}

const SharedCartHandler = () => {
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const cart = useCartStore((state) => state.cart)
  const mergeSharedCart = useCartStore((state) => state.mergeSharedCart)
  const initializeCart = useCartStore((state) => state.initializeCart)
  const [hasProcessed, setHasProcessed] = React.useState(false)

  React.useEffect(() => {
    const accessToken = searchParams.get('access_token')

    if (!accessToken || hasProcessed || !cart) {
      return
    }

    const handleSharedCart = async () => {
      try {
        setHasProcessed(true)

        // Ensure we have a session
        await ensureSession()

        // Merge the shared cart using access token
        await mergeSharedCart(accessToken)
        await initializeCart()

        // Show success toast
        addToast({
          type: 'success',
          title: 'Thành công!',
          message: 'Sản phẩm đã được thêm vào giỏ hàng của bạn.',
          duration: 3000,
        })

        // Remove the query parameter from URL without page reload
        const url = new URL(window.location.href)
        url.searchParams.delete('access_token')
        window.history.replaceState({}, '', url.toString())
      } catch (err) {
        console.error('Error handling shared cart:', err)

        let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

        if (err instanceof CartApiError) {
          if (err.statusCode === 404) {
            errorMessage = 'Giỏ hàng không tồn tại hoặc đã hết hạn.'
          } else if (err.statusCode === 422) {
            errorMessage = 'Liên kết giỏ hàng đã hết hạn.'
          } else if (err.message.toLowerCase().includes('expired')) {
            errorMessage = 'Liên kết giỏ hàng đã hết hạn (7 ngày).'
          } else {
            errorMessage = err.message || 'Không thể tải giỏ hàng.'
          }
        }

        addToast({
          type: 'error',
          title: 'Không thể tải giỏ hàng',
          message: errorMessage,
          duration: 5000,
        })
      }
    }

    handleSharedCart()
  }, [cart, initializeCart, searchParams, hasProcessed, addToast, mergeSharedCart])

  return null
}

const CartItemsSection = () => {
  const cart = useCartStore((state) => state.cart)
  const cartItems = useCartStore((state) => state.cartItems)
  const isLoading = useCartStore((state) => state.loading)
  const [relatedProducts, setRelatedProducts] = React.useState<ISimpleProduct[]>([])

  const totalQuantity = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  React.useEffect(() => {
    // Fetch related products based on cart items
    const fetchRelatedProducts = async () => {
      if (!cart) return
      if (cartItems.length === 0) {
        setRelatedProducts([])
        return
      }

      const response = await cartApi.getRelatedProducts()
      setRelatedProducts(response?.relatedProducts || [])
    }
    fetchRelatedProducts()
  }, [cart, cartItems])

  // if (loading) {
  //   return (
  //     <div className='flex items-center justify-center min-h-64'>
  //       <span className='text-gray-500 text-md'>Đang tải giỏ hàng...</span>
  //     </div>
  //   )
  // }
  const preservedItemsText =
    cartItems.length > 0
      ? 'Các sản phẩm trong giỏ hàng của bạn chưa được giữ chỗ. Hãy hoàn tất thanh toán để đảm bảo sở hữu sản phẩm.'
      : ''

  return (
    <>
      <div
        className={cn( 'md:block hidden text-gray-950 mb-4')}
        role='note'
        tabIndex={-1}
      >
        {preservedItemsText}
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 tracking-tight'>
        <section aria-label='Tóm tắt đơn hàng' className='md:col-span-1 order-1 md:order-2'>
          <OrderSummary />
          <div
            className={cn( 'block md:hidden text-gray-950 mt-4')}
            role='note'
            tabIndex={-1}
          >
            {preservedItemsText}
          </div>
          <div className='block md:hidden'>
            <section
              aria-label='Checkout Actions'
              className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20'
            >
              <CheckoutButton />
            </section>
          </div>
          <div className='hidden md:block mt-8'>
            <section aria-label='Checkout Actions' className='flex gap-4'></section>
          </div>
        </section>
        <section
          aria-label='Sản phẩm trong giỏ hàng'
          className={cn( 'md:col-span-2 space-y-4 order-2 md:order-1')}
        >
          <div className='md:hidden mb-2'>
            <div className='pr-4 py-3 font-bold text-lg flex items-center gap-2'>
              Giỏ hàng của tôi ({totalQuantity})
              {isLoading && <div className='animate-spin inline-flex mr-2 align-baseline rounded-full size-4 border-2 border-gray-300 border-t-gray-500'></div>}
            </div>
            <hr className='mb-8 border-gray-200' />
          </div>
          <div
            className="hidden md:grid w-full items-center gap-2 py-4 border-b border-gray-200 md:[grid-template-areas:'image_item_quantity_price_remove'] md:grid-rows-1 md:gap-4 grid-cols-[3.75rem_1.2fr_1fr_1fr_3rem] [&>div]:px-2"
            role='row'
          >
            <div className='font-bold col-span-2 flex items-center gap-2' role='columnheader'>
              Giỏ hàng của tôi ({totalQuantity})
              {isLoading && <div className='animate-spin inline-flex mr-2 align-baseline rounded-full size-4 border-2 border-gray-300 border-t-gray-500'></div>}
            </div>
            <div className='font-bold text-left'>Số lượng</div>
            <div className='font-bold text-left'>Giá</div>
            <div className='font-bold text-left'></div>
          </div>
          {cartItems && cartItems.length > 0 ? (
            <>
              <div role='list' className='space-y-4 block md:hidden'>
                {cartItems.map((item: CartItemType, idx: number) => (
                  <CartItemMobile key={item.id || idx} item={item} />
                ))}
              </div>
              <div role='list' className='space-y-4 hidden md:block border-b border-gray-200'>
                {cartItems.map((item: CartItemType, idx: number) => (
                  <CartItem key={item.id || idx} item={item} />
                ))}
              </div>
              <EmailCartButton />
            </>
          ) : (
            <div className='text-gray-500 text-md'>Giỏ hàng của bạn đang trống.</div>
          )}
        </section>
      </div>

      {relatedProducts.length > 0 && (
        <section aria-label='Bạn có thể thích' className='text-center mt-8 xl:mx-0 -mx-8'>
          <h2 className='text-xl font-semibold mb-4'>Bạn có thể thích</h2>
          <RelatedProductRow products={relatedProducts} />
        </section>
      )}
    </>
  )
}

export default CartPage
