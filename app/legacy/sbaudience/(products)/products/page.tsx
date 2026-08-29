import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";

export const revalidate = 60;

export default async function SBAudienceProductPage() {
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

    const allDriver = await prismadb.allcategory.findMany({
    where: {
        type: 'Category',
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        shown_on_all_drivers_page: true,
    },
    select: {
        name: true,
        slug: true,
        thumbnail_url: true,
    },
    })

    return(
       <div
            style={{
                padding: "16px",
            }}
            >
            <div
                style={{
                display: "flex",
                flexWrap: "wrap",
                }}
            >
                {allDriver.map((item, i) => (
                <div
                    key={i}
                    style={{
                    width: "25%",
                    padding: "8px",
                    boxSizing: "border-box",
                    }}
                >
                    <a
                    href={`/legacy/sbaudience/${item.slug}/all`}
                    style={{
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    >
                    <div
                        style={{
                        position: "relative",
                        width: "100%",
                        }}
                    >
                        {/* <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                            }}
                            > */}

                            <img
                                src={
                                    item.thumbnail_url.startsWith("/uploads/")
                                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.thumbnail_url}`
                                    : item.thumbnail_url
                                }
                                alt={`${item.name} by SB Acoustics`}
                                width={1000}
                                height={1000}
                                loading="eager"
                                style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                transition: "opacity 0.3s ease",
                                }}
                            />
                            {/* </div> */}
                    </div>

                    <h2
                        style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        textAlign: "center",
                        marginTop: "16px",
                        }}
                    >
                        {item.name}
                    </h2>
                    </a>
                </div>
                ))}
            </div>
        </div>
    );
}

