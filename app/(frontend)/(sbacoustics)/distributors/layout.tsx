import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Distributors",
    description: "All SB Acoustics Distributors",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Distributors", "All SB Acoustics Distributors"],
    openGraph: {
      title: "Distributors | SB Acoustics",
      description: "All SB Acoustics Distributors",
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
      description: "All SB Acoustics Distributors",
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
    <div className='pt-12 bg-white'>
      {children}
    </div>
  )
}
