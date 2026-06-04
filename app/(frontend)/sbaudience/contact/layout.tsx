import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Contact",
    description: "Contact SB Audience to ask about our products, distributors, and more.",
    applicationName: 'SB Audience',
    keywords: ["SB Audience Contact", "Contact Us SB Audience", "Ask about SB Audience Products", "Ask about SB Audience Distributors"],
    openGraph: {
      title: "Contact | SB Audience",
      description: "Contact SB Audience to ask about our products, distributors, and more.",
      url: `${baseUrl}/sbaudience/contact`,
      siteName: "SB Audience",
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
          alt: `SB Audience Logo`,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact | SB Audience",
      description: "Contact SB Audience to ask about our products, distributors, and more.",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Audience Logo`,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbaudience/contact`,
    },
  }
}

export default function ContactUsSBAudienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-background'>
      {children}
    </div>
  )
}
