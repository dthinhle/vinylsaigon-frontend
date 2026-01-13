'use client'

import { SessionInfo } from '../types/cart.types'

export class SessionManager {
  private static instance: SessionManager
  private sessionInfo: SessionInfo | null = null
  private readonly SESSION_KEY = 'cart_session'
  private readonly SESSION_EXPIRY_BUFFER = 5 * 60 * 1000 // 5 minutes buffer

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadSession()
    }
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
      if (typeof window !== 'undefined') {
        SessionManager.instance.loadSession()
      }
    }
    return SessionManager.instance
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY)
      if (stored) {
        const session = JSON.parse(stored) as SessionInfo
        if (new Date(session.expiresAt) > new Date()) {
          this.sessionInfo = session
        } else {
          this.clearSession()
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error)
      this.clearSession()
    }
  }

  private saveSession(): void {
    if (this.sessionInfo && typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.sessionInfo))
      } catch (error) {
        console.warn('Failed to save session:', error)
      }
    }
  }

  setSession(session: SessionInfo): void {
    this.sessionInfo = session
    this.saveSession()
  }

  getSessionId(): string | null {
    return this.sessionInfo?.sessionId || null
  }

  getSession(): SessionInfo | null {
    return this.sessionInfo
  }

  isSessionExpired(): boolean {
    if (!this.sessionInfo) return true

    const expiryTime = new Date(this.sessionInfo.expiresAt).getTime()
    const currentTime = Date.now()

    return currentTime >= expiryTime - this.SESSION_EXPIRY_BUFFER
  }

  clearSession(): void {
    this.sessionInfo = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  getSessionHeaders(): Record<string, string> {
    const sessionId = this.getSessionId()
    return sessionId ? { 'X-Session-ID': sessionId } : {}
  }

  handleSessionResponse(headers: Headers): void {
    // Handle any session updates from response headers if needed
    const newSessionId = headers.get('X-New-Session-ID')
    const newExpiresAt = headers.get('X-Session-Expires')

    if (newSessionId && newExpiresAt && this.sessionInfo) {
      this.sessionInfo = {
        ...this.sessionInfo,
        sessionId: newSessionId,
        expiresAt: newExpiresAt,
      }
      this.saveSession()
    }
  }
}
