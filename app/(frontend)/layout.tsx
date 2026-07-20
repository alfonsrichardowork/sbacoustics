
import React from 'react'
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/scrollToTop';
import NextTopLoader from 'nextjs-toploader';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ThemeWrapper from './providers/themeWrapper';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Noto_Sans } from 'next/font/google';
import LoadingWrapper from '@/components/loadingWrapper';
import { CookieProvider } from '@/lib/cookies-context';
import CookieBanner from '@/components/cookie-banner';
import { headers } from 'next/headers';

const font = Noto_Sans({ subsets: ['latin'] })

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-XYZ'
  const h = await headers();

  const osName = h.get('x-os-name');
  const osVersion = h.get('x-os-version');
  
  const unsupported =
    osName === 'iOS' && osVersion
      ? parseFloat(osVersion) < 16.4
      : false
  return (
    <html lang="en">
      <body 
        className={font.className.concat(" overflow-x-hidden")}
      >      
          <CookieProvider>
            <ThemeWrapper>
              <LoadingWrapper
                unsupported={unsupported}
              >
                <ScrollToTop />
                  <NextTopLoader color="#e60013" showSpinner={false} />
                  {/* PLACEHOLDER BACKGROUND IMAGE PALING BELAKANG */}
                  <div className="fixed inset-0 w-dvw h-dvh bg-black z-[-1]">
                    <div className='flex items-center justify-center h-full w-full'>   
                      <Image
                        src='/images/sbacoustics/logo_sbacoustics_white_catchphrase.webp'
                        alt='SB Acoustics Logo'
                        width={1000}
                        height={1000}
                        className="w-1/4"
                        priority
                      /> 
                    </div> 
                  </div>
                  <Navbar
                    unsupported={unsupported}
                  />
                  <div className="contents">
                    {children}
                  </div>
                  <Footer />
                  <Toaster />
                </LoadingWrapper>
              </ThemeWrapper>
            <CookieBanner />
          </CookieProvider>
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  )
}
