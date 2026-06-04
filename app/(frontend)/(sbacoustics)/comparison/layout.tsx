import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Comparison",
    description: "View Selected Comparison",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics Comparison", "Compare Selected SB Acoustics Product", "Compare Specifications of selected SB Acoustics Products"],
    openGraph: {
      title: "Comparison | SB Acoustics",
      description: "View Selected Comparison",
      url: `${baseUrl}/comparison`,
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
      title: "Comparison | SB Acoustics",
      description: "View Selected Comparison",
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
      canonical: `${baseUrl}/comparison`,
    },
  }
}

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <div className='pt-16 bg-white'>
            {children}
        </div>
    </>
  )
}
