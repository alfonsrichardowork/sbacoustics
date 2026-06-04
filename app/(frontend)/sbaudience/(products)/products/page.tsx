import Link from "next/link";
import { LazyImageClickableSBAudience } from "@/components/lazyImageclickablesbaudience";

function createData(
  value: string,
  url: string,
  link: string,
) {
  return { url, value, link };
}

export default function SBAudienceProductChoices () {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": `${baseUrl}/sbaudience/drivers`,
    "name": "SB Audience",
    "description": `All Drivers Provided by SB Audience`,
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "url": `${baseUrl}/sbaudience/drivers`,
        "name": "SB Audience Drivers",
        "description": "Discover SB Audience Drivers",
        "image": `${baseUrl}/images/sbaudience/drivercover/compressioncover.webp`,
        "sku": "drivers",
        "brand": {
          "@type": "Brand",
          "name": "SB Audience"
        }
      }
    }]
  };
  
  const rows = [
    createData('Discover SB Audience Drivers', "/images/sbaudience/drivercover/subwoofercover.webp", '/sbaudience/drivers')
  ];
  return(
    <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 gap-4">
        <h1 className="sr-only">Drivers | SB Audience</h1>
        {rows.map((item, i) => (
          <div key={i}>
            <Link 
              href={`${item.link}`} 
              className="group cursor-pointer space-y-4 block"
            >
              <div className="relative">
                <LazyImageClickableSBAudience
                  src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                  alt={`${item.value} by SB Audience`}
                  width={1000}
                  height={1000}
                  classname={'w-fit h-60 object-contain'}
                />
              </div>
              
              <h2 className="font-bold text-xl text-center pt-4 text-foreground">{item.value}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
