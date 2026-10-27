import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Comparison",
    description: "View Selected Comparison",
    applicationName: 'SB Audience',
    keywords: ["SB Audience Comparison", "Compare Selected SB Audience Product", "Compare Specifications of selected SB Audience Products"],
    openGraph: {
      title: "Comparison | SB Audience",
      description: "View Selected Comparison",
      url: `${baseUrl}/sbaudience/comparison`,
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
      title: "Comparison | SB Audience",
      description: "View Selected Comparison",
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
      canonical: `${baseUrl}/sbaudience/comparison`,
    },
  }
}

export default function ComparisonLayoutSBAudience({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <div className='pt-24 bg-background'>
            {children}
        </div>
    </>
  )
}
