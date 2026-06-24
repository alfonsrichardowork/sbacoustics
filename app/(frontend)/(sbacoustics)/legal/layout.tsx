import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Terms of Use",
    description: "Read the SB Acoustics Terms of Use to understand the conditions, limitations, and responsibilities that apply when accessing and using our website and its content.",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Terms of Use", "SB Acoustics Legal"],
    openGraph: {
      title: "Terms of Use | SB Acoustics",
      description: "Read the SB Acoustics Terms of Use to understand the conditions, limitations, and responsibilities that apply when accessing and using our website and its content.",
      url: `${baseUrl}/legal`,
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
      title: "Terms of Use | SB Acoustics",
      description: "Read the SB Acoustics Terms of Use to understand the conditions, limitations, and responsibilities that apply when accessing and using our website and its content.",
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
      canonical: `${baseUrl}/legal`,
    },
  }
}

export default function LegalLayout({
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
