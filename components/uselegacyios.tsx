"use client"

import { useEffect, useState } from "react"

export function IOSAwareContent() {
  const [isLegacyIOS, setIsLegacyIOS] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const match = ua.match(/OS (\d+)[._](\d+)/i)

    if (!/iPhone|iPad|iPod/i.test(ua) || !match) return

    const major = Number(match[1])
    const minor = Number(match[2])

    setIsLegacyIOS(major < 16 || (major === 16 && minor <= 4))
  }, [])

  return isLegacyIOS
}