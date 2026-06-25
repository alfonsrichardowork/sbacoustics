//@ts-ignore
import './globals.css'
import React from 'react'
import { Metadata, Viewport } from 'next';


export const viewport : Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1,
  userScalable: false,
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  return {
    title: 'SB Acoustics | Building Your Sound',
    description: 'Explore premium speaker drivers, tweeters, woofers, subwoofers, and open-source DIY speaker kits from SB Acoustics. Browse our full catalogue and build exceptional sound systems!',
    keywords: [
      "SB Acoustics",
      "speaker drivers",
      "diy speaker kits",
      "hifi drivers",
      "widebanders",
      "full ranges",
      "midranges",
      "midwoofers",
      "shallow subwoofers",
      "tweeters",
      "woofers",
      "subwoofers",
      "passive radiators",
      "coaxials",
      "oem drivers",
      "speaker components",
      "diy speakers",
      "audio drivers",
      "speaker catalogue",
      "premium speaker drivers",
      "building your sound"
    ],
    openGraph: {
      title: 'SB Acoustics | Building Your Sound',
      description: 'Explore premium speaker drivers, tweeters, woofers, subwoofers, and open-source DIY speaker kits from SB Acoustics. Browse our full catalogue and build exceptional sound systems!',
      url: `${baseUrl}`,
      siteName: 'SB Acoustics',
      images: [
        {
          url: `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
          width: 1200,
          height: 630,
          alt: 'SB Acoustics Logo',
        },
        {
          url: `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
          width: 800,
          height: 800,
          alt: 'SB Acoustics Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SB Acoustics | Building Your Sound',
      description: 'Explore premium speaker drivers, tweeters, woofers, subwoofers, and open-source DIY speaker kits from SB Acoustics. Browse our full catalogue and build exceptional sound systems!',
      images: [
        {
          url: `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
          width: 800,
          height: 800,
          alt: 'SB Acoustics Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: `${baseUrl}/favicon.ico`,
      shortcut: `${baseUrl}/favicon.ico`,
      apple: `${baseUrl}/apple-touch-icon.png`,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
