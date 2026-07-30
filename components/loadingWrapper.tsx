'use client'

import React, { useEffect } from 'react'
import { LoadingScreen } from './loadingScreen'

interface LoadingWrapperProps {
  children: React.ReactNode
  unsupported?: boolean
}

export default function LoadingWrapper({ 
  children, 
  unsupported = false 
}: LoadingWrapperProps) {
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
      {children}
    </>
  )
}
