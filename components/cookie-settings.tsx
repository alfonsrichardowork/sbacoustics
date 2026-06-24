'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useCookiePreferences } from '@/lib/cookies-context'
import { Switch } from './ui/switch'

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

export default function CookieSettings({ onClose }: CookieSettingsProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-white dark:bg-gray-900">
          <h2 className="md:text-2xl text-lg font-bold text-gray-900 dark:text-white">
            Cookie Preferences
          </h2>
          <button
            onClick={onClose}
            className="hover:text-primary hover:cursor-pointer hover:bg-transparent transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="md:text-sm text-xs text-gray-600 dark:text-gray-400">
            Customize your cookie preferences below. You can enable or disable non-essential cookies at any time.
          </p>

          <div className="space-y-4">
            {COOKIE_CATEGORIES.map(category => (
              <div
                key={category.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 md:text-sm text-xs">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Switch
                      checked={!!localPrefs[category.id as keyof typeof localPrefs]}
                      onCheckedChange={() => handleToggle(category.id)}
                      disabled={category.essential}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4 flex gap-2 justify-end">
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
