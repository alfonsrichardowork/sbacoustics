
import prismadb from "@/lib/prismadb";
//@ts-ignore
import "@/app/css/styles.scss";
import DOMPurify from 'isomorphic-dompurify'; 
import Link from "next/link";
import Image from "next/image";
import { LazyImageCustom } from "@/components/lazyImageCustom";
import { LazyImageCustomNavbar } from "@/components/lazyImageCustomNavbar";
import '../application.css'

type Props = {
  params: Promise<{ applicationSlug?: string }>
}

export const revalidate = 60;

export default async function SingleAppJsonLd(props: Props) {
    const { applicationSlug = '' } = await props.params;
    const data = await prismadb.sbaudienceapplication.findFirst({
        where: {
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        slug: applicationSlug
        },
        include: {
            datasheet: true,
            images_catalogues: true,
        }
    });

    if(!data){
        return null
    }

    return (
        <div className="single-application-page-parent">
            {data && 
                <div className="single-application-page-child">
                <div>
                    <h1 style={{ fontSize: '24px', lineHeight: '1.33', fontWeight: 700 }}>
                    {data.name}
                    </h1>
                    <h2><i>by {data.author}</i></h2>
                    <div style={{ paddingTop: '32px'}}>
                    <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description, {
                        ALLOWED_TAGS: [
                            'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                        ],
                        ALLOWED_ATTR: [
                            'href', 'target', 'rel', 'class', 'id', 'style'
                        ],
                    }) }}>
                    </h3>
                    <a href={data.datasheet[0]?.url ?? ''} target="_blank" style={{ color: '#e6001b', textDecorationLine: 'underline' }}>read more in pdf file.</a>
                    </div>
                    
                    <div style={{paddingTop: '48px'}}>
                        {`For the full article download the pdf:`}
                    </div>
                    <div style={{ paddingTop: '16px' }}>
                        <a href={data.datasheet[0]?.url ?? ''} target="_blank" style={{ color: '#e6001b', textDecorationLine: 'underline' }}>{data.name}</a>
                    </div>
                </div>

                <div style={{ gap: '16px' }}>
                    {data.cover_img_url !== '' && 
                        <div style={{
                            position: 'relative',
                            display: 'inline-flex',
                            height: 'fit-content',
                            maxWidth: '100%',
                            alignItems: 'center'
                        }}>
                            <img
                                src={data.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.cover_img_url}` : data.cover_img_url ?? '/images/sbaudience/logo_sbaudience.webp'} 
                                alt={`${data.name} - Cover`} 
                                width={500} 
                                height={500} 
                                style={{
                                    paddingBlock: '8px',
                                    height: 'fit-content',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    aspectRatio: '1 / 1'
                                }}
                                loading={"lazy"}
                            />
                        </div>
                    }
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        width: '80%'
                    }}>
                        {data.images_catalogues && data.images_catalogues.length > 0 && data.images_catalogues.map((cat) =>                         
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%'
                            }}>
                                <img 
                                    src={cat.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cat.url}` : cat.url} 
                                    alt={`${data.name} - ${cat.name}`} 
                                    width={500} 
                                    height={500} 
                                    style={{ 
                                        height: 'fit-content',
                                        paddingBlock: '8px'
                                    }}
                                    loading={'lazy'}
                                />
                            </div>
                        )}
                    </div>
                </div>
                </div>
            }
        </div>
    );
}