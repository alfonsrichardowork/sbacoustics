import { LazyImage } from "@/components/lazyImage";
import Image from "next/image";
import prismadb from "@/lib/prismadb";
import Link from "next/link";

export const revalidate = 3600;

export default async function CataloguesPage() {
  const pdfFiles = await prismadb.catalogues.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
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
    "name": `Catalogues | SB Acoustics`,
    "description": "All Catalogues by SB Acoustics",
    "url": `${baseUrl}/catalogues`,
    "mainEntityOfPage": `${baseUrl}/catalogues`,
    "logo": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
    "associatedMedia": [...mediaObjects],
    "publisher": {
      "@type": "Organization",
      "name": "SB Acoustics"
    }
  };
  return (
    <div className="2xl:px-80 xl:px-60 lg:px-12 px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Catalogues
      </h1>
      {pdfFiles.map((item, index) => (
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
      ))}
    </div>
  );
}
