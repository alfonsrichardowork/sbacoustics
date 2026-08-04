
// import React from 'react'
// import { Toaster } from '@/components/ui/toaster';
// import ScrollToTop from '@/components/scrollToTop';
// import NextTopLoader from 'nextjs-toploader';
// import Image from 'next/image';
// import Navbar from '@/components/navbar';
// import Footer from '@/components/footer';
// import ThemeWrapper from './providers/themeWrapper';
// import { GoogleAnalytics } from '@next/third-parties/google';
// import { Noto_Sans } from 'next/font/google';
// import LoadingWrapper from '@/components/loadingWrapper';
// import { CookieProvider } from '@/lib/cookies-context';
// import CookieBanner from '@/components/cookie-banner';
// import { headers } from 'next/headers';

// const font = Noto_Sans({ subsets: ['latin'] })

// export default async function Layout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-XYZ'
//   const h = await headers();

//   const osName = h.get('x-os-name');
//   const osVersion = h.get('x-os-version');
  
//   const unsupported =
//     osName === 'iOS' && osVersion
//       ? parseFloat(osVersion) < 16.4
//       : false
//   return (
//     <html lang="en">
//       <body 
//         className={font.className.concat(" overflow-x-hidden")}
//       >      
//           <CookieProvider>
//             <ThemeWrapper>
//               <LoadingWrapper
//                 unsupported={unsupported}
//               >
//                 <ScrollToTop />
//                   <NextTopLoader color="#e60013" showSpinner={false} />
//                   {/* PLACEHOLDER BACKGROUND IMAGE PALING BELAKANG */}
//                   <div className="fixed inset-0 w-dvw h-dvh bg-black z-[-1]">
//                     <div className='flex items-center justify-center h-full w-full'>   
//                       <Image
//                         src='/images/sbacoustics/logo_sbacoustics_white_catchphrase.webp'
//                         alt='SB Acoustics Logo'
//                         width={1000}
//                         height={1000}
//                         className="w-1/4"
//                         priority
//                       /> 
//                     </div> 
//                   </div>
//                   <Navbar
//                     unsupported={unsupported}
//                   />
//                   <div className="contents">
//                     {children}
//                   </div>
//                   <Footer />
//                   <Toaster />
//                 </LoadingWrapper>
//               </ThemeWrapper>
//             <CookieBanner />
//           </CookieProvider>
//       </body>
//       <GoogleAnalytics gaId={GA_ID} />
//     </html>
//   )
// }




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
import { DeviceProvider } from './providers/device-provider';
// import { headers } from 'next/headers';

const font = Noto_Sans({ subsets: ['latin'] })

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-XYZ'
  // const h = await headers();

  // const osName = h.get('x-os-name');
  // const osVersion = h.get('x-os-version');
  
  // const unsupported =
  //   osName === 'iOS' && osVersion
  //     ? parseFloat(osVersion) < 16.4
  //     : false
  return (
    <html lang="en">
      {/* <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          #instant-loader { animation: pulse 2s ease-in-out infinite; }
        `}} />
      </head> */}
      <body 
        className={font.className.concat(" overflow-x-hidden")}
      >
        <DeviceProvider>
        {/* <div id="loader-container" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <svg
            id="instant-loader"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 176 153"
            style={{ width: '16px', height: '16px' }}
          >
            <path
              d="M0 0 C58.08 0 116.16 0 176 0 C168.04306743 14.58770971 159.99399553 29.07907684 151.59350586 43.4152832 C147.03272745 51.20663842 142.53343546 59.03186559 138.0625 66.875 C132.29101034 76.99812268 126.48716181 87.10190394 120.65576172 97.19067383 C116.32013536 104.69727619 112.014559 112.2205074 107.72076416 119.75106812 C104.81951661 124.83729148 101.9112006 129.91946751 99 135 C98.45843262 135.94520508 97.91686523 136.89041016 97.35888672 137.86425781 C95.95401119 140.30912959 94.54152237 142.74936291 93.125 145.1875 C92.72627686 145.88238525 92.32755371 146.57727051 91.91674805 147.29321289 C89.23180774 151.88409613 89.23180774 151.88409613 87 153 C86.39079712 151.93193115 86.39079712 151.93193115 85.76928711 150.84228516 C75.89422891 133.53359871 65.97099316 116.25365115 56 99 C48.30415865 85.68323608 40.62381775 72.3581331 33 59 C27.7262406 49.76046075 22.43863536 40.52919052 17.125 31.3125 C16.50810303 30.24193359 15.89120605 29.17136719 15.25561523 28.06835938 C12.4756489 23.25289353 9.68175485 18.44717755 6.83984375 13.66796875 C6.36595215 12.87028076 5.89206055 12.07259277 5.40380859 11.25073242 C4.5372144 9.79657664 3.66671296 8.34473906 2.79150391 6.89575195 C0 2.2181456 0 2.2181456 0 0 Z"
              fill="#E52028"
            />
          </svg>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.hideInitialLoader = function() {
            const loaderContainer = document.getElementById('loader-container');
            if (loaderContainer) {
              loaderContainer.style.transition = 'opacity 0.3s ease-out';
              loaderContainer.style.opacity = '0';
              loaderContainer.style.pointerEvents = 'none';
              setTimeout(() => {
                if (loaderContainer && loaderContainer.parentNode) {
                  loaderContainer.remove();
                }
              }, 300);
            }
          };
        `}} />       */}
        <CookieProvider>
          <ThemeWrapper>
            <LoadingWrapper>
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
                unsupported={false}
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
        </DeviceProvider>
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  )
}
