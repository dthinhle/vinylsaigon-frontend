'use client'

import { CreateOrderResponse } from '@/app/api/order'
import { Cart } from '@/app/cart/types/cart.types'
import { useToast } from '@/app/cart/ui/toast'
import { CheckoutStep, IOrderForm } from '@/app/hooks/use-checkout'
import { Toaster } from '@/components/ui/sonner'
import { IAddress, PaymentMethodType } from '@/lib/types/order'

import OrderSuccess from '../order-success'
import OrderPayment from './order-payment'
import OrderShipping from './order-shipping/order-shipping'
import { Welcome } from './welcome'

type Props = {
  orderForm: IOrderForm
  cart: Cart | null
  setEmail: (email: string) => void
  updateOrderForm: (updates: Partial<IOrderForm>) => void
  updateOrderShipping: (
    shipping_method: string,
    phone_number: string,
    name?: string,
    shipping_address?: IAddress,
    store_address_id?: string | number,
  ) => void
  createOrder: () => Promise<any>
  isCreatingOrder: boolean
  orderError: string | null
  clearOrderError: () => void
  createdOrder: CreateOrderResponse['order'] | null
}

const OrderForm: React.FC<Props> = ({
  orderForm,
  cart,
  setEmail,
  updateOrderForm,
  updateOrderShipping,
  createOrder,
  isCreatingOrder,
  clearOrderError,
  createdOrder,
}) => {
  const { email, name, phone_number, checkoutStep, authenticatedSession } = orderForm
  const { addToast } = useToast()

  const afterSubmittedEmail = () => {
    updateOrderForm({ checkoutStep: CheckoutStep.Shipping })
  }

  const onCheckout = async () => {
    try {
      const { payment_method } = orderForm
      const response = await createOrder()
      if (response) {
        if (
          payment_method &&
          [PaymentMethodType.ONEPAY, PaymentMethodType.INSTALLMENT].includes(payment_method) &&
          response.onepayPaymentUrl
        ) {
          window.location.href = response.onepayPaymentUrl
        } else {
          addToast({
            type: 'success',
            title: 'Cảm ơn bạn đã mua hàng',
            message:
              'Đơn hàng của bạn đã tạo thành công.\nChúng tôi sẽ liên hệ với bạn thông qua email hoặc số điện thoại của bạn!',
            duration: 3000,
          })
          updateOrderForm({ checkoutStep: CheckoutStep.Success })
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  const subtotal = cart
    ? cart.items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0)
    : 0

  return (
    <div className='w-full lg:max-w-[66%]'>
      <Toaster position='top-center' richColors theme='light' className='[&_li]:mt-6' />
      {createdOrder && checkoutStep === CheckoutStep.Success ? (
        <OrderSuccess order={createdOrder} orderForm={orderForm} />
      ) : (
        <>
          <h2 className='text-xl lg:text-3xl mb-4'>THANH TOÁN</h2>
          <Welcome
            email={email}
            authenticatedSession={authenticatedSession}
            setEmail={setEmail}
            updateOrderForm={updateOrderForm}
            onContinue={afterSubmittedEmail}
          />
          <OrderShipping
            defaultName={name}
            defaultPhoneNumber={phone_number}
            checkoutStep={checkoutStep}
            updateOrderForm={updateOrderForm}
            updateOrderShipping={updateOrderShipping}
          />
          <OrderPayment
            orderForm={orderForm}
            checkoutStep={checkoutStep}
            updateOrderForm={updateOrderForm}
            onCheckout={onCheckout}
            isCreatingOrder={isCreatingOrder}
            clearOrderError={clearOrderError}
            subtotal={subtotal}
          />
        </>
      )}
    </div>
  )
}

export default OrderForm
