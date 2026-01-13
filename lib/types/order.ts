import { Cart } from '@/app/cart/types/cart.types'

export interface IOrderItem {
  id: string
  productId: number
  variantName: string | null
  productVariantId?: number
  productName: string
  productImageUrl?: string
  quantity: number
  unitPriceVnd: number
  originalUnitPriceVnd: number
  subtotalVnd: number
  currency: string
}

export interface IAddress {
  id?: number
  address: string
  city: string
  district?: string
  ward: string
  phoneNumbers?: string[]
  mapUrl?: string | null
}

export interface IOrder {
  id: string
  orderNumber: string
  status: string
  currency: string
  createdAt: string
  updatedAt: string
  email: string
  phoneNumber: string
  name: string
  subtotalVnd: number
  shippingVnd: number
  taxVnd: number
  discountVnd: number
  totalVnd: number
  items: IOrderItem[]
  shippingMethod: string
  paymentMethod: string
  cart: Cart
  storeAddressId?: string

  shippingAddress?: IAddress
  billingAddress?: IAddress
}

export interface IOrderResponse {
  order: IOrder
}

export interface IOrdersResponse {
  orders: IOrder[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    perPage: number
  }
}

export enum OrderStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  CANCELED = 'canceled',
  CONFIRMED = 'confirmed',
  FULFILLED = 'fulfilled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus)
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.AWAITING_PAYMENT]: 'Chờ thanh toán',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.CANCELED]: 'Đã hủy',
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.FULFILLED]: 'Đã hoàn thành',
  [OrderStatus.REFUNDED]: 'Đã hoàn tiền',
  [OrderStatus.FAILED]: 'Thất bại',
  [OrderStatus.PENDING]: 'Chờ xử lý',
  [OrderStatus.PROCESSING]: 'Đang xử lý',
  [OrderStatus.SHIPPED]: 'Đã gửi hàng',
  [OrderStatus.DELIVERED]: 'Đã giao hàng',
  [OrderStatus.CANCELLED]: 'Đã hủy',
}

export enum PaymentMethodType {
  COD = 'cod',
  ONEPAY = 'onepay',
  BANK_TRANSFER = 'bank_transfer',
  INSTALLMENT = 'installment',
}
