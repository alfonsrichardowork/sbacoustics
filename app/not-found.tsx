import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="relative h-screen w-full overflow-hidden">
            <img
              src="/images/sbacoustics/not-found.png"
              alt="SB Acoustics Not Found"
              className="absolute inset-0 w-full h-full object-cover"
            />
          {/* Logo at the top-left corner */}
          <div className="absolute top-4 left-4">
              <Image
                src="/images/sbacoustics/logo_sbacoustics.png"
                alt="SB Acoustics Logo"
                className='w-32 h-fit'
                width={500}
                height={500}
                priority
              />
          </div>
          {/* Centered content */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
            <p className="text-xl md:text-2xl mb-8">Sorry! Page not found.</p>
            <Button variant="default" size="lg" asChild>
              <Link href={`/`}>
                  Go Back to SB Acoustics
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
