import { CartApiError, cartApi, ensureSession } from '@/app/cart/services/cart-api'
import { Cart, CartError, CartItem, EmailCartResponse } from '@/app/cart/types/cart.types'
import { SessionManager } from '@/app/cart/utils/session-manager'
import { updateLocalCartTotalItems } from '@/app/hooks/use-local-cart'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Transform API CartItem to UI format for backward compatibility
const transformCartItemForUI = (apiItem: CartItem): CartItem => ({
  ...apiItem,
  name: apiItem.productName,
  image: apiItem.productImageUrl || '',
  // TODO: Replace with actual inventory check when API provides stock info
  inStock: true,
  maxQuantity: 99, // Default max quantity
  priceExpired: new Date(apiItem.expiresAt) < new Date(), // Check if price expired
})

interface CartSummary {
  subtotal: number
  freeShipping: boolean
  tax: number
  discount: number
  total: number
  currency: string
}

interface CartStore {
  // State
  cart: Cart | null
  loading: boolean
  errors: CartError[]
  cartItems: CartItem[]
  cartSummary: CartSummary
  emailLoading: boolean
  emailSuccess: boolean
  emailError: string | null

  // Actions
  initializeCart: (silent?: boolean) => Promise<void>
  addItem: (item: Partial<CartItem>) => Promise<Cart>
  addBundle: (promotionId: number) => Promise<Cart>
  updateItem: (itemId: string, quantity: number) => Promise<any>
  removeItem: (itemId: string) => Promise<void>
  emailCart: (email: string, createAccountPrompt?: boolean) => Promise<EmailCartResponse>
  resetEmailState: () => void
  mergeSharedCart: (accessToken: string) => Promise<Cart>
  applyPromotion: (promotionCodes: string[]) => Promise<Cart>
  clearCart: () => void

  // Internal helpers
  _setCart: (cart: Cart | null) => void
  _updateCartDerivedState: () => void
}

const calculateCartSummary = (cart: Cart | null): CartSummary => {
  if (!cart?.items || cart.items.length === 0) {
    return {
      subtotal: 0,
      freeShipping: false,
      tax: 0,
      discount: 0,
      total: 0,
      currency: 'VND',
    }
  }

  const subtotal = parseFloat(cart.subtotal) || 0
  const tax = 0
  const freeShipping = cart.freeShipping
  const discount = parseFloat(cart.discountTotal) || 0
  const total = parseFloat(cart.total) || subtotal - discount

  return {
    subtotal,
    freeShipping,
    tax,
    discount,
    total,
    currency: cart.currency || 'VND',
  }
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      cart: null,
      loading: true,
      errors: [],
      cartItems: [],
      cartSummary: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
        currency: 'VND',
      },
      emailLoading: false,
      emailSuccess: false,
      emailError: null,

      // Internal helper to set cart and update derived state
      _setCart: (cart) => {
        set({ cart })
        get()._updateCartDerivedState()
      },

      // Internal helper to update derived state (cartItems, cartSummary)
      _updateCartDerivedState: () => {
        const { cart } = get()

        // Update cart items
        const transformedItems = cart?.items ? cart.items.map(transformCartItemForUI) : []

        // Calculate total items for localStorage sync
        const totalItems = transformedItems.reduce((sum, item) => sum + item.quantity, 0)
        updateLocalCartTotalItems(totalItems)

        // Update cart summary
        const cartSummary = calculateCartSummary(cart)

        set({
          cartItems: transformedItems,
          cartSummary,
        })
      },

      /**
       * Initializes the cart by fetching it from the API or creating a new one if none exists.
       *
       * @param silent - If true, suppresses setting loading and error states.
       *   Use silent mode when you want to refresh the cart in the background without triggering UI loading indicators or error messages.
       *   When silent is false (default), loading and error states will be updated to reflect the operation's progress and any failures.
       */
      initializeCart: async (silent = false) => {
        try {
          if (!silent) {
            set({ loading: true, errors: [] })
          }

          await ensureSession()
          const existingCart = await cartApi.getCurrentCart()

          if (existingCart) {
            get()._setCart(existingCart)
          } else {
            // Create new cart if none exists
            const newCart = await cartApi.createCart()
            get()._setCart(newCart)
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error)
          if (!silent) {
            if (error instanceof CartApiError) {
              set({
                errors: [
                  {
                    code: 'INIT_ERROR',
                    message: error.message,
                    field: undefined,
                  },
                ],
              })
            } else {
              set({
                errors: [
                  {
                    code: 'INIT_ERROR',
                    message: 'Failed to initialize cart',
                    field: undefined,
                  },
                ],
              })
            }
          }
        } finally {
          if (!silent) {
            set({ loading: false })
          }
        }
      },

      // Add item to cart
      addItem: async (item) => {
        try {
          set({ loading: true, errors: [] })

          if (!item.productId) {
            throw new Error('Product ID is required')
          }

          const addedItem = await cartApi.addItem(
            item.productId,
            item.variant?.id || item.productVariantId || undefined,
            item.quantity || 1,
          )

          // Refresh cart to get updated state
          const updatedCart = await cartApi.getCurrentCart()
          if (updatedCart) {
            get()._setCart(updatedCart)
          }

          return addedItem
        } catch (error) {
          console.error('Failed to add item:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'ADD_ITEM_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'ADD_ITEM_ERROR',
                  message: 'Failed to add item to cart',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Add bundle to cart
      addBundle: async (promotionId) => {
        try {
          set({ loading: true, errors: [] })

          const updatedCart = await cartApi.addBundle(promotionId)

          if (updatedCart) {
            get()._setCart(updatedCart)
          }

          return updatedCart
        } catch (error) {
          console.error('Failed to add bundle:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'ADD_BUNDLE_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'ADD_BUNDLE_ERROR',
                  message: 'Failed to add bundle to cart',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Remove item from cart
      removeItem: async (itemId) => {
        try {
          set({ loading: true, errors: [] })

          await cartApi.removeItem(itemId)

          // Refresh cart to get updated state
          const updatedCart = await cartApi.getCurrentCart()
          if (updatedCart) {
            get()._setCart(updatedCart)
          }
        } catch (error) {
          console.error('Failed to remove item:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'REMOVE_ITEM_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'REMOVE_ITEM_ERROR',
                  message: 'Failed to remove item',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Update item quantity
      updateItem: async (itemId, quantity) => {
        try {
          set({ loading: true, errors: [] })

          if (quantity <= 0) {
            await get().removeItem(itemId)
            return
          }

          const updatedItem = await cartApi.updateItem(itemId, quantity)

          // Refresh cart to get updated state
          const updatedCart = await cartApi.getCurrentCart()
          if (updatedCart) {
            get()._setCart(updatedCart)
          }

          return updatedItem
        } catch (error) {
          console.error('Failed to update item:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'UPDATE_ITEM_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'UPDATE_ITEM_ERROR',
                  message: 'Failed to update item',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Email cart with validation
      emailCart: async (email, createAccountPrompt = false) => {
        try {
          set({ emailLoading: true, emailError: null, emailSuccess: false })

          // Validate email
          if (!email || !email.trim()) {
            throw new Error('Vui lòng nhập địa chỉ email.')
          }

          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email.trim())) {
            throw new Error('Vui lòng nhập địa chỉ email hợp lệ.')
          }

          const result = await cartApi.emailCart({
            email: email.trim(),
            createAccountPrompt,
          })

          set({ emailSuccess: true })
          return result
        } catch (error) {
          console.error('Failed to email cart:', error)

          let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

          // Handle validation errors
          if (error instanceof Error && !error.message.includes('Failed')) {
            errorMessage = error.message
          }
          // Handle API errors
          else if (error instanceof CartApiError) {
            // Map common error messages to Vietnamese
            if (error.message.toLowerCase().includes('empty')) {
              errorMessage = 'Giỏ hàng của bạn đang trống.'
            } else if (error.message.toLowerCase().includes('email')) {
              errorMessage = 'Địa chỉ email không hợp lệ.'
            } else if (error.statusCode === 410) {
              errorMessage = 'Phiên làm việc đã hết hạn. Vui lòng thử lại.'
            } else if (error.message) {
              errorMessage = error.message
            } else {
              errorMessage = 'Không thể gửi giỏ hàng. Vui lòng thử lại.'
            }
          }

          set({ emailError: errorMessage })
          throw new Error(errorMessage)
        } finally {
          set({ emailLoading: false })
        }
      },

      // Reset email states
      resetEmailState: () => {
        set({
          emailLoading: false,
          emailSuccess: false,
          emailError: null,
        })
      },

      // Merge shared cart
      mergeSharedCart: async (accessToken) => {
        try {
          set({ loading: true, errors: [] })

          const mergedCart = await cartApi.mergeSharedCart(accessToken)

          // Update local cart state
          get()._setCart(mergedCart)

          return mergedCart
        } catch (error) {
          console.error('Failed to merge cart:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'MERGE_CART_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'MERGE_CART_ERROR',
                  message: 'Failed to merge cart',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Apply promotion codes
      applyPromotion: async (promotionCodes) => {
        try {
          set({ loading: true, errors: [] })

          const updatedCart = await cartApi.applyPromotion(promotionCodes)

          // Refresh cart to get updated state
          if (updatedCart) {
            get()._setCart(updatedCart)
          }

          return updatedCart
        } catch (error) {
          console.error('Failed to apply promotion:', error)
          if (error instanceof CartApiError) {
            set({
              errors: [
                {
                  code: 'APPLY_PROMOTION_ERROR',
                  message: error.message,
                  field: undefined,
                },
              ],
            })
          } else {
            set({
              errors: [
                {
                  code: 'APPLY_PROMOTION_ERROR',
                  message: 'Failed to apply promotion',
                  field: undefined,
                },
              ],
            })
          }
          throw error
        } finally {
          set({ loading: false })
        }
      },

      // Clear cart
      clearCart: () => {
        SessionManager.getInstance().clearSession()
        updateLocalCartTotalItems(0)
        set({
          cart: null,
          cartItems: [],
          cartSummary: {
            subtotal: 0,
            freeShipping: false,
            tax: 0,
            discount: 0,
            total: 0,
            currency: 'VND',
          },
          errors: [],
        })
      },
    }),
    {
      name: 'cart-store',
    },
  ),
)
