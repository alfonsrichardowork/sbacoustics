import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Catalogues",
    description: "Get to Know SB Acoustics Products from Our Catalogues",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Catalogues", "Speaker Kits Catalogue SB Acoustics", "Speaker Drivers Catalogue SB Acoustics", "Know more about SB Acoustics Products", "Download SB Acoustics Catalogues", "All SB Acoustics Catalogues"],
    openGraph: {
      title: "Catalogues | SB Acoustics",
      description: "Get to Know SB Acoustics Products from Our Catalogues",
      url: `${baseUrl}/catalogues`,
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
      title: "Catalogues | SB Acoustics",
      description: "Get to Know SB Acoustics Products from Our Catalogues",
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
      canonical: `${baseUrl}/catalogues`,
    },
  }
}

export default function CataloguesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-white pt-16'>
      {children}
    </div>
  )
}
