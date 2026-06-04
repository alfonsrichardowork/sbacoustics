import React from 'react'
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  return {
    title: {
      template: '%s | SB Audience',
      default: 'SB Audience | Official SB Audience Website',
    },
    description: 'Check out the newest products from the SB Audience range!',
    keywords: ["SB Audience", "SB Audience Official Website", "Welcome to SB Audience"],
    openGraph: {
      title: 'SB Audience | Official SB Audience Website',
      description: 'Check out the newest products from the SB Audience range!',
      url: `${baseUrl}/sbaudience`,
      siteName: 'SB Audience',
      images: [
        {
          url: `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
          width: 1200,
          height: 630,
          alt: 'SB Audience Logo',
        },
        {
          url: `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
          width: 800,
          height: 800,
          alt: 'SB Audience Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SB Audience | Official SB Audience Website',
      description: 'Check out the newest products from the SB Audience range!',
      images: [
        {
          url: `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
          width: 800,
          height: 800,
          alt: 'SB Audience Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbaudience`,
    }
  }
}

export default function RootLayoutSBAudience({
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
