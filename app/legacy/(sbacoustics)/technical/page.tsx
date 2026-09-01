import prismadb from '@/lib/prismadb';
import { TechnicalClient } from './accordionOld';
import '@/app/legacy/(sbacoustics)/(products)/drivers/driverpage.css'

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
        {/* <div style={{
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
        </div> */}



      <div className='technical'>
      <div></div>
      <div style={{ paddingBlock: '64px'}}>
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
                  }}>There are no available technicals for SB Acoustics at this moment.</p>
                </div>
              </div>
          }
      </div>
      <div></div>
      </div>
    </>
  );
};