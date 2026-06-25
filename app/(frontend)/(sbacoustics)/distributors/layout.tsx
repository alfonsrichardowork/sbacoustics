import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Distributors",
    description: "Find authorized SB Acoustics distributors around the world. Locate trusted partners in Asia, Europe, the Americas, Oceania, and other regions for genuine SB Acoustics speaker drivers and audio products!",
    applicationName: 'SB Acoustics',
    keywords: [
      "SB Acoustics distributors",
      "SB Acoustics authorized distributor",
      "SB Acoustics asia distributor",
      "SB Acoustics europe distributor",
      "SB Acoustics americas distributor",
      "SB Acoustics oceania distributor",
    ],
    openGraph: {
      title: "Distributors | SB Acoustics",
      description: "Find authorized SB Acoustics distributors around the world. Locate trusted partners in Asia, Europe, the Americas, Oceania, and other regions for genuine SB Acoustics speaker drivers and audio products!",
      url: `${baseUrl}/distributors`,
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
      title: "Distributors | SB Acoustics",
      description: "Find authorized SB Acoustics distributors around the world. Locate trusted partners in Asia, Europe, the Americas, Oceania, and other regions for genuine SB Acoustics speaker drivers and audio products!",
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
      canonical: `${baseUrl}/distributors`,
    },
  }
}

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='pt-20 bg-white'>
      {children}
    </div>
  )
}
