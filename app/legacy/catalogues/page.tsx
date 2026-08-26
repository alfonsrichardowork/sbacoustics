import prismadb from "@/lib/prismadb";
import '@/app/legacy/catalogues/catalogues.css'
export const revalidate = 60;

export default async function CataloguesPage() {
  const pdfFiles = await prismadb.catalogues.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    }
  });
  return (
    <div className="catalogues-parent">
      <h1 style={{
        fontSize: '30px',
        lineHeight: '1.2',
        fontWeight: 700,
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Catalogues
      </h1>
      {pdfFiles.map((item, index) => (
        <div className="catalogues-child" key={index}>
          <div>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <img 
                src={item.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover}` : item.cover}
                alt={item.pdfname}
                width={500}
                height={500}
                style={{
                  height: 'fit-content',
                  width: '100%',
                  objectFit: 'contain'
                }}
                loading={'lazy'}
              />
            </div>
          </div>
          <div className="catalogues-files">
            <a href={`${item.pdf}`} target="_blank" style={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                paddingRight: '8px'
              }}>
                <div style={{
                  position: 'relative',
                  display: 'inline-flex',
                  height: '32px',
                  width: '32px',
                  alignItems: 'center'
                }}>
                  <img
                    src={'/images/sbacoustics/PDF-download-ver2.png'}
                    alt="3D Files Download"
                    width={100} 
                    height={100}
                    style={{
                      maxHeight: '32px',
                      width: 'auto',
                      flexShrink: 0
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              <h2 style={{
                paddingLeft: '8px'
              }}>
                {item.pdfname}
              </h2>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
