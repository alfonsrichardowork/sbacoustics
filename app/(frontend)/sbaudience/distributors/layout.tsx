import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Distributors",
    description: "Find authorized SB Audience distributors around the world. Locate trusted partners in Asia, Europe, the Americas, Oceania, and other regions for genuine SB Audience speaker drivers and audio products!",
    applicationName: 'SB Audience',
       keywords: [
      "SB Audience distributors",
      "SB Audience authorized distributor",
      "SB Audience asia distributor",
      "SB Audience europe distributor",
      "SB Audience americas distributor",
      "SB Audience oceania distributor",
    ],
    openGraph: {
      title: "Distributors | SB Audience",
      description: "All SB Audience Distributors",
      url: `${baseUrl}/sbaudience/distributors`,
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
      title: "Distributors | SB Audience",
      description: "All SB Audience Distributors",
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
      canonical: `${baseUrl}/sbaudience/distributors`,
    },
  }
}

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='pt-20 bg-background'>
      {children}
    </div>
  )
}
