import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "Drivers",
    description: "All Drivers Provided by SB Audience",
    applicationName: 'SB Audience',
    keywords: ["All SB Audience Drivers", "All Drivers Provided by SB Audience"],
    openGraph: {
      title: "Drivers | SB Audience",
      description: "All Drivers Provided by SB Audience",
      url: `${baseUrl}/sbaudience/products`,
      siteName: "SB Audience",
      images: [
        // {
        //   url: logo_URL,
        //   width: 1200,
        //   height: 630,
        //   alt: subCatName.name.concat(" ", seriesName.name," Series"),
        // },
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Audience Logo`,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Drivers | SB Audience",
      description: "All Drivers Provided by SB Audience",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Audience Logo`,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbaudience/products`,
    },
  }
}

export default function ProductSBAudienceChoiceLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <>
          {children}
        </>
    )
}