import { Metadata } from "next"; 

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`;

  return {
    title: `Newsletter`,
    description: `Subscribe to SB Audience Newsletter!`,
    keywords: `SB Audience Newsletter, Subscribe to Our Newsletter, Subscribe to SB Audience Newsletter, SB Audience Newsletter Subscription, SB Audience News, SB Audience Updates`,
    openGraph: {
      title: `Newsletter | SB Audience`,
      description: `Subscribe to SB Audience Newsletter!`,
      url: `${baseUrl}/sbaudience/newsletter`,
      siteName: 'SB Audience',
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Audience Logo',
        },
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: 'SB Audience Logo',
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Newsletter | SB Audience`,
      description: `Subscribe to SB Audience Newsletter!`,
      images: [
        {
          url: logo_URL,
          width: 1200,
          height: 630,
          alt: 'SB Audience Logo',
        }
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbaudience/newsletter`,
    },
  };
}

export default function NewsletterSBAudienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-24 bg-background">
        {children}
    </div>
  );
}
