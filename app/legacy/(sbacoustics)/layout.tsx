import React from 'react'
import { Noto_Sans } from 'next/font/google';
import NavbarSimpleOld from '../components/navbarSimpleOld';
import FooterOld from '../components/footerOld';
import { CookieProvider } from '@/lib/cookies-context';
// import NavbarOld from './components/navbarOld';
const font = Noto_Sans({ subsets: ['latin'] })

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={font.className.concat(" overflow-x-hidden")}
      >
        <CookieProvider>
          <NavbarSimpleOld/>
            {children}
          <FooterOld />
        </CookieProvider>
      </body>
    </html>
  )
}
