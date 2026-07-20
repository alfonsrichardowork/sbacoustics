import React from 'react'
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  return {
    title: {
      template: '%s | SB Automotive',
      default: 'SB Automotive | Beyond Sound',
    },
    description: 'Check out the newest products from the SB Automotive range!',
    keywords: ["SB Automotive", "SB Automotive Official Website", "Welcome to SB Automotive"],
    openGraph: {
      title: 'SB Automotive | Beyond Sound',
      description: 'Check out the newest products from the SB Automotive range!',
      url: `${baseUrl}/sbautomotive`,
      siteName: 'SB Automotive',
      images: [
        {
          url: `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
          width: 1200,
          height: 630,
          alt: 'SB Automotive Logo',
        },
        {
          url: `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
          width: 800,
          height: 800,
          alt: 'SB Automotive Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SB Automotive | Beyond Sound',
      description: 'Check out the newest products from the SB Automotive range!',
      images: [
        {
          url: `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
          width: 800,
          height: 800,
          alt: 'SB Automotive Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbautomotive`,
    }
  }
}

export default function RootLayoutSBAutomotive({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
