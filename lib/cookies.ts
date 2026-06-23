export type CookieCategory = 'essential' | 'analytics'

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  timestamp: number
}

const COOKIE_NAME = 'cookie-preferences'
const COOKIE_EXPIRY_DAYS = 365

export const cookieManager = {
  // Get preferences from cookie
  getPreferences: (): CookiePreferences | null => {
    if (typeof document === 'undefined') return null

    const cookies = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(COOKIE_NAME + '='))

    if (!cookies) return null

    try {
      const cookieValue = cookies.split('=')[1]
      if (!cookieValue) return null
      const value = decodeURIComponent(cookieValue)
      return JSON.parse(value)
    } catch {
      return null
    }
  },

  // Set preferences in cookie
  setPreferences: (preferences: CookiePreferences): void => {
    if (typeof document === 'undefined') return

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS)

    const cookieValue = encodeURIComponent(JSON.stringify(preferences))
    document.cookie = `${COOKIE_NAME}=${cookieValue}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`
  },

  // Get default preferences
  getDefaultPreferences: (): CookiePreferences => ({
    essential: true, // Always true
    analytics: false,
    timestamp: Date.now(),
  }),

  // Accept all cookies
  acceptAll: (): CookiePreferences => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      timestamp: Date.now(),
    }
    cookieManager.setPreferences(prefs)
    return prefs
  },

  // Reject non-essential cookies
  rejectAll: (): CookiePreferences => {
    const prefs = cookieManager.getDefaultPreferences()
    cookieManager.setPreferences(prefs)
    return prefs
  },

  // Check if cookie exists
  hasPreferences: (): boolean => {
    if (typeof document === 'undefined') return false
    return document.cookie.includes(COOKIE_NAME)
  },
}
