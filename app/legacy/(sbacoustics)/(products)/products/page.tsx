import prismadb from '@/lib/prismadb';
import '@/app/legacy/(sbacoustics)/(products)/drivers/driverpage.css'
export const revalidate = 60;

export default async function SBAcousticsProductPage() {
    

    const allDriver = await prismadb.allcategory.findMany({
    where: {
        type: 'Category',
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
        shown_on_all_drivers_page: true,
    },
    select: {
        name: true,
        slug: true,
        thumbnail_url: true,
    },
    })


    return(
            <div className="all-driver-page-parent">
                <div className="all-driver-page-child-grid">
                {allDriver.map((item, i) => (
                    <a 
                        key={i}
                        href={`/legacy/${item.slug}/all`}
                        style={{
                            cursor: 'pointer',
                            marginBlockStart: '16px',
                            marginBlockEnd: '16px',
                            display: 'block'
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            aspectRatio: '1/1'
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
                                    src={item.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.thumbnail_url}` : item.thumbnail_url} 
                                    alt={`${item.name} by SB Acoustics`}
                                    width={1000}
                                    height={1000}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                    loading='eager'
                                />
                            </div>
                        </div>
                        
                        <h2 style={{
                            fontWeight: 700,
                            fontSize: '20px',
                            lineHeight: '1.4',
                            textAlign: 'center'
                        }}>
                            {item.name}
                        </h2>
                    </a>
                ))}
            </div>
        </div>
    );
}

