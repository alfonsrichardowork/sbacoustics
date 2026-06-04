import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "About Us",
    description: "Learn more about SB Acoustics, our history, and our commitment to quality in speaker.",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics About Us", "Get to Know SB Acoustics", "SB Acoustics Company History", "SB Acoustics Quality Commitment"],
    openGraph: {
      title: "About Us | SB Acoustics",
      description: "Learn more about SB Acoustics, our history, and our commitment to quality in speaker.",
      url: `${baseUrl}/aboutus`,
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
      title: "About Us | SB Acoustics",
      description: "Learn more about SB Acoustics, our history, and our commitment to quality in speaker.",
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
      canonical: `${baseUrl}/aboutus`,
    },
  }
}

export default function AboutUsLayout({
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
