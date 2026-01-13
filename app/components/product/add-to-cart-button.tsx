'use client'

import { AddItemRequest } from '@/app/cart/types/cart.types'
import { useToast } from '@/app/cart/ui/toast'
import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IProduct, TProductStockStatus } from '@/lib/types/product'
import { IProductVariant } from '@/lib/types/variant'
import { STATUS_MESSAGES } from '@/lib/utils/product'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import CartSidebar from '../cart-sidebar/cart-sidebar'

type CartButtonProps = {
  product: IProduct
  selectedVariant: IProductVariant
  stockStatus: TProductStockStatus
}

const ERROR_MESSAGES: Omit<Record<TProductStockStatus, string>, 'DEFAULT'> = {
  INACTIVE_PRODUCT: 'Sản phẩm hiện không khả dụng để thêm vào giỏ hàng.',
  ARRIVE_SOON: 'Sản phẩm sắp có hàng. Vui lòng kiểm tra lại sau.',
  DISCONTINUED_PRODUCT: 'Sản phẩm đã ngừng kinh doanh và không thể thêm vào giỏ hàng.',
  OUT_OF_STOCK: 'Sản phẩm tạm hết hàng. Vui lòng kiểm tra lại sau.',
}

const TooltipWrapper = React.memo(
  ({ children, stockStatus }: React.PropsWithChildren & { stockStatus: TProductStockStatus }) => {
    if (!(stockStatus in ERROR_MESSAGES)) {
      return <>{children}</>
    }

    return (
      <>
        {children}
        <Tooltip>
          <TooltipTrigger asChild>
            <QuestionMarkCircledIcon className='w-5 h-5 inline cursor-help text-gray-500' />
          </TooltipTrigger>
          <TooltipContent
            className='text-pretty'
            style={
              {
                '--foreground': 'var(--color-gray-950)',
                '--background': 'white',
              } as React.CSSProperties
            }
          >
            <p>{ERROR_MESSAGES[stockStatus as keyof typeof ERROR_MESSAGES]}</p>
          </TooltipContent>
        </Tooltip>
      </>
    )
  },
)

TooltipWrapper.displayName = 'TooltipWrapper'

const AddToCartButton: React.FC<CartButtonProps> = ({ product, selectedVariant, stockStatus }) => {
  const [openCart, setOpenCart] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { addToast } = useToast()
  const price = selectedVariant.currentPrice || selectedVariant.originalPrice

  const handleAddToCart = async () => {
    if (stockStatus in ERROR_MESSAGES) {
      addToast({
        type: 'error',
        title: 'Không thể thêm vào giỏ hàng',
        message: ERROR_MESSAGES[stockStatus as keyof typeof ERROR_MESSAGES],
        duration: 3000,
      })
      return
    }
    try {
      const request: AddItemRequest = {
        productId: product.id,
        productVariantId: selectedVariant.id,
        quantity: 1,
      }

      setIsLoading(true)
      await addItem(request)
      setOpenCart(true)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!price) return null

  return (
    <>
      <div className='border-b border-gray-300'></div>
      <div className='flex flex-row w-full gap-2 items-center'>
        <TooltipWrapper stockStatus={stockStatus}>
          <Button
            size='xl'
            className='bg-black text-white hover:bg-gray-800 font-semibold cursor-pointer text-base hover:text-lg transition-all grow'
            onClick={() => handleAddToCart()}
            disabled={isLoading || stockStatus in ERROR_MESSAGES}
          >
            {
              isLoading ?
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-500'></div>
                Đang thêm vào giỏ hàng...
              </> :
              STATUS_MESSAGES[stockStatus]
            }
          </Button>
        </TooltipWrapper>
      </div>
      {openCart && <CartSidebar open={openCart} onOpenChange={() => setOpenCart(false)} />}
    </>
  )
}

export default AddToCartButton
