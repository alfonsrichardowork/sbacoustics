import prismadb from '@/lib/prismadb';
import '@/app/legacy/(sbacoustics)/(products)/drivers/driverpage.css'

export const revalidate = 60;

function shortenMaterial(name: string): string {
  return name
    .replace(/Polypropylene/gi, "Poly")
    .replace(/Aluminum/gi, "Alu");
}

export default async function NewProductsSBAcousticsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  const products = await prismadb.product.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      isArchived: false,
      isNewProduct: true
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      cover_img_url: true,
      name: true,
      slug: true,
      isKits: true,
    }
  });

  if(!products) {
    return null;
  }

  products.sort((a, b) => Number(b.isKits) - Number(a.isKits));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": `${baseUrl}/new-products`,
    "name": "SB Acoustics | New Products",
    "description": `All New Products by SB Acoustics`,
    "itemListElement": products.map((driver, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": `${baseUrl}/products/${driver.slug}`,
        "name": shortenMaterial(driver.name),
        "description": shortenMaterial(driver.name),
        "image": `${baseUrl}${driver.cover_img_url}`,
        "sku": shortenMaterial(driver.name),
        "brand": {
          "@type": "Brand",
          "name": "SB Acoustics",
        }
      }
    }))
  };

  return(
    <div className="drivers-container">
        <div className="drivers-grid">
        {products.map((item, i) => (
          <div key={i} style={{
            paddingInline: '8px',
            paddingTop: '48px',
            position: 'relative'
          }}>
            <a
              href={`/legacy/products/${item.slug}`}
              style={{
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >  

              <div
                style={{ 
                  aspectRatio: "1/1",
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  padding: '16px'
                }}>
            
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%'
                }}>
                  <img
                    src={item.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover_img_url}` : item.cover_img_url}
                    alt={shortenMaterial(item.name)}
                    width={500}
                    height={500}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transitionProperty: 'all',
                    }}
                    loading='eager'
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  lineHeight: '1.56',
                  fontWeight: 700,
                  textAlign: 'center',
                  paddingBottom: '8px',
                  zIndex: 10
                }}>
                  {shortenMaterial(item.name)}
                </h2>
              </div>
            </a>
            
          </div>
        ))}
      </div>
    </div>
  );
}
