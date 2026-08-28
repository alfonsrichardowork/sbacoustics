import prismadb from '@/lib/prismadb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordiontechnicals';
import { TechnicalClient } from './accordionOld';

export const revalidate = 60;

export default async function TechnicalJsonLd() {
  let pdfFiles = await prismadb.technicals.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    }
  });
  if (!pdfFiles) {
    return null;
  }
  pdfFiles = pdfFiles.sort((a, b) => Number(a.priority) - Number(b.priority))
  return (
    <>
        <div style={{
          paddingBlock: '16px'
        }}>
        <div style={{
          paddingBlock: '64px'
        }}>
            <h1 style={{
              justifyContent: 'center',
              display: 'flex',
              fontSize: '30px',
              lineHeight: '1.2',
              fontWeight: 700
            }}>
                Technical
            </h1>
            {pdfFiles.length > 0 ? 
              <>
                <div style={{
                  paddingTop: '40px',
                  paddingBottom: '24px'
                }}>
                {/* <Accordion type="single" collapsible className="w-full">
                  {pdfFiles.map((file, index) => (
                    <AccordionItem className='pb-3' value={`item-${index}`} key={index}>
                      <AccordionTrigger className='bg-zinc-700 md:px-8 px-4 md:py-4 py-2 text-white text-left text-sm'>{file.name}</AccordionTrigger>
                      <AccordionContent className='bg-zinc-100 text-black md:px-8 px-4 py-2 text-xs'>
                        {file.desc}
                        <div className="flex justify-start md:pt-6 pt-4">
                          <a href={`${file.pdf}`} target="_blank" style={{
                            textAlign: 'left',
                            fontSize: '16px',
                            lineHeight: '1.42',
                            color: '#000000',
                            padding: '0px',
                            paddingBlock: '4px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                          }}>         
                              <div style={{
                                paddingRight: '8px',
                                display: 'flex',
                                alignItems: 'center'
                              }}>


                                <div style={{
                                  position: 'relative',
                                  display: 'inline-flex',
                                  height: '32px',
                                  width: '32px',
                                  alignItems: 'center'
                                }}>
                                  <img
                                    src={'/images/sbacoustics/PDF-download-ver2.webp'}
                                    alt="3D Files Download"
                                    width={24}
                                    height={24}
                                    style={{
                                      objectFit: 'contain',
                                      maxHeight: '32px',
                                      width: 'auto',
                                      transitionProperty: 'opacity'
                                    }}
                                    loading="lazy"
                                  />
                                </div>
                              </div>
                              <div style={{
                                paddingLeft: '8px',
                                fontSize: '14px',
                                lineHeight: '1.43'
                              }}>
                                {file.pdfname}
                              </div>
                          </a>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion> */}
                <TechnicalClient pdfFiles={pdfFiles} />
                </div>
                <h2 style={{
                  fontSize: '12px',
                  lineHeight: '1.33'
                }}>For referencing, replicating, or copying any information in the technical notes, please use the 
                <a href={'/contact'} 
                  style={{
                    color: '#e6001b',
                    paddingInline: '3px'
                }}>
                  contact form
                </a> 
                to ask the permission of SB Acoustics</h2>
              </>
              :
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBlock: '40px',
                paddingInline: '16px'
              }}>
                <div style={{
                  borderWidth: '1px',
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  maxWidth: '384px'
                }}>
                  <p style={{
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>No Technicals Available</p>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.42',
                  }}>There are no available technicals for SB Audience at this moment.</p>
                </div>
              </div>
            }
        </div>
        </div>
    </>
  );
};