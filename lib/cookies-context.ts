'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { CookiePreferences } from './cookies'
import { cookieManager } from './cookies'

interface CookieContextType {
  preferences: CookiePreferences | null
  isLoaded: boolean
  setPreferences: (prefs: CookiePreferences) => void
  setFirstLoad: (firstload: boolean, path: string) => CookiePreferences | null
  acceptAll: () => void
  rejectAll: () => void
  acceptFirstLoad: (path: string) => void
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
    const updated: CookiePreferences = {
      ...prefs,
      path: '',
      timestamp: Date.now(),
    }
    cookieManager.setPreferences(updated)
    setPreferencesState(updated)
  }

  const acceptAll = () => {
    const prefs = cookieManager.acceptAll()
    setPreferencesState(prefs)
  }

  const rejectAll = () => {
    const prefs = cookieManager.rejectAll()
    setPreferencesState(prefs)
  }

  const acceptFirstLoad = (path: string) => {
    const prefs = cookieManager.acceptFirstLoad(path)
    setPreferencesState(prefs)
  }

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    if (!preferences) return

    const updated: CookiePreferences = {
      ...preferences,
      path: '',
      [category]: value,
      timestamp: Date.now(),
    }
    setPreferences(updated)
  }

  const setFirstLoad = (firstload: boolean, path: string): CookiePreferences | null => {
    if (!preferences) {
      const newPrefs = { firstload: firstload, path: path, timestamp: Date.now() } as CookiePreferences
      setPreferences(newPrefs)
      return newPrefs
    }

    const updated: CookiePreferences = {
      ...preferences,
      firstload: firstload,
      path: '',
      timestamp: Date.now(),
    }
    setPreferences(updated)
    return updated
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
        setFirstLoad,
        acceptAll,
        rejectAll,
        acceptFirstLoad,
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
