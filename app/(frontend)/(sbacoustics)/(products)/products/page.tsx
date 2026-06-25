import Link from "next/link";
import { LazyImageClickable } from "@/components/lazyImageclickable";

function createData(
  value: string,
  url: string,
  link: string,
) {
  return { url, value, link };
}

export const revalidate = 3600;

export default function SBAcousticsProductChoices () {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": `${baseUrl}/products`,
    "name": "SB Acoustics",
    "description": `All Drivers and Kits Products Provided by SB Acoustics`,
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "url": `${baseUrl}/drivers`,
        "name": "SB Acoustics Drivers",
        "description": "Discover SB Acoustics Drivers",
        "image": `${baseUrl}/images/sbacoustics/drivercover/tweeterscover.webp`,
        "sku": "drivers",
        "brand": {
          "@type": "Brand",
          "name": "SB Acoustics"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "url": `${baseUrl}/kits`,
        "name": "SB Acoustics Kits",
        "description": "Discover SB Acoustics Kits",
        "image": `${baseUrl}/images/sbacoustics/kitscover/sbacousticskitscover.jpg`,
        "sku": "kits",
        "brand": {
          "@type": "Brand",
          "name": "SB Acoustics"
        }
      }
    }]
  };
  
  const rows = [
    createData('Discover SB Acoustics Drivers', "/images/sbacoustics/drivercover/DiscoverSBAcousticsdrivers.webp", '/drivers'),
    createData('Discover SB Acoustics Kits', "/images/sbacoustics/kitscover/DiscoverSBAcousticskits.webp", '/kits'),
  ];
  return(
    <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-2 gap-4">
        <h1 className="sr-only">Drivers and Kits | SB Acoustics</h1>
        {rows.map((item, i) => (
          <div key={i}>
            <Link 
              href={`${item.link}`} 
              className="group cursor-pointer space-y-4 block"
            >
              <div className="relative aspect-square">
                <LazyImageClickable
                  src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                  alt={`${item.value} by SB Acoustics`}
                  width={1000}
                  height={1000}
                />
              </div>
              
              <h2 className="font-bold text-xl text-center pt-4">{item.value}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
