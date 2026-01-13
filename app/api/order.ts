import { apiClient } from '@/lib/axios'
import { PaymentMethodType } from '@/lib/types/order'

export interface CreateOrderRequest {
  cart_id?: string
  name: string
  email: string
  phone_number: string
  shipping_method: 'ship_to_address' | 'pick_up_at_store'
  payment_method: PaymentMethodType | undefined
  shipping_address?: {
    name?: string
    phone_number?: string
    address: string
    city: string
    ward: string
    district?: string
    postal_code?: string
    country?: string
  }
  store_address_id?: string | number
  currency?: string
  apply_promotions?: boolean
  installment_intent: boolean
}

export interface CreateOrderResponse {
  order: {
    id: string
    orderNumber: string
    totalVnd: number
    status: string
    shippingMethod: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
  }
  onepay_payment_url?: string
}

export interface OrderError {
  error: string
  message: string
  details?: string[]
  order?: {
    id: string
    order_number: string
  }
}

export const searchOrder = async (email: string, orderNumber: string) => {
  const params = {
    email: email,
    order_number: orderNumber,
  }
  return await apiClient.get('/orders/search_by_number', { params: params })
}

export const createOrder = async (data: CreateOrderRequest) => {
  const response = await apiClient.post('/checkout', data)
  return response.data
}
