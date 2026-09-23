import React, { Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/scrollToTop';
import NextTopLoader from 'nextjs-toploader';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ThemeWrapper from './providers/themeWrapper';
import { Noto_Sans } from 'next/font/google';
import LoadingWrapper from '@/components/loadingWrapper';
import { CookieProvider } from '@/lib/cookies-context';
import CookieBanner from '@/components/cookie-banner';
import { Metadata, Viewport } from 'next';
import { LoadingScreen } from '@/components/loadingScreen';

const font = Noto_Sans({ subsets: ['latin'] })


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

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${font.className} overflow-x-hidden`}>
        <Suspense fallback={<LoadingScreen isLoading={true}/>}>
        <CookieProvider>
          <ThemeWrapper>
            <LoadingWrapper>
              <ScrollToTop />
              <NextTopLoader color="#e60013" showSpinner={false} />

              <div className="fixed inset-0 w-full h-full bg-black z-[-1]">
                <div className="flex items-center justify-center h-full w-full">
                  <Image
                    src="/images/sbacoustics/logo_sbacoustics_white_catchphrase.webp"
                    alt="SB Acoustics Logo"
                    width={350}
                    height={350}
                    className="w-1/4"
                    priority
                  />
                </div>
              </div>
                <Navbar />
              <div className="contents">
                {children}
              </div>

                <Footer />
              <Toaster />
            </LoadingWrapper>
          </ThemeWrapper>

          <Suspense fallback={<></>}>
            <CookieBanner />
          </Suspense>
        </CookieProvider>
        </Suspense>
      </body>
    </html>
  )
}