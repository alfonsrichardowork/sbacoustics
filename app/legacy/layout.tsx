import React, { Suspense } from 'react'
import { Noto_Sans } from 'next/font/google';
import NavbarSimpleOld from './components/navbarSimpleOld';
import FooterOld from './components/footerOld';
import { CookieProvider } from '@/lib/cookies-context';
import { connection } from 'next/server';


const font = Noto_Sans({ subsets: ['latin'] })
export const instant = false

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection()

  return (
    <html lang="en">
      <body 
        className={font.className.concat(" overflow-x-hidden")}
      >
        <Suspense fallback={<></>}>
          <CookieProvider>
            <NavbarSimpleOld/>
            {children}
            <FooterOld />
          </CookieProvider>
        </Suspense>
      </body>
    </html>
  )
}
