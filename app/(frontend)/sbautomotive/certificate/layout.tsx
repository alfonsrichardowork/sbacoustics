import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  return {
    title: "Certificate of Authenticity",
    description: "Certificate of Authenticity",
    applicationName: 'SB Automotive',
    keywords: ["SB Automotive Certificate of Authenticity"],
    alternates: {
      canonical: `${baseUrl}/sbautomotive/certificate`,
    },
  }
}

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='pt-12 bg-white'>
      {children}
    </div>
  )
}
