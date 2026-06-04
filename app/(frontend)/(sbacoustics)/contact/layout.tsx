import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Contact",
    description: "Contact SB Acoustics to ask about our products, distributors, and more.",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Contact", "Contact Us SB Acoustics", "Ask about SB Acoustics Products", "Ask about SB Acoustics Distributors"],
    openGraph: {
      title: "Contact | SB Acoustics",
      description: "Contact SB Acoustics to ask about our products, distributors, and more.",
      url: `${baseUrl}/contact`,
      siteName: "SB Acoustics",
      images: [
        // {
        //   url: logo_URL,
        //   width: 1200,
        //   height: 630,
        //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
        // },
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
      title: "Contact | SB Acoustics",
      description: "Contact SB Acoustics to ask about our products, distributors, and more.",
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
      canonical: `${baseUrl}/contact`,
    },
  }
}

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-white'>
      {children}
    </div>
  )
}
