// import Link from "next/link";
// import { LazyImageClickable } from "@/components/lazyImageclickable";

// function createData(
//   value: string,
//   url: string,
//   link: string,
// ) {
//   return { url, value, link };
// }

// export const revalidate = 3600;

// export default function SBAudienceProductChoices () {
//   const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     "url": `${baseUrl}/sbaudience/drivers`,
//     "name": "SB Audience",
//     "description": `All Drivers Provided by SB Audience`,
//     "itemListElement": [{
//       "@type": "ListItem",
//       "position": 1,
//       "item": {
//         "@type": "Product",
//         "url": `${baseUrl}/sbaudience/drivers`,
//         "name": "SB Audience Drivers",
//         "description": "Discover SB Audience Drivers",
//         "image": `${baseUrl}/images/sbaudience/drivercover/compressioncover.webp`,
//         "sku": "drivers",
//         "brand": {
//           "@type": "Brand",
//           "name": "SB Audience"
//         }
//       }
//     }]
//   };
  
//   const rows = [
//     createData('Discover SB Audience Drivers', "/images/sbaudience/drivercover/subwoofercover.webp", '/sbaudience/drivers')
//   ];
//   return(
//     <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       <div className="grid grid-cols-1 gap-4">
//         <h1 className="sr-only">Drivers | SB Audience</h1>
//         {rows.map((item, i) => (
//           <div key={i}>
//             <Link 
//               href={`${item.link}`} 
//               className="group cursor-pointer space-y-4 block"
//             >
//               <div className="relative aspect-square">
//                 <LazyImageClickable
//                   src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
//                   alt={`${item.value} by SB Audience`}
//                   width={1000}
//                   height={1000}
//                 />
//               </div>
              
//               <h2 className="font-bold text-xl text-center pt-4 text-foreground">{item.value}</h2>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }








import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";

export const revalidate = 3600;

export default async function SBAudienceProductPage() {
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

    const allDriver = await prismadb.allcategory.findMany({
    where: {
        type: 'Category',
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        shown_on_all_drivers_page: true,
    },
    select: {
        name: true,
        slug: true,
        thumbnail_url: true,
    },
    })


    const itemListElement = [
        ...allDriver.map((val) => ({
                "@type": "ListItem",
                "position": 1,
                "item": {
                "@type": "Product",
                "url": `${baseUrl}/sbaudience/products`,
                "name": `All ${val.name}`,
                "description": `Discover All ${val.name} by SB Audience`,
                "image": val.thumbnail_url.startsWith('/uploads/')
                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.thumbnail_url}`
                    : val.thumbnail_url,
                "sku": `all-${val.slug}`,
                "brand": {
                    "@type": "Brand",
                    "name": "SB Audience",
                },
                },
            })),
    ]

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": `${baseUrl}/sbaudience/products`,
        "name": "SB Audience",
        "description": "All Products Provided by SB Audience",
        itemListElement,
    }
    return(
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
            <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className={`grid sm:grid-cols-2 md:${allDriver.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <h1 className="sr-only">All Drivers | SB Audience</h1>
            {allDriver.length > 0 && allDriver.map((val, index) => 
                <div key={index}>
                <Link 
                    href='/sbaudience/drivers/all'
                    className=" group cursor-pointer space-y-4 block"
                >
                    <div className="relative aspect-square">
                    <LazyImageClickable
                        src={val.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.thumbnail_url}` : val.thumbnail_url} 
                        alt={`${val.name} by SB Audience`}
                        width={1000}
                        height={1000}
                    />
                    </div>
                    
                    <h2 className="font-bold text-xl text-center">All {val.name}</h2>
                </Link>
                </div>
            )}
            </div>
        </div>
    );
}

