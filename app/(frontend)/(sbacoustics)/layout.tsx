import React from 'react'
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | SB Acoustics',
      default: 'SB Acoustics | Building Your Sound',
    }
  }
}

export default function RootLayoutSBAcoustics({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
