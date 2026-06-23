'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCookiePreferences } from '@/lib/cookies-context'

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
      'These cookies help us understand how visitors interact with our website through aggregated data. (e.g., Google Analytics)',
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description:
      'These cookies are used to deliver personalized advertisements and track marketing campaign performance across platforms.',
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description:
      'These cookies remember your choices to provide a personalized experience on future visits.',
  },
]

export default function CookieSettingsPage() {
  const { preferences, setPreferences, acceptAll, rejectAll } = useCookiePreferences()
  const [localPrefs, setLocalPrefs] = useState(preferences || {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
    timestamp: Date.now(),
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (category: string) => {
    if (category === 'essential') return
    setLocalPrefs(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
      timestamp: Date.now(),
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setPreferences(localPrefs as any)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cookie Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your cookie preferences. Essential cookies are always enabled.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {COOKIE_CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                          ? 'bg-blue-600'
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

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-3">
            <Button
              variant="outline"
              onClick={rejectAll}
              className="flex-1"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={acceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Save Preferences
          </Button>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300 text-sm">
            ✓ Your cookie preferences have been saved successfully.
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> Your preferences are stored locally in your browser and will be remembered for the next 365 days.
          </p>
        </div>
      </div>
    </div>
  )
}
