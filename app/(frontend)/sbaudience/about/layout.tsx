import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "About Us",
    description: "Learn more about SB Audience, our history, and our commitment to quality in speaker.",
    applicationName: 'SB Audience',
    keywords: ["SB Audience About Us", "Get to Know SB Audience", "SB Audience Company History", "SB Audience Quality Commitment"],
    openGraph: {
      title: "About Us | SB Audience",
      description: "Learn more about SB Audience, our history, and our commitment to quality in speaker.",
      url: `${baseUrl}/sbaudience/about`,
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
      title: "About Us | SB Audience",
      description: "Learn more about SB Audience, our history, and our commitment to quality in speaker.",
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
      canonical: `${baseUrl}/sbaudience/about`,
    },
  }
}

export default function AboutUsSBAudienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-background pt-24'>
      {children}
    </div>
  )
}
