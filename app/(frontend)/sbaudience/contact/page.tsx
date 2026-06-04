import prismadb from "@/lib/prismadb";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Image } from "lucide-react";
import Contact from "@/components/contact";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";

export function extractIframeSrc(html: string): string | undefined {
  const match = html.match(/<iframe[^>]+src="([^"]+)"/i);
  return match?.[1];
}

export default async function ContactUsJsonLd() {
  const brand = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    }
  });
  if(!brand){
    return null;
  }
  const extractedSrc = extractIframeSrc(brand.maps) ?? '';
  brand.maps = extractedSrc;
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `Contact | SB Audience`,
    "url": `${baseUrl}/sbaudience/contact`,
    "logo": `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
    "description":"Contact SB Audience to ask about our products, distributors, and more.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": `${brand.telephone}`,
        "contactType": `${brand.name}`
      }
    ]
  }

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Contact | SB Audience</h1>
      <div className="relative pb-[420px]">
        <div className="absolute inset-0 z-0">
          {brand && brand.cover != "" ?
            <img 
                src={brand.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brand.cover}` : brand.cover } 
                alt="Sinar Baja Electric Facility" 
                width={1000} 
                height={1000} 
                className="w-screen h-[600px] object-cover object-center"
            />
            :
            <Empty className='w-screen min-h-[600px] z-10 bg-foreground/20'>
              <EmptyMedia variant="icon">
                <Image />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>No Cover Image Available</EmptyTitle>
                <EmptyDescription></EmptyDescription>
              </EmptyContent>
            </Empty>
          }
        </div>
        <div className="relative z-10 top-96">
          <GoogleCaptchaWrapper>
            <Contact oneBrand={brand}/>
          </GoogleCaptchaWrapper>
        </div>
      </div>
    </>
  );
}
