'use client'

import { useState, useEffect } from 'react'
import { useCookiePreferences } from '@/lib/cookies-context'
import '@/app/legacy/components/style/all-style.css'

interface CookieSettingsProps {
  onClose: () => void
}

interface CookieCategory {
  id: string
  name: string
  description: string
  essential?: boolean
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description:
      'These cookies are necessary for the website to function properly. They cannot be disabled.',
    essential: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description:
      'These cookies help us understand how visitors interact with our website through aggregated data.',
  },
]

export default function CookieSettingsOld({ onClose }: CookieSettingsProps) {
  const { preferences, setPreferences, acceptAll, rejectAll } = useCookiePreferences()
  const [localPrefs, setLocalPrefs] = useState(preferences || {
    essential: true,
    analytics: false,
    firstload: true,
    path: '',
    timestamp: Date.now(),
  })

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences)
    }
  }, [preferences])

  const handleToggle = (category: string) => {
    if (category === 'essential') return // Essential cookies cannot be toggled
    setLocalPrefs(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
      timestamp: Date.now(),
    }))
  }

  const handleSave = () => {
    setPreferences(localPrefs as any)
    onClose()
  }

  return (
    <div className="cookie-settings-parent">
      <div className="cookie-settings-child-1">
        {/* Header */}
        <div className="cookie-settings-child-header">
          <h2 className="cookie-settings-title">
            Cookie Preferences
          </h2>
          <button
            onClick={onClose}
            style={{
              color: '#e6001b'
            }}
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="cookie-settings-content">
          <p className="cookie-settings-info">
            Customize your cookie preferences below. You can enable or disable non-essential cookies at any time.
          </p>

          <div style={{
            marginBlockStart: '16px',
            marginBlockEnd: '16px'
          }}>
            {COOKIE_CATEGORIES.map(category => (
              <div
                key={category.id}
                className="cookie-settings-category-parent"
              >
                <div className="cookie-settings-category-container">
                  <div style={{
                    flex: 1
                  }}>
                    <h3 className="cookie-settings-category-title">
                      {category.name}
                    </h3>
                    <p className="cookie-settings-category-description">
                      {category.description}
                    </p>
                  </div>
                  <div style={{
                    flexShrink: 0
                  }}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!localPrefs[category.id as keyof typeof localPrefs]}
                      disabled={category.essential}
                      onClick={() => handleToggle(category.id)}
                      style={{
                        width: "44px",
                        height: "24px",
                        padding: "2px",
                        border: "none",
                        borderRadius: "9999px",
                        backgroundColor: !!localPrefs[category.id as keyof typeof localPrefs]
                          ? "#e6001b"
                          : "#d1d5db",
                        cursor: category.essential ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: !!localPrefs[category.id as keyof typeof localPrefs]
                          ? "flex-end"
                          : "flex-start",
                        transition: "background-color 0.2s ease",
                        opacity: category.essential ? 0.6 : 1,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "block",
                          transition: "transform 0.2s ease",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="cookie-settings-category-footer">
          <button
            onClick={() => [rejectAll(), onClose()]}
            style={{
              backgroundColor: '#e4e4e7',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            Reject All
          </button>
          <button
            onClick={() => [acceptAll(), onClose()]}
            style={{
              backgroundColor: '#e4e4e7',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            Accept All
          </button>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#e6001b',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
