'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { CookiePreferences } from './cookies'
import { cookieManager } from './cookies'

interface CookieContextType {
  preferences: CookiePreferences | null
  isLoaded: boolean
  setPreferences: (prefs: CookiePreferences) => void
  acceptAll: () => void
  rejectAll: () => void
  updatePreference: (category: keyof CookiePreferences, value: boolean) => void
  isCategoryAllowed: (category: string) => boolean
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<CookiePreferences | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load preferences from cookie on mount
    const saved = cookieManager.getPreferences()
    if (saved) {
      setPreferencesState(saved)
    }
    setIsLoaded(true)
  }, [])

  const setPreferences = (prefs: CookiePreferences) => {
    cookieManager.setPreferences(prefs)
    setPreferencesState(prefs)
  }

  const acceptAll = () => {
    const prefs = cookieManager.acceptAll()
    setPreferencesState(prefs)
  }

  const rejectAll = () => {
    const prefs = cookieManager.rejectAll()
    setPreferencesState(prefs)
  }

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    if (!preferences) return

    const updated: CookiePreferences = {
      ...preferences,
      [category]: value,
      timestamp: Date.now(),
    }
    setPreferences(updated)
  }

  const isCategoryAllowed = (category: string): boolean => {
    if (!preferences) return false
    return preferences[category as keyof CookiePreferences] === true
  }

  return React.createElement(
    CookieContext.Provider,
    {
      value: {
        preferences,
        isLoaded,
        setPreferences,
        acceptAll,
        rejectAll,
        updatePreference,
        isCategoryAllowed,
      },
    },
    children,
  )
}

export function useCookiePreferences() {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookiePreferences must be used within a CookieProvider')
  }
  return context
}
