import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`;

  return {
    title: `Newsletter`,
    description: `Subscribe to SB Acoustics Newsletter!`,
    keywords: `SB Acoustics Newsletter, Subscribe to Our Newsletter, Subscribe to SB Acoustics Newsletter, SB Acoustics Newsletter Subscription, SB Acoustics News, SB Acoustics Updates`,
    openGraph: {
      title: `Newsletter | SB Acoustics`,
      description: `Subscribe to SB Acoustics Newsletter!`,
      url: `${baseUrl}/newsletter`,
      siteName: 'SB Acoustics',
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Acoustics Logo',
        },
        {
          url: logo_URL,
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
      title: `Newsletter | SB Acoustics`,
      description: `Subscribe to SB Acoustics Newsletter!`,
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Acoustics Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}/newsletter`,
    },
  };
}

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 bg-white">
        {children}
    </div>
  );
}
