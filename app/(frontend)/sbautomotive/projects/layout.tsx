import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`

  return {
    title: "Projects",
    description: "Learn more about SB Automotive Projects",
    applicationName: 'SB Automotive',
    keywords: ["SB Automotive Projects"],
    openGraph: {
      title: "Projects | SB Automotive",
      description: "Learn more about SB Automotive Projects",
      url: `${baseUrl}/sbautomotive/projects`,
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
      title: "Projects | SB Automotive",
      description: "Learn more about SB Automotive Projects",
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
      canonical: `${baseUrl}/sbautomotive/projects`,
    },
  }
}

export default function ProjectsSBAutomotiveLayout({
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
