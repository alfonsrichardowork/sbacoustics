import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "Drivers and Kits",
    description: "All Drivers and Kits Products Provided by SB Acoustics",
    applicationName: 'SB Acoustics',
    keywords: ["All SB Acoustics Drivers", "All SB Acoustics Kits", "All Drivers Provided by SB Acoustics", "All Kits Provided by SB Acoustics"],
    openGraph: {
      title: "Drivers and Kits | SB Acoustics",
      description: "All Drivers and Kits Products Provided by SB Acoustics",
      url: `${baseUrl}/products`,
      siteName: "SB Acoustics",
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
          alt: `SB Acoustics Logo`,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Drivers and Kits | SB Acoustics",
      description: "All Drivers and Kits Products Provided by SB Acoustics",
      images: [
        {
          url: logo_URL,
          width: 800,
          height: 800,
          alt: `SB Acoustics Logo`,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/products`,
    },
  }
}

export default function ProductSBAcousticsChoiceLayout({
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