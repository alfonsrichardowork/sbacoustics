import { SingleProductMetadata } from "@/app/(frontend)/types";
import prismadb from "@/lib/prismadb";
import { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: Promise<{ productSlug: string }>
}
 

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { productSlug = '' } = await props.params
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const product = await prismadb.product.findFirst({
    where: {
      slug: productSlug,
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
      isArchived: false
    },
    select: {
      name: true,
      cover_img_url: true, 
      size: true,
      slug: true,
    },
  })

  if(!product){
    return {
      title: `Product not found | SB Audience`,
    }
  }

  return {
    title: `${product.name} | SB Audience`,
    description: `Found out more about ${product.name} from SB Audience!`,
    applicationName: 'SB Audience',
    keywords: [
      product.name,
      product.slug,
    ],
    openGraph: {
      title: `${product.name} | SB Audience`,
      description: `Found out more about ${product.name} from SB Audience!`,
      url: `${baseUrl}/sbaudience/products/${product.slug}`,
      siteName: "SB Audience",
      images: [
        {
          url: `${baseUrl}${product.cover_img_url}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: 'id_ID',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | SB Audience`,
      description: `Found out more about ${product.name} from SB Audience!`,
      images: [
        {
          url: `${baseUrl}${product.cover_img_url}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/sbaudience/products/${product.slug}`,
    },
  }
}

export default function SingleProductLayoutSBAudience({
    children,
  }: {
    children: React.ReactNode
  }
)
{
  return(
    <>
      {children}
    </>
  )
  }