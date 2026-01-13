import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderError,
  createOrder as createOrderApi,
} from '@/app/api/order'
import { useToast } from '@/app/cart/ui/toast'
import { useAuthStore } from '@/app/store/auth-store'
import { useCartStore } from '@/app/store/cart-store'
import { IAddress, PaymentMethodType } from '@/lib/types/order'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

import { Cart } from '../cart/types/cart.types'

export interface IOrderForm {
  email: string
  name: string
  phone_number: string
  authenticatedSession: boolean
  checkoutStep: CheckoutStep
  shipping_method: string
  store_address_id: number | string | null
  shipping_address: IAddress | null
  payment_method?: PaymentMethodType
}

export enum CheckoutStep {
  Welcome = 0,
  Shipping = 1,
  Payment = 2,
  Success = 3,
}

export interface UseCheckoutReturn {
  cart: Cart | null
  orderForm: IOrderForm
  setOrderForm: (form: IOrderForm) => void
  updateOrderForm: (updates: Partial<IOrderForm>) => void
  setEmail: (email: string) => void
  updateOrderShipping: (
    shipping_method: string,
    phone_number: string,
    name?: string,
    shipping_address?: IAddress,
    store_address_id?: number | string,
  ) => void
  resetOrderForm: () => void
  // Order creation
  createOrder: () => Promise<CreateOrderResponse | null>
  isCreatingOrder: boolean
  orderError: string | null
  createdOrder: CreateOrderResponse['order'] | null
  clearOrderError: () => void
  boughtCart: Cart | null
}

const initialOrderForm: IOrderForm = {
  email: '',
  checkoutStep: 0,
  name: '',
  phone_number: '',
  shipping_method: 'ship_to_address',
  store_address_id: null,
  authenticatedSession: false,
  shipping_address: null,
  payment_method: undefined,
}

export function useCheckout(): UseCheckoutReturn {
  const cart = useCartStore((state) => state.cart)
  const user = useAuthStore((state) => state.user)
  const { addToast } = useToast()
  const clearCart = useCartStore((state) => state.clearCart)

  const [orderForm, setOrderForm] = useState<IOrderForm>(initialOrderForm)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [createdOrder, setCreatedOrder] = useState<CreateOrderResponse['order'] | null>(null)
  const [boughtCart, setBoughtCart] = useState<Cart | null>(cart)

  useEffect(() => {
    if (!isEmpty(cart)) {
      setBoughtCart(cart)
    }
  }, [cart])

  const setEmail = useCallback((email: string) => {
    updateOrderForm({ email })
  }, [])

  const setAuthenticatedSession = useCallback((authenticatedSession: boolean) => {
    updateOrderForm({ authenticatedSession, checkoutStep: 1 })
  }, [])

  const setUserInfo = useCallback((email: string, name: string, phone_number?: string) => {
    updateOrderForm({ email, name, phone_number })
  }, [])

  const updateOrderShipping = (
    shipping_method: string,
    phone_number: string,
    name?: string,
    shipping_address?: IAddress,
    store_address_id?: number | string,
  ) => {
    let paramsUpdate: Partial<IOrderForm> = { shipping_method, phone_number }

    if (shipping_address) paramsUpdate.shipping_address = shipping_address
    if (store_address_id) paramsUpdate.store_address_id = store_address_id
    if (name) paramsUpdate.name = name

    updateOrderForm({ ...paramsUpdate, checkoutStep: CheckoutStep.Payment })
  }

  useEffect(() => {
    if (orderError) {
      addToast({
        type: 'error',
        title: '',
        message: orderError,
      })
    }
  }, [orderError, addToast])

  const createOrder = async (): Promise<CreateOrderResponse | null> => {
    setIsCreatingOrder(true)
    setOrderError(null)
    let errorMessage = ''

    try {
      if (
        (orderForm.shipping_method === 'ship_to_address' &&
          (!orderForm.email || !orderForm.name)) ||
        !orderForm.phone_number
      ) {
        errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc'
      }

      if (!orderForm.payment_method) {
        errorMessage = 'Vui lòng chọn phương thức thanh toán'
      }

      if (orderForm.shipping_method === 'ship_to_address' && !orderForm.shipping_address) {
        errorMessage = 'Vui lòng điền địa chỉ giao hàng'
      }

      if (orderForm.shipping_method === 'pick_up_at_store' && !orderForm.store_address_id) {
        errorMessage = 'Vui lòng chọn cửa hàng để nhận hàng'
      }

      if (!cart?.id) {
        errorMessage = 'Giỏ hàng không tồn tại. Vui lòng thêm sản phẩm vào giỏ hàng.'
      }

      if (errorMessage) {
        addToast({
          type: 'error',
          title: '',
          message: errorMessage,
        })
        return null
      }

      const requestData: CreateOrderRequest = {
        cart_id: cart?.id,
        name: orderForm.name,
        email: orderForm.email,
        phone_number: orderForm.phone_number,
        shipping_method: orderForm.shipping_method as 'ship_to_address' | 'pick_up_at_store',
        payment_method: orderForm.payment_method,
        currency: 'VND',
        installment_intent: orderForm.payment_method === PaymentMethodType.INSTALLMENT,
        apply_promotions: true,
      }

      if (orderForm.shipping_method === 'ship_to_address' && orderForm.shipping_address) {
        requestData.shipping_address = {
          name: orderForm.name,
          phone_number: orderForm.phone_number,
          address: orderForm.shipping_address.address,
          city: orderForm.shipping_address.city,
          ward: orderForm.shipping_address.ward,
          country: 'VN',
        }
      }

      if (orderForm.shipping_method === 'pick_up_at_store' && orderForm.store_address_id) {
        requestData.store_address_id = orderForm.store_address_id
      }

      const response = await createOrderApi(requestData)
      setCreatedOrder(response.order)
      clearCart()
      return response
    } catch (err: any) {
      console.error('Error creating order:', err)

      if (err.response?.data) {
        const errorData = err.response.data as OrderError

        switch (err.response.status) {
          case 409:
            setOrderError(`Đơn hàng đã được tạo: ${errorData.message}`)
            break
          case 422:
            setOrderError(errorData.details ? errorData.details.join(', ') : errorData.message)
            break
          case 404:
            setOrderError('Giỏ hàng không tồn tại. Vui lòng thêm sản phẩm vào giỏ hàng.')
            break
          default:
            setOrderError(errorData.message || 'Có lỗi xảy ra khi tạo đơn hàng')
        }
      } else if (err.message) {
        setOrderError(err.message)
      } else {
        setOrderError('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.')
      }
      return null
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const clearOrderError = () => {
    setOrderError(null)
  }

  useEffect(() => {
    if (user && user.email) {
      setUserInfo(user.email, user.name, user.phoneNumber)
      setAuthenticatedSession(true)
    }
  }, [setAuthenticatedSession, user, setUserInfo])

  const updateOrderForm = (updates: Partial<IOrderForm>) => {
    setOrderForm((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const resetOrderForm = () => {
    setOrderForm(initialOrderForm)
    setCreatedOrder(null)
    setOrderError(null)
  }

  return {
    cart,
    orderForm,
    setOrderForm,
    updateOrderForm,
    setEmail,
    updateOrderShipping,
    resetOrderForm,
    createOrder,
    isCreatingOrder,
    orderError,
    createdOrder,
    clearOrderError,
    boughtCart,
  }
}
