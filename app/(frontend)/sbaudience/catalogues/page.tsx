import prismadb from "@/lib/prismadb";
import { LazyImage } from "@/components/lazyImage";
import Link from "next/link";
import Image from "next/image";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileText } from "lucide-react";

export const revalidate = 3600;

export default async function CataloguesSBAudienceJsonLd() {
  const pdfFiles = await prismadb.catalogues.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    }
  });
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';


  const mediaObjects = pdfFiles.map((file) => {
    return {
      "@type": "MediaObject",
      "name": file.pdfname,
      "contentUrl": `${baseUrl}${file.pdf}`,
      "encodingFormat": "application/pdf"
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": `Catalogues | SB Audience`,
    "description": "All Catalogues by SB Audience",
    "url": `${baseUrl}/sbaudience/catalogues`,
    "mainEntityOfPage": `${baseUrl}/sbaudience/catalogues`,
    "logo": `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
    "associatedMedia": [...mediaObjects],
    "publisher": {
      "@type": "Organization",
      "name": "SB Audience"
    }
  };
  return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="2xl:px-80 xl:px-60 lg:px-12 px-8 py-16">
        <h1 className='text-3xl font-bold mb-6 text-center'>
          Catalogues
        </h1>
          {pdfFiles.length > 0 ? pdfFiles.map((item, index) => (
            <div className="md:grid md:grid-cols-2 block gap-4 pt-8" key={index}>
              <div>
                <LazyImage
                  src={item.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover}` : item.cover}
                  alt={item.pdfname}
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex md:justify-start justify-center md:pl-20 pl-0">
                <Link href={`${item.pdf}`} target="_blank" className={`font-bold flex items-center hover:text-primary`}>
                  <div className="pr-2">
                    <Image src={'/images/sbacoustics/PDF-download-ver2.webp'} alt="3D Files Download" className="max-h-8 w-auto flex-shrink-0" width={100} height={100}/>
                  </div>
                  <h2 className="pl-2">
                    {item.pdfname}
                  </h2>
                </Link>
              </div>
            </div>
          ))
        :
          <Empty className='w-full min-h-96 z-10 bg-foreground/20'>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyContent>
              <EmptyTitle>No Catalogues Available</EmptyTitle>
              <EmptyDescription></EmptyDescription>
            </EmptyContent>
          </Empty>
      }
      </div>
      </>
  );
}
