import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Catalogues",
    description: "Get to Know SB Audience Products from Our Catalogues",
    applicationName: 'SB Audience',
    keywords: ["SB Audience Catalogues", "Speaker Catalogue SB Audience", "Speaker Drivers Catalogue SB Audience", "Know more about SB Audience Products", "Download SB Audience Catalogues", "All SB Audience Catalogues"],
    openGraph: {
      title: "Catalogues | SB Audience",
      description: "Get to Know SB Audience Products from Our Catalogues",
      url: `${baseUrl}/sbaudience/catalogues`,
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
      title: "Catalogues | SB Audience",
      description: "Get to Know SB Audience Products from Our Catalogues",
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
      canonical: `${baseUrl}/sbaudience/catalogues`,
    },
  }
}

export default function CataloguesSBAudienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-background pt-16'>
      {children}
    </div>
  )
}
