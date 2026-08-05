'use client'

import React, { useEffect, useState } from 'react'
import { LoadingScreen } from './loadingScreen'
// import { IOSAwareContent } from './uselegacyios'

interface LoadingWrapperProps {
  children: React.ReactNode
}

export default function LoadingWrapper({ 
  children, 
}: LoadingWrapperProps) {

  // const legacyIOS = IOSAwareContent()
  // if (legacyIOS) {
  //   return <div className="bg-black h-dvh w-dvw flex items-center justify-center text-white text-xl">This site is not fully supported on your device. Please consider using a modern browser for the best experience.</div>;
  // }
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    // Give the page a moment to settle, then hide the initial loader
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Call the function exposed in layout.tsx to hide the HTML-level loader
      if (typeof window !== 'undefined' && (window as any).hideInitialLoader) {
        (window as any).hideInitialLoader()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {/* <div className={`bg-red-500 w-dvw h-fit text-white text-lg z-1000 flex items-center justify-center absolute`}>legacyiOS: {legacyiOS.toString()}</div> */}
      {children}
    </>
  )
}
