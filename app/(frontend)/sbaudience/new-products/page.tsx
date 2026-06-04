import prismadb from '@/lib/prismadb';
import Link from "next/link";
import { LazyImageClickable } from "@/components/lazyImageclickable";

export default async function NewProductsSBAudiencePage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const products = await prismadb.product.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
      isArchived: false,
      isNewProduct: true
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      cover_img_url: true,
      name: true,
      slug: true,
    }
  });
  if(!products) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `New Products | SB Audience`,
    "url": `${baseUrl}/sbaudience/new-products`,
    "logo": `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
    "description": `All New Products by SB Audience`,
    "itemListElement": products.map((driver, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": `${baseUrl}/products/${driver.slug}`,
        "name": driver.name,
        "description": driver.name,
        "image": `${baseUrl}${driver.cover_img_url}`,
        "sku": driver.name,
        "brand": {
          "@type": "Brand",
          "name": "SB Audience",
        }
      }
    }))
  };

  return(
    <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((item, i) => (
          <div key={i} className="px-2 pt-12 relative">
            <Link
              href={`/sbaudience/products/${item.slug}`}
              className="bg-white group cursor-pointer"
            >  

              <div className="flex flex-col items-center justify-center text-center relative p-4" style={{ aspectRatio: "1/1" }}>
            
                <LazyImageClickable
                  src={item.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover_img_url}` : item.cover_img_url}
                  alt={item.name}
                  width={500}
                  height={500}
                />
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-lg lg:text-xl font-bold text-center pb-2 z-10">
                  {item.name}
                </h2>
              </div>
            </Link>
            
          </div>
        ))}
      </div>
    </div>
  );
}
