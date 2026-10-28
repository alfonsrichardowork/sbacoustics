import prismadb from "@/lib/prismadb";
//@ts-ignore
import "@/app/css/styles.scss";
import Link from "next/link";
import { Suspense } from "react";
import { LazyImageCustom } from "@/components/lazyImageCustom";
import { LazyImageCustomNavbar } from "@/components/lazyImageCustomNavbar";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheLife } from "next/cache";
import { Dompurifyclient } from "@/components/dompurify-content";

async function getSingleApplicationData(applicationSlug: string){
  'use cache'
  cacheLife('minutes')
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
  return data;
}

type Props = {
  params: Promise<{ applicationSlug?: string }>
}

export async function generateStaticParams(){
  const app = await prismadb.sbaudienceapplication.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
    },
    select: {
      slug: true,
    },
  });
  return app.map((application: { slug: string }) => ({
    applicationSlug: application.slug
  }));
}

function SingleApplicationFallback() {
    return (
        <div className="2xl:px-60 xl:px-40 xl:py-10 lg:py-10 lg:px-12 px-8 py-8">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-4">
                <div>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="mt-3 h-5 w-1/3" />
                    <Skeleton className="mt-8 h-40 w-full" />
                    <Skeleton className="mt-12 h-5 w-2/3" />
                    <Skeleton className="mt-4 h-6 w-1/2" />
                </div>
                <div>
                    <Skeleton className="aspect-square w-full" />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="aspect-square w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SingleAppJsonLd(props: Props) {
    return (
        <Suspense fallback={<SingleApplicationFallback />}>
            <SingleAppContent params={props.params} />
        </Suspense>
    );
}

async function SingleAppContent({ params }: Props) {
    const { applicationSlug = '' } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    
    const data = await getSingleApplicationData(applicationSlug);
    
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
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-10 lg:px-12 px-8 py-8">
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
                        <Dompurifyclient content={data.description}/>
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
                    <LazyImageCustomNavbar src={data.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.cover_img_url}` : data.cover_img_url ?? '/images/sbaudience/logo_sbaudience.webp'} alt={`${data.name} - Cover`} width={500} height={500} classname="py-2 h-fit max-w-full object-contain aspect-square" lazy containerheight="h-fit" containerwidth="max-w-full"/>
                    }
                    <div className="grid grid-cols-2 w-4/5">
                        {data.images_catalogues && data.images_catalogues.length > 0 && data.images_catalogues.map((cat) => 
                        <LazyImageCustom src={cat.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cat.url}` : cat.url} alt={`${data.name} - ${cat.name}`} width={500} height={500} classname="h-fit py-2" key={`${data.name} - ${cat.name}`} lazy />
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