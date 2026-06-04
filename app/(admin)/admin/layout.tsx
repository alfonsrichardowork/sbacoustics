import { Inter } from 'next/font/google'

import { ModalProvider } from '@/app/(admin)/admin/providers/modal-provider'
import { ThemeProvider } from '@/app/(admin)/admin/providers/theme-provider'

import { ToastProvider } from '@/app/(admin)/admin/providers/toast-provider'
import { Toaster } from '@/components/ui/toaster'

const font = Inter({ subsets: ['cyrillic'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'All Admin Dashboard',
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${font.className || ''} overflow-x-hidden bg-foreground/5 `}>
        <div className='h-screen'>
          <ToastProvider />
          <ModalProvider />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
