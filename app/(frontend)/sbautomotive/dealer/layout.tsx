import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`

  return {
    title: "Dealer",
    description: "Find out more about SB Automotive Dealer",
    applicationName: 'SB Automotive',
    keywords: ["SB Automotive Dealer"],
    openGraph: {
      title: "Dealer | SB Automotive",
      description: "Find out more about SB Automotive Dealer",
      url: `${baseUrl}/sbautomotive/dealer`,
      siteName: "SB Automotive",
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
          alt: `SB Automotive Logo`,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Dealer | SB Automotive",
      description: "Find out more about SB Automotive Dealer",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Automotive Logo`,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbautomotive/dealer`,
    },
  }
}

export default function DealerSBAutomotiveLayout({
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
