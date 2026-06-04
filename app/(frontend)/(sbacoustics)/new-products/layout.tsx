import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`

  return {
    title: "New Products",
    description: "All New Products by SB Acoustics",
    applicationName: 'SB Acoustics',
    keywords: ["SB Acoustics New Products", "New Products by SB Acoustics"],
    openGraph: {
      title: "New Products | SB Acoustics",
      description: "All New Products by SB Acoustics",
      url: `${baseUrl}/new-products`,
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
      title: "New Products | SB Acoustics",
      description: "All New Products by SB Acoustics",
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
      canonical: `${baseUrl}/new-products`,
    },
  }
}

export default function NewProductsPageLayout({
    children,
  }: {
    children: React.ReactNode
  }
)
{
  return(
    <>
      <div className=" w-full items-end justify-start pt-16 bg-white">
        {children}
      </div>
    </>
  )
  }