
import prismadb from "@/lib/prismadb";
//@ts-ignore
import "@/app/css/styles.scss";
import DOMPurify from 'isomorphic-dompurify'; 
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{ applicationSlug?: string }>
}

// export const revalidate = 86400

// export async function generateStaticParams(){
//   const brandId = process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
//   const API = `${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_APPLICATION}`
//   const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
//   const res = await fetch(API_EDITED_BRANDID,
//     { next: { revalidate: 86400 } } 
//   );
//   const apps = await res.json();
//   return apps.map((app: { slug: string }) => ({
//     applicationSlug: app.slug
//   }));
// }

export default async function SingleAppJsonLd(props: Props) {
    const { applicationSlug = '' } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    const data = await prismadb.sbaudienceapplication.findFirst({
        where: {
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        slug: applicationSlug
        },
        include: {
            datasheet: true,
            images_catalogues: true,
        }
    });

    if(!data){
        return null
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "SB Audience Applications",
        "item": {
        "@type": "Product",
        "name": data.name,
        "description": `Found out more about ${data.name} from SB Audience!`,
        "image": data.cover_img_url
            ? `${baseUrl}${data.cover_img_url}`
            : "",
        "sku": data.slug || data.id,
        "brand": {
            "@type": "Brand",
            "name": "SB Audience"
        },
        "url": data.slug
            ? `${baseUrl}/sbaudience/application/${data.slug}`
            : `${baseUrl}/sbaudience/application`
        },
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
            {data && 
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                    {data.name}
                    </h1>
                    <h2><i>by {data.author}</i></h2>
                    <div className="pt-8">
                    <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description, {
                        ALLOWED_TAGS: [
                            'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                        ],
                        ALLOWED_ATTR: [
                            'href', 'target', 'rel', 'class', 'id', 'style'
                        ],
                    }) }}>
                    </h3>
                    <Link href={data.datasheet[0]?.url ?? ''} target="_blank" className="text-primary underline hover:text-primary/70">read more in pdf file.</Link>
                    </div>
                    
                    <div className="pt-12">
                    {`For the full article download the pdf:`}
                    </div>
                    <div className="pt-4">
                    <Link href={data.datasheet[0]?.url ?? ''} target="_blank" className="text-primary underline hover:text-primary/70">{data.name}</Link>
                    </div>
                </div>

                <div className="gap-4">
                    {data.cover_img_url !== '' && 
                    <Image src={data.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.cover_img_url}` : data.cover_img_url ?? '/images/sbaudience/logo_sbaudience.webp'} alt={`${data.name} - Cover`} width={500} height={500} className="w-4/5 h-fit py-2" />
                    }
                    <div className="grid grid-cols-2 w-4/5">
                        {data.images_catalogues && data.images_catalogues.length > 0 && data.images_catalogues.map((cat) => 
                        <Image src={cat.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cat.url}` : cat.url} alt={`${data.name} - ${cat.name}`} width={500} height={500} className="h-fit py-2" key={`${data.name} - ${cat.name}`} />
                        )}
                    </div>
                    {/* {data.images_catalogues && data.images_catalogues.length > 0 && 
                     <SwiperCarouselApplication url={data.images_catalogues.map((cat) => cat.url)} name={data.name} catName={data.images_catalogues[0]?.name || 'Catalogue'} />
                    } */}
                </div>
                </div>
            }
        </div>
    );
}