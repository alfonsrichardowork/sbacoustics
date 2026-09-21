import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Sign in to the admin dashboard',
}

export default function SignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}