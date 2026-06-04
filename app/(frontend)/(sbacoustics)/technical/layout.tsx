import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: `Technical`,
    description: `All SB Acoustics Technical`,
    keywords: `SB Acoustics Technical, All SB Acoustics Technical, SB Acoustics Technical Document, SB Acoustics Technical PDF`,
    openGraph: {
      title: `Technical | SB Acoustics`,
      description: `All SB Acoustics Technical`,
      url: `${baseUrl}/technical`,
      siteName: 'SB Acoustics',
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Acoustics Logo',
        },
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: 'SB Acoustics Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Technical | SB Acoustics`,
      description: `All SB Acoustics Technical`,
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Acoustics Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}/technical`,
    },
  }
}

export default function TechnicalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='pt-16 bg-white'>
      {children}
    </div>
  )
}
