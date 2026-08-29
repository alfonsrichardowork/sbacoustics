import prismadb from "@/lib/prismadb";
import "./application.css"

export const revalidate = 60;

export default async function AllApplicationJsonLd() {
  const app = await prismadb.sbaudienceapplication.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return (
      <div className="application-all-parent"> 
        <h1 className='application-all-h1'>Applications</h1>
        <div className="application-all-content-parent">
        {app && app.length > 0 && app.map((item, i) => (
          <a
              key={i}
              href={`/legacy/sbaudience/application/${item.slug}`} 
              className="application-all-single-app"
          >
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                  <img
                    src={item.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.cover_img_url}` : item.cover_img_url ?? '/images/sbaudience/logo_sbaudience.webp'} 
                    alt={`${item.name} by SB Audience`}
                    width={1000}
                    height={1000}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      
                    }}
                  />
                </div>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '20px', lineHeight: 1.4, textAlign: 'center' }}>{item.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
