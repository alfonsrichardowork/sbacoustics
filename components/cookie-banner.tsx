'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CookieIcon, X } from 'lucide-react'
import { useCookiePreferences } from '@/lib/cookies-context'
import CookieSettings from './cookie-settings'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CookieBanner() {
  const { preferences, isLoaded, acceptAll, rejectAll } = useCookiePreferences()
  const [showSettings, setShowSettings] = useState(false)
  const pathname = usePathname()

  // Don't show banner if preferences are already set
  if (!isLoaded || preferences) {
    return null
  }

  if (showSettings) {
    return <CookieSettings onClose={() => setShowSettings(false)} />
  }

  return (
    <div className={`z-40 fixed bottom-0 left-0 right-0 shadow-lg`}>
      <div className={`max-w-6xl w-fit mx-auto bg-white md:p-3 p-2 rounded-t-2xl shadow-[-1px_-4px_6px_-1px_rgba(0,0,0,0.1)]`}>
        <div className="relative">
          {/* X button - top right */}
          <Button
            variant="ghost"
            onClick={acceptAll}
            className="absolute top-0 right-0 h-fit p-0 hover:text-primary hover:cursor-pointer hover:bg-transparent"
          >
            <X size={20}/>
          </Button>

          {/* <div className="absolute top-1/2 left-0 h-full p-0">
            <CookieIcon className="w-5 h-5 text-primary flex-shrink-0" />
          </div> */}
          {/* Centered content */}
          <div className="flex flex-col items-center pl-0 pr-6">

            <div className="text-center">
              <p className="md:text-sm text-xs text-black mb-1">
                We use cookies for site functionality and to analyze our traffic. By browsing our site or by selecting "X", you agree to our use of cookies.

                View SB Acoustics website <Link href={'/privacy'} className='md:text-sm text-xs hover:text-red-800 text-primary underline hover:cursor-pointer '>Privacy Policy</Link>. Visit our
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className="md:text-sm text-xs h-fit px-1 py-0 hover:bg-transparent hover:text-red-800 text-primary underline hover:cursor-pointer inline"
                >
                  Cookie Settings
                </Button>
                to manage your preferences.
                <Button
                  variant="ghost"
                  onClick={rejectAll}
                  className="md:text-sm text-xs h-fit px-1 py-0 hover:bg-transparent hover:text-red-800 text-primary underline hover:cursor-pointer inline"
                >
                  Click Here
                </Button>
                to reject all non-essential cookies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
