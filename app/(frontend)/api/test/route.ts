import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

export async function GET() {
    const product = await prismadb.product.findFirst({
    where: {
      slug: 'rinjani-be',
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      isArchived: false
    },
    select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        cover_img_url: true,
        drawing_img_url: true,
        graph_img_url: true,
        isKits: true,
        allCat: {
            select: {
                id: true,
                category: {
                    select: {
                        name: true,
                        slug: true,
                        type: true
                    }
                }
            }
        },
        images_catalogues: {
            select: {
                name: true,
                url: true,
                id: true
            }
        },
        kitsFinishing: {
            select: {
                url: true,
                order: true,
                finishing: {
                    select: {
                        name: true,
                        url: true,
                    }
                }
            }
        },
        similarProducts: {
            select: {
            similarProduct: {
                select: {
                    name: true,
                    slug: true,
                    cover_img_url: true,
                    id: true
                }
            }
            }
        },
        productsKits: {
            select: {
            productUsedInKits: {
                select: {
                    name: true,
                    slug: true,
                    cover_img_url: true,
                    id: true
                }
            }
            }
        },
        multipleDatasheetProduct: {
            select: {
                url: true,
                name: true,
            }
        },
        multipleFRDZMAFiles: {
            select: {
                url: true,
                name: true,
            }
        },
        multiple3DModels: {
            select: {
                url: true,
                name: true,
            }
        },
        size: {
            select: {
                name: true,
                value: true,
            }
        },
        connectorSpecifications: {
            select: {
                value: true,
                notes: true,
                dynamicspecification: {
                    select: {
                        name: true,
                        slug: true,
                        unit: true,
                        priority: true,
                    }
                },
                dynamicspecificationParent: {
                    select: {
                        name: true,
                        slug: true,
                        priority: true,
                    }
                },
                dynamicspecificationSubParent: {
                    select: {
                        name: true,
                        slug: true,
                        priority: true,
                    }
                }
            }
        }
    }
  });
    return NextResponse.json(product);
}