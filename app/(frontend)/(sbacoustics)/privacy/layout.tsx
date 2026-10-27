import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Privacy Policy",
    description: "Read the SB Acoustics Privacy Policy to understand how we collect, use, store, and protect personal information, cookies, analytics data, and other information related to your use of our website.",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Privacy Policy", "SB Acoustics Cookie Policy", "SB Acoustics Policy"],
    openGraph: {
      title: "Privacy Policy | SB Acoustics",
      description: "Read the SB Acoustics Privacy Policy to understand how we collect, use, store, and protect personal information, cookies, analytics data, and other information related to your use of our website.",
      url: `${baseUrl}/privacy`,
      siteName: "SB Acoustics",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Acoustics Logo`,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy | SB Acoustics",
      description: "Read the SB Acoustics Privacy Policy to understand how we collect, use, store, and protect personal information, cookies, analytics data, and other information related to your use of our website.",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Acoustics Logo`,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/privacy`,
    },
  }
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-white pt-24'>
      {children}
    </div>
  )
}
