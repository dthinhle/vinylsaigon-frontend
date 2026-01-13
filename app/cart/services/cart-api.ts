'use client'

import { SessionManager } from '@/app/cart/utils/session-manager'
import { apiClient } from '@/lib/axios'
import { ISimpleProduct } from '@/lib/types/product'
import { get } from 'lodash'

import {
  ApiError,
  Cart,
  CartSessionResponse,
  EmailCartRequest,
  EmailCartResponse,
  SessionInfo,
} from '../types/cart.types'

export const sessionManager = SessionManager.getInstance()

export class CartApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string,
    public requestId?: string,
  ) {
    super(message)
    this.name = 'CartApiError'
  }
}

const checkBotSession = (): boolean => {
  const userAgent = navigator?.userAgent || ''
  const botIndicators = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /slurp/i,
    /bingpreview/i,
    /mediapartners-google/i,
    /adsbot-google/i,
    /googlebot/i,
    /yahoo! slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i,
  ]

  return botIndicators.some((indicator) => indicator.test(userAgent))
}

const BOT_CART: Cart = {
  id: 'bot-cart',
  sessionId: 'bot-session',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active',
  cartType: 'anonymous',
  items: [],
  promotions: [],
  subtotal: '0',
  total: '0',
  expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  lastActivityAt: new Date().toISOString(),
  metadata: {},
  totalItems: 0,
  currency: 'VND',
  freeShipping: false,
  discountTotal: '0',
  installmentFlags: {
    freeItemsCount: 0,
    fullyFreeInstallment: true,
    hasFreeInstallment: true,
    totalItemsCount: 0,
  },
}

const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const apiError: ApiError = error.response.data
    throw new CartApiError(
      apiError.message || apiError.error,
      error.response.status,
      typeof apiError.details === 'string' ? apiError.details : JSON.stringify(apiError.details),
      apiError.requestId,
    )
  }
  throw new CartApiError(error.message || 'An unexpected error occurred')
}

const convertAxiosHeadersToHeaders = (axiosHeaders: any): Headers => {
  const headers = new Headers()
  if (axiosHeaders && typeof axiosHeaders === 'object') {
    Object.keys(axiosHeaders).forEach((key) => {
      const value = axiosHeaders[key]
      if (value !== undefined && value !== null) {
        headers.set(key, String(value))
      }
    })
  }
  return headers
}

const makeRequestWithSession = async <T>(
  requestFn: () => Promise<T>,
  retryOnSessionExpired = true,
): Promise<T> => {
  try {
    const response = await requestFn()
    return response
  } catch (error: any) {
    if (retryOnSessionExpired && error.response?.status === 410) {
      // Session expired, create new one and retry
      await createAnonymousSession()
      return requestFn()
    }
    throw error
  }
}

export const sessionApi = {
  async createAnonymousSession(): Promise<SessionInfo> {
    if (checkBotSession()) {
      return {
        sessionId: 'bot-session',
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour expiry
        createdAt: new Date().toISOString(),
      }
    }
    try {
      const response = await apiClient.post<CartSessionResponse>('/cart_sessions', {
        browserFingerprint: navigator?.userAgent || '',
        userAgent: navigator?.userAgent || '',
      })

      const cart = response.data.cart
      const sessionInfo: SessionInfo = {
        sessionId: cart.sessionId,
        expiresAt: response.data.expiresAt,
        createdAt: cart.createdAt,
      }

      sessionManager.setSession(sessionInfo)
      const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
      sessionManager.handleSessionResponse(convertedHeaders)

      return sessionInfo
    } catch (error) {
      return handleApiError(error)
    }
  },

  async validateSession(sessionId: string): Promise<boolean> {
    if (checkBotSession()) {
      return true
    }
    try {
      const response = await apiClient.get(`/cart_sessions/${sessionId}/validate`)
      const validation = response.data
      return validation.valid
    } catch (error) {
      console.warn('Session validation failed:', error)
      sessionManager.clearSession()
      return false
    }
  },
}

export const createAnonymousSession = async (): Promise<SessionInfo> => {
  return sessionApi.createAnonymousSession()
}

export const ensureSession = async (): Promise<string> => {
  if (checkBotSession()) {
    return 'bot-session'
  }
  const currentSessionId = sessionManager.getSessionId()

  if (!currentSessionId || sessionManager.isSessionExpired()) {
    const session = await createAnonymousSession()
    return session.sessionId
  }

  // Validate existing session
  const isValid = await sessionApi.validateSession(currentSessionId)
  if (!isValid) {
    const session = await createAnonymousSession()
    return session.sessionId
  }

  return currentSessionId
}

export const cartApi = {
  async getCurrentCart(): Promise<Cart | null> {
    return makeRequestWithSession(async () => {
      if (checkBotSession()) {
        return new Promise<Cart>((resolve) => resolve(BOT_CART))
      }
      try {
        const response = await apiClient.get('/carts', {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null
        }
        handleApiError(error)
      }
    })
  },

  async createCart(): Promise<Cart> {
    if (checkBotSession()) {
      return new Promise<Cart>((resolve) => resolve(BOT_CART))
    }
    return makeRequestWithSession(async () => {
      try {
        const response = await apiClient.post(
          '/carts',
          {},
          {
            headers: sessionManager.getSessionHeaders(),
          },
        )

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async addItem(productId: number, productVariantId?: number, quantity: number = 1): Promise<Cart> {
    if (checkBotSession()) {
      return new Promise<Cart>((resolve) => resolve(BOT_CART))
    }
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          productId,
          productVariantId,
          quantity,
        }

        const response = await apiClient.post('/carts/add_item', requestBody, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async addBundle(promotionId: number): Promise<Cart> {
    if (checkBotSession()) {
      return new Promise<Cart>((resolve) => resolve(BOT_CART))
    }
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          promotionId,
        }

        const response = await apiClient.post('/carts/add_bundle', requestBody, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async updateItem(itemId: string, quantity: number): Promise<any> {
    if (checkBotSession()) {
      return new Promise<null>((resolve) => resolve(null))
    }
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          itemId,
          quantity,
        }

        const response = await apiClient.put('/carts/update_item', requestBody, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async removeItem(itemId: string): Promise<void> {
    if (checkBotSession()) {
      return new Promise<void>((resolve) => resolve())
    }
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          itemId,
        }

        await apiClient.delete('/carts/remove_item', {
          headers: sessionManager.getSessionHeaders(),
          data: requestBody,
        })
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async emailCart(emailRequest: EmailCartRequest): Promise<EmailCartResponse> {
    if (checkBotSession()) {
      return new Promise<EmailCartResponse>((resolve) => resolve({
        id: 'bot-email-cart',
        cartId: 'bot-cart',
        email: emailRequest.email,
        sentAt: new Date().toISOString(),
        accessToken: 'bot-access-token',
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        recipientType: 'anonymous',
      }))
    }
    return makeRequestWithSession(async () => {
      try {
        const response = await apiClient.post('/carts/email', emailRequest, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async mergeSharedCart(accessToken: string): Promise<Cart> {
    if (checkBotSession()) {
      return new Promise<Cart>((resolve) => resolve(BOT_CART))
    }
    return makeRequestWithSession(async () => {
      try {
        const response = await apiClient.post(
          '/carts/merge',
          { accessToken },
          {
            headers: sessionManager.getSessionHeaders(),
          },
        )

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async getRelatedProducts(): Promise<{ relatedProducts: Array<ISimpleProduct> } | undefined> {
    if (checkBotSession()) {
      return new Promise<{ relatedProducts: Array<ISimpleProduct> }>((resolve) => resolve({ relatedProducts: [] }))
    }
    try {
      const response = await apiClient.get('/categories/related_products', {
        headers: sessionManager.getSessionHeaders(),
      })

      return get(response, 'data', { relatedProducts: [] })
    } catch (error) {
      handleApiError(error)
    }
  },

  async updateGuestEmail(email: string): Promise<{
    success: boolean
    message: string
    cart?: Cart
  }> {
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          email,
        }

        const response = await apiClient.put('/carts/update_guest_email', requestBody, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },

  async applyPromotion(promotionCodes: string[]): Promise<Cart> {
    return makeRequestWithSession(async () => {
      try {
        const requestBody = {
          promotion_codes: promotionCodes,
        }

        const response = await apiClient.post('/carts/apply_promotion', requestBody, {
          headers: sessionManager.getSessionHeaders(),
        })

        const convertedHeaders = convertAxiosHeadersToHeaders(response.headers)
        sessionManager.handleSessionResponse(convertedHeaders)
        return response.data
      } catch (error) {
        handleApiError(error)
      }
    })
  },
}
