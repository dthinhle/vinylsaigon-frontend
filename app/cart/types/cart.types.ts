// Cart Types for CartPage (API-compliant)

// Session Management Types
export interface SessionInfo {
  sessionId: string
  expiresAt: string
  createdAt: string
}

export interface SessionValidationResponse {
  valid: boolean
  expiresAt?: string
  lastActivityAt?: string
}

export interface CartSessionResponse {
  cart: Cart
  expiresAt: string
}

// API Error Types
export interface ApiError {
  error: string
  message?: string
  details?: string | Record<string, any>
  code?: string
  timestamp?: string
  requestId?: string
}

// Cart Status and Types
export type CartStatus = 'active' | 'expired' | 'checked_out' | 'emailed' | 'abandoned'
export type CartType = 'authenticated' | 'anonymous'
export type RecipientType = 'authenticated' | 'anonymous'

// Promotion Types
export interface BundleItem {
  productId: number
  productVariantId?: number | null
  quantity: number
  productName: string
  variantName?: string | null
}

export interface Promotion {
  id: number
  title: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed_amount' | 'bundle'
  discountValue: string
  maxDiscountAmountVnd: number | undefined
  stackable: boolean | undefined
  bundleItems: BundleItem[] | undefined
  appliedAt: string | undefined
}

// Main Cart Interface
export interface Cart {
  id: string
  sessionId: string
  userId?: string | null
  guestEmail?: string | null
  status: CartStatus
  cartType: CartType
  expiresAt: string
  lastActivityAt: string
  createdAt: string
  updatedAt: string
  metadata: Record<string, any>
  items: CartItem[]
  totalItems: number
  subtotal: string
  currency: string
  priceValidUntil?: string
  freeShipping: boolean
  promotions: Promotion[]
  discountTotal: string
  bundleDiscount?: number
  total: string
  installmentFlags: {
    freeItemsCount: number
    fullyFreeInstallment: boolean
    hasFreeInstallment: boolean
    totalItemsCount: number
  }
}

// Email Cart Types
export interface EmailCartRequest {
  email: string
  createAccountPrompt?: boolean
}

export interface EmailCartResponse {
  id: string
  cartId: string
  email: string
  sentAt: string
  accessToken: string
  expiresAt: string
  recipientType: RecipientType
  accessedAt?: string | null
  message?: string
  emailSent?: boolean
  cartSummary?: {
    totalItems: number
    subtotal: string
    currency: string
    validUntil: string
  }
}

export interface EmailedCart {
  id: string
  cartId: string
  accessToken: string
  email: string
  sentAt: string
  expiresAt: string
  accessedAt?: string | null
  recipientType: RecipientType
  cart: Cart & {
    pricesValid?: boolean
    priceValidUntil?: string
  }
  actions: {
    canCheckout: boolean
    canCreateSession: boolean
    canModify: boolean
  }
}

export interface ProductVariant {
  id: number
  name: string
  sku: string
  [key: string]: string | number | undefined
}

// Cart Item Interface (API Response Format)
export interface CartItem {
  id: string
  cartId: string
  productId: number
  productVariantId?: number | null
  quantity: number
  variant: ProductVariant // Product variant details

  // Price information (frozen at time of adding)
  currentPrice: number // Decimal string from API
  originalPrice: number // Decimal string from API
  currency: string

  // Product information snapshot
  productName: string
  productImageUrl?: string | null

  // Timestamps
  createdAt: string
  updatedAt: string
  addedAt: string
  expiresAt: string

  // Computed fields from API
  lineTotal: string // Decimal string (quantity * currentPrice)
  priceLocked?: boolean
  priceLockExpiresAt?: string

  // UI/Display fields (for backward compatibility)
  name?: string // Alias for productName
  price?: number // Parsed from currentPrice
  image?: string // Alias for productImageUrl
  inStock?: boolean // Computed or default
  maxQuantity?: number // Default or from product data
  priceExpired?: boolean // Computed from expiresAt
  freeInstallmentFee: boolean
}

// Legacy UI Types (for backward compatibility)
export interface OrderSummary {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}

export interface PromoCodeState {
  code: string
  isApplied: boolean
  discountAmount: number
  error?: string
  isLoading?: boolean
  success?: boolean
}

export interface ShippingInfo {
  address?: string
  city?: string
  postalCode?: string
  country?: string
  shippingMethod?: string
  shippingCost: number
  estimatedDelivery?: string
  freeShippingThreshold?: number
}

export interface PaymentMethod {
  id: string
  type: string // e.g. 'credit_card', 'paypal', 'apple_pay', etc.
  label: string
  icon?: string
  selected?: boolean
}

export interface PaymentState {
  availableMethods: PaymentMethod[]
  selectedMethod?: PaymentMethod
  isProcessing: boolean
  error?: string
}

export interface CartError {
  code: string
  message: string
  field?: string
}

// Legacy Cart State (for existing UI components)
export interface CartState {
  items: CartItem[]
  summary: OrderSummary
  promoCode: PromoCodeState
  ui: {
    isLoading: boolean
    errors: CartError[]
    summaryExpanded: boolean
  }
  shipping: ShippingInfo
  payment: PaymentState
}

export interface PromoCode {
  code: string
  discount: number
  isValid: boolean
  error?: string
}

// API Request/Response Types
export interface AddItemRequest {
  productId: number
  productVariantId?: number
  quantity: number
}

export interface UpdateItemRequest {
  itemId: number
  quantity: number
}

export interface RemoveItemRequest {
  itemId: number
}

export interface CartItemResponse {
  cartItem: CartItem
  cart: {
    id: string
    totalItems: number
    subtotal: string
  }
}

export interface MergeCartRequest {
  sharedCartId: string
}

export interface MergeCartResponse {
  cart: Cart
  mergedItems: number
  message?: string
}

// Utility Types
export interface CartSummary {
  totalItems: number
  subtotal: string
  currency: string
  validUntil?: string
}

export interface CartActions {
  canCheckout: boolean
  canCreateSession: boolean
  canModify: boolean
}
