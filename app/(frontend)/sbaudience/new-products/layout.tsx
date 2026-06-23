import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`

  return {
    title: "New Products",
    description: "All New Products by SB Audience",
    applicationName: 'SB Audience',
    keywords: ["SB Audience New Products", "New Products by SB Audience"],
    openGraph: {
      title: "New Products | SB Audience",
      description: "All New Products by SB Audience",
      url: `${baseUrl}/sbaudience/new-products`,
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
      title: "New Products | SB Audience",
      description: "All New Products by SB Audience",
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
      canonical: `${baseUrl}/sbaudience/new-products`,
    },
  }
}

export default function NewProductsSBAudiencePageLayout({
    children,
  }: {
    children: React.ReactNode
  }
)
{
  return(
    <>
      <div className=" w-full items-end justify-start pt-24 bg-background">
        {children}
      </div>
    </>
  )
  }