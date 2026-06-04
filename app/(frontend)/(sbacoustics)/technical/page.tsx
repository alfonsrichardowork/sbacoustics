import prismadb from '@/lib/prismadb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordiontechnicals';
import Link from 'next/link';
import Image from 'next/image';

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-black p-0 py-1"

export default async function TechnicalJsonLd() {
  const pdfFiles = await prismadb.technicals.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    }
  });
  if (!pdfFiles) {
    return null;
  }
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
    "@type": "TechArticle",
    "headline": `Technical | SB Acoustics`,
    "description": "All SB Acoustics Technical",
    "url": `${baseUrl}/technical`,
    "mainEntityOfPage": `${baseUrl}/technical`,
    "inLanguage": "en",
    "author": {
      "@type": "Organization",
      "name": "SB Acoustics"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SB Acoustics",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`
      }
    },
    "associatedMedia": mediaObjects
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
        <div className='md:grid md:grid-cols-3 md:px-0 md:py-0 px-8 py-4 '>
        <div></div>
        <div className='py-16'>
            <h1 className="justify-center flex text-3xl font-bold">
                Technical
            </h1>
            {pdfFiles.length > 0 ? 
              <>
                <div className='pt-10 pb-6'>
                <Accordion type="single" collapsible className="w-full">
                  {pdfFiles.map((file, index) => (
                    <AccordionItem className='pb-3' value={`item-${index}`} key={index}>
                      <AccordionTrigger className='bg-zinc-700 md:px-8 px-4 md:py-4 py-2 text-white text-left text-sm'>{file.name}</AccordionTrigger>
                      <AccordionContent className='bg-zinc-100 text-black md:px-8 px-4 py-2 text-xs'>
                        {file.desc}
                        <div className="flex justify-start md:pt-6 pt-4">
                          <Link href={`${file.pdf}`} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>         
                              <div className="pr-2 flex items-center">
                                <Image
                                  src={'/images/sbacoustics/PDF-download.webp'}
                                  alt="3D Files Download"
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                              <div className="pl-2 text-sm">
                                {file.pdfname}
                              </div>
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                </div>
                <h2 className='text-xs'>For referencing, replicating, or copying any information in the technical notes, please use the <Link href={'/contact'} className='text-primary hover:cursor-pointer hover:underline'>contact form</Link> to ask the permission of SB Acoustics</h2>
              </>
              :
              <div className='flex items-center justify-center py-10 px-4'>
                <div className='border border-border rounded-lg bg-card p-8 text-center max-w-sm'>
                  <p className='font-semibold text-foreground mb-2'>No Technicals Available</p>
                  <p className='text-sm text-muted-foreground'>There are no available technicals for SB Audience at this moment.</p>
                </div>
              </div>
            }
        </div>
        <div></div>
        </div>
    </>
  );
};