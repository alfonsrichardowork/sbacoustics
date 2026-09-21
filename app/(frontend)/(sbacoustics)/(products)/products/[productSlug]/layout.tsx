import prismadb from "@/lib/prismadb"
import { Metadata } from "next"
import { cacheLife } from "next/cache"

type Props = {
  params: Promise<{ productSlug: string }>
}


async function getOneDriverMetadataData(productSlug: string){
  'use cache'
  cacheLife('minutes')

  const product = await prismadb.product.findFirst({
    where: {
      slug: productSlug,
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      isArchived: false
    },
    select: {
      name: true,
      cover_img_url: true, 
      size: true,
      slug: true,
    },
  })

  return product;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { productSlug = '' } = await props.params
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const product = await getOneDriverMetadataData(productSlug)
  if(!product){
    return {
      title: `Product not found | SB Acoustics`,
    }
  }

  return {
    title: `${product.name} | SB Acoustics`,
    description: `Found out more about ${product.name} from SB Acoustics!`,
    applicationName: 'SB Acoustics',
    keywords: [
      product.name,
      product.slug,
      product.size.value !== '-' ? `${product.size.value} driver` : undefined
    ].filter((keyword): keyword is string => Boolean(keyword)),
    openGraph: {
      title: `${product.name} | SB Acoustics`,
      description: `Found out more about ${product.name} from SB Acoustics!`,
      url: `${baseUrl}/products/${product.slug}`,
      siteName: "SB Acoustics",
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
      title: `${product.name} | SB Acoustics`,
      description: `Found out more about ${product.name} from SB Acoustics!`,
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
      canonical: `${baseUrl}/products/${product.slug}`,
    },
  }
}

export default function SingleProductLayout({
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