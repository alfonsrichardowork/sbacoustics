import prismadb from "@/lib/prismadb";
import test, { expect } from "@playwright/test";

const connectors = await prismadb.allproductcategory.findMany({
    where: {
        category: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
        },
        product: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
        },
    },
    select: {
        productId: true,
        category: {
            select: {
                slug: true,
                type: true,
            },
        },
    },
});

    const paths = Array.from(
    connectors.reduce((map, row) => {
        const existing = map.get(row.productId) ?? [];

        existing.push({
        slug: row.category.slug,
        type: row.category.type,
        });

        map.set(row.productId, existing);

        return map;
    }, new Map<string, { slug: string; type: string }[]>()).values()
    ).flatMap(categories => {
    const category = categories
        .filter(c => c.type === 'Category')
        .map(c => c.slug);

    const subCategory = categories
        .filter(c => c.type === 'Sub Category')
        .map(c => c.slug);

    const subSubCategory = categories
        .filter(c => c.type === 'Sub Sub Category')
        .map(c => c.slug);

    const result: string[] = [];

    // Category only
    if (!subCategory.length) {
        return category;
    }

    // Category + Sub Category
    for (const cat of category) {
        for (const sub of subCategory) {
        if (!subSubCategory.length) {
            result.push(`${cat}/${sub}`);
        } else {
            // Category + Sub Category + Sub Sub Category
            for (const subSub of subSubCategory) {
            result.push(`${cat}/${sub}/${subSub}`);
            }
        }
        }
    }

    return result;
    });

    const allPaths = new Set<string>();

    for (const path of paths) {
        const parts = path.split('/');

        // Original path
        allPaths.add(path);

        // Level 1 (/drivers)
        if (parts.length >= 1) {
            allPaths.add(parts[0] ?? '');
        }

        // Level 2 (/drivers/midranges)
        if (parts.length >= 2) {
            allPaths.add(parts.slice(0, 2).join('/'));
        }
    }

    const uniqueSortedPaths = [...allPaths].sort((a, b) => {
        const depthA = a.split('/').length;
        const depthB = b.split('/').length;

        if (depthA !== depthB) {
            return depthA - depthB;
        }

        return a.localeCompare(b);
    });

    let finalProductsIds: string[] = []
    for (const val of uniqueSortedPaths) {
        test(`Drivers page - ${val}`, async ({ page }) => {
            await page.goto(`/${val}`);
            const allSlug = val.split('/')
            const slug = allSlug[0] ?? undefined
            const subslug = allSlug[1] ?? undefined
            const subsubslug = allSlug[2] ?? undefined
           
            if(subslug && subslug === 'all' && !subsubslug) {
                const productIdbyCat =  await prismadb.allproductcategory.findMany({
                where:{
                    category: {
                    slug: slug,
                    type: {
                        in: ['Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                finalProductsIds = productIdbyCat.map((value) => value.productId)
            }
            else if (subslug && subslug !== 'all' && !subsubslug) {
                const productIdbyCat =  await prismadb.allproductcategory.findMany({
                where:{
                    category: {
                    slug: slug,
                    type: {
                        in: ['Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                const productIdsCat = productIdbyCat.map((value) => value.productId)

                const productIdbySubCat =  await prismadb.allproductcategory.findMany({
                where:{
                    category: {
                    slug: subslug,
                    type: {
                        in: ['Sub Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

                finalProductsIds = productIdsCat.filter(id => productIdsSubCat.includes(id));
            }
            else if(subslug && subsubslug) {
                    const productIdbyCat =  await prismadb.allproductcategory.findMany({
                    where:{
                    category: {
                    slug: slug,
                    type: {
                        in: ['Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                const productIdsCat = productIdbyCat.map((value) => value.productId)

                const productIdbySubCat =  await prismadb.allproductcategory.findMany({
                where:{
                    category: {
                    slug: subslug,
                    type: {
                        in: ['Sub Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

                const finalProductIds = productIdsCat.filter(id => productIdsSubCat.includes(id));

                const productIdbySubSubCat =  await prismadb.allproductcategory.findMany({
                where:{
                    category: {
                    slug: subsubslug,
                    type: {
                        in: ['Sub Sub Category']
                    }
                    }
                },
                select:{
                    productId: true
                }
                })

                const productIdsSubSubSubCat = productIdbySubSubCat.map((value) => value.productId)

                finalProductsIds = finalProductIds.filter(id => productIdsSubSubSubCat.includes(id));
            }

            const allProducts = await prismadb.product.findMany({
                where: {
                    id: {
                        in: finalProductsIds
                    },
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
                    isArchived: false
                },
                select: {
                    name: true,
                    id: true,
                    slug: true,
                    allCat: {
                        where: {
                            category: {
                                type: {
                                    in: ["Sub Category", "Sub Sub Category"],
                                },
                            },
                        },
                        select: {
                            category: {
                                select: {
                                    slug: true
                                }
                            }
                        }
                    },
                },
            })
            
            const catId = await prismadb.allcategory.findFirst({
            where: {
                slug: subslug,
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
            },
            select: {
                id: true
            }
            });
            
            let priority = null
            if (catId) {
                priority = await prismadb.menupriority.findMany({
                    where: {
                        categoryId: catId.id
                    }
                })
            }


            if(!priority) {
                allProducts.sort((a, b) => {
                    // Extract the leading number from the name
                    const numA = parseInt(a.name.match(/^\d+/)?.[0] || "100", 10);
                    const numB = parseInt(b.name.match(/^\d+/)?.[0] || "100", 10);
                
                    if (numA !== numB) {
                    return numA - numB; // Sort numerically first
                    }
                
                    return a.name.localeCompare(b.name); // Sort alphabetically if numbers are the same
                });
            }
            else{
                allProducts.sort((a, b) => {
                    const priorityA = Number(priority.find((pri) => pri.productId === a.id)?.priorityNumber ?? 999)
                    const priorityB = Number(priority.find((pri) => pri.productId === b.id)?.priorityNumber ?? 999)
                    return priorityA - priorityB
                });
            }

            allProducts.sort((a, b) => {
                const numA = parseInt(a.name.match(/^\d+/)?.[0] || "100", 10);
                const numB = parseInt(b.name.match(/^\d+/)?.[0] || "100", 10);
            
                if (numA !== numB) {
                return numA - numB;
                }
            
                return a.name.localeCompare(b.name);
            });

            for (const [index, val] of allProducts.entries()) {
                await expect(
                    page.getByTestId(`all-drivers-page-product-name-${index}`)
                ).toHaveText(val.name);
                await expect(
                    page.getByTestId(`all-drivers-page-product-alt-${index}`)
                ).toHaveAttribute('alt', val.name);
                await expect(
                    page.getByTestId(`all-drivers-page-product-href-${index}`)
                ).toHaveAttribute(
                    'href',
                    `/products/${val.slug}`
                );
                expect(
                    val.allCat.some(cat =>
                        [slug, subslug, subsubslug].includes(cat.category.slug)
                    )
                ).toBe(true);
            }
        });
    }