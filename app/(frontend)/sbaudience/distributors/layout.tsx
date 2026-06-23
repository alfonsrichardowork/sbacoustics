import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Distributors",
    description: "All SB Audience Distributors",
    applicationName: 'SB Audience',
    keywords: ["SB Audience Distributors", "All SB Audience Distributors"],
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
