'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useCookiePreferences } from '@/lib/cookies-context'
import CookieSettings from './cookie-settings'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CookieBanner() {
  const {preferences, isLoaded, acceptAll, rejectAll, acceptFirstLoad, setFirstLoad } = useCookiePreferences()
  const [showSettings, setShowSettings] = useState(false)
  const pathname = usePathname()
  const [showBanner, setShowBanner] = useState<boolean>(true)

  // const preferencesRef = useRef(preferences);
  // useEffect(() => {
  //   preferencesRef.current = preferences;
  // }, [preferences]);


useEffect(() => {
  if (!isLoaded) return;
  // const timer = setTimeout(() => {
  //   console.log("preferences:", preferences);

    if (preferences) {
      if (preferences.path === pathname) {
        // setFirstLoad(false, pathname)
      } else {
        setShowBanner(false);
      }
    } else {
      acceptFirstLoad(pathname);
    }
  // }, 100);

  // return () => clearTimeout(timer);
}, [pathname, preferences, isLoaded]);
// const preferencesRef = useRef(preferences);

// useEffect(() => {
//   preferencesRef.current = preferences;
// }, [preferences]);

// useEffect(() => {
//   const prefs = preferencesRef.current;

//   if (!prefs) {
//     acceptFirstLoad();
//     return;
//   }

//   if (prefs.firstload) {
//     setShowBanner(false);
//     setFirstLoad(false)
//   }
// }, [pathname]);

  if (!isLoaded || !showBanner) {
    return null
  }

  if (showSettings) {
    return <CookieSettings onClose={() => setShowSettings(false)} />
  }

  return (
    <div className={`z-40 fixed bottom-0 left-0 right-0 shadow-[-1px_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white`}>
      <div className="relative z-20">
        <Button
          variant="ghost"
          onClick={acceptAll}
          className="absolute top-2 right-2 h-fit p-0 hover:text-primary hover:cursor-pointer hover:bg-transparent"
        >
          <X size={20}/>
        </Button>
      </div>
      <div className={`max-w-6xl w-fit mx-auto md:p-3 p-2 rounded-t-2xl`}>
        <div className="relative">

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
