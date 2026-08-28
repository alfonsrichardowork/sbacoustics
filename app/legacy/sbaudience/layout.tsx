import React from 'react'
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  return {
    title: {
      template: '%s | SB Audience',
      default: 'SB Audience | Pro Speakers',
    },
    description: 'Explore SB Audience range of professional loudspeaker drivers engineered for sound reinforcement applications. Delivering high performance, reliability, and exceptional audio quality!',
    keywords: [
      "SB Audience", 
      "pro speakers",
      "pro drivers",
      "compression drivers",
      "woofers",
      "subwoofers",
      "open baffle drivers",
      "coaxials",
      "horn",
      "speaker applications",
    ],
    openGraph: {
      title: 'SB Audience | Pro Speakers',
      description: 'Explore SB Audience range of professional loudspeaker drivers engineered for sound reinforcement applications. Delivering high performance, reliability, and exceptional audio quality!',
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
      title: 'SB Audience | Pro Speakers',
      description: 'Explore SB Audience range of professional loudspeaker drivers engineered for sound reinforcement applications. Delivering high performance, reliability, and exceptional audio quality!',
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
