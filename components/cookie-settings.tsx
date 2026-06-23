'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useCookiePreferences } from '@/lib/cookies-context'

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
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description:
      'These cookies are used to deliver personalized advertisements and track marketing campaign performance.',
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description:
      'These cookies remember your choices to provide a personalized experience on future visits.',
  },
]

export default function CookieSettings({ onClose }: CookieSettingsProps) {
  const { preferences, setPreferences, acceptAll, rejectAll } = useCookiePreferences()
  const [localPrefs, setLocalPrefs] = useState(preferences || {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cookie Preferences
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Customize your cookie preferences below. You can enable or disable non-essential cookies at any time.
          </p>

          <div className="space-y-4">
            {COOKIE_CATEGORIES.map(category => (
              <div
                key={category.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleToggle(category.id)}
                      disabled={category.essential}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        localPrefs[category.id as keyof typeof localPrefs]
                          ? 'bg-primary'
                          : 'bg-gray-300 dark:bg-gray-700'
                      } ${
                        category.essential
                          ? 'cursor-not-allowed opacity-75'
                          : 'cursor-pointer'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          localPrefs[category.id as keyof typeof localPrefs]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => [rejectAll(), onClose()]}
          >
            Reject All
          </Button>
          <Button
            variant="outline"
            onClick={() => [acceptAll(), onClose()]}
          >
            Accept All
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-red-700"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
