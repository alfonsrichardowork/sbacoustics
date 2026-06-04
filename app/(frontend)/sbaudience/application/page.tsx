import prismadb from "@/lib/prismadb";
import { LazyImageClickableSBAudience } from "@/components/lazyImageclickablesbaudience";
import Link from "next/link";

export default async function AllApplicationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const app = await prismadb.sbaudienceapplication.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": `${baseUrl}/sbaudience/application`, 
    "name": `All Applications | SB Audience`,
    "description": `Found out more about All Application from SB Audience!`,
    "itemListElement": app.map((item, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
        "@type": "Product",
        "name": item.name,
        "description": `Found out more about ${item.name} from SB Audience!`,
        "image": item.cover_img_url
            ? `${baseUrl}${item.cover_img_url}`
            : "",
        "sku": item.slug || item.id,
        "brand": {
            "@type": "Brand",
            "name": "SB Audience"
        },
        "url": item.slug
            ? `${baseUrl}/sbaudience/application/${item.slug}`
            : `${baseUrl}/sbaudience/application`
        }
    })),
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/sbaudience/application`
    }
  };

  return (
      <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        /> 
        <h1 className='text-3xl font-bold mt-8 flex justify-center'>Applications</h1>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {app && app.length > 0 && app.map((item, i) => (
            <div key={i}>
            <Link
                href={`/sbaudience/application/${item.slug}`} 
                className=" group cursor-pointer space-y-4 block"
            >
                <div className="relative">
                <LazyImageClickableSBAudience
                    src={item.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover_img_url}` : item.cover_img_url ?? '/images/sbaudience/logo_sbaudience.webp'} 
                    alt={`${item.name} by SB Audience`}
                    width={500}
                    height={500}
                    classname={'w-4/5 h-full object-contain'}
                />
                </div>
                
                <h2 className="font-bold text-xl text-center">{item.name}</h2>
            </Link>
            </div>
        ))}
      </div>
    </div>
  );
}
