
import { Metadata } from "next"
import prismadb from "@/lib/prismadb";

type Props = {
  params: Promise<{ applicationSlug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const logo_URL = `${baseUrl}/images/sbaudience/logo_sbaudience.webp`
  const { applicationSlug = '' } = await props.params

  const app = await prismadb.sbaudienceapplication.findFirst({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
      slug: applicationSlug
    },
    select: {
      name: true,
      slug: true,
    }
  });

  if(!app) {
    return {
      title: `Application Not Found | SB Audience`,
    }
  }

  return {
    title: `${app.name} | SB Audience`,
    description: `${app.name} by SB Audience`,
    applicationName: 'SB Audience',
    keywords: [`${app.name}`, `${app.name} Provided by SB Audience`],
    openGraph: {
      title: `${app.name} | SB Audience`,
      description: `${app.name} Provided by SB Audience`,
      url: `${baseUrl}/sbaudience/application/${app.slug}`,
      siteName: "SB Audience",
      images: [
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
      title: `${app.name} | SB Audience`,
      description: `${app.name} Provided by SB Audience`,
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
      canonical: `${baseUrl}/sbaudience/application/${app.slug}`,
    },
  }
}

export default function SingleAppLayout({
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