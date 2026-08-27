
import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import prismadb from '@/lib/prismadb';
import AllDriversProducts from '../../components-all-drivers-page/all-product';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';
import '@/app/legacy/(products)/drivers/driverpage.css'
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';

export const revalidate = 60;

export async function generateStaticParams() {
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
        .filter(c => c.type === 'Category' && c.slug === 'kits')
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

    return uniqueSortedPaths.map(path => ({
        slug: path.split('/').slice(1),
    }));
}

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

export default async function KitsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
    const { slug = [] } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
    const subslug = slug[0] || null;
    const subsubslug = slug[1] || null;

    if(!subslug && !subsubslug){

        const Kits = await prismadb.allproductcategory.findMany({
            where: {
                category: {
                shown_on_all_drivers_page: true,
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
                type: { not: 'Category' }
                },
                product: {
                slug: {
                    not: 'dw50'
                },
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
                allCat: {
                    some: {
                    category: {
                        slug: 'kits',
                    },
                    },
                },
                },
            },
            select: {
                category: {
                select: {
                    name: true,
                    thumbnail_url: true,
                    slug: true,
                    priority: true,
                },
                },
            }
        })
        const allKitsImage = await prismadb.allproductcategory.findFirst({
            where: {
                category: {
                    shown_on_all_drivers_page: true,
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
                    type: 'Category',
                    slug: 'kits'
                },
            },
            select: {
                category: {
                    select: {
                        name: true,
                        thumbnail_url: true,
                        slug: true,
                        priority: true,
                    },
                },
            }
        })
        const allKitsImageCategories = allKitsImage ? [allKitsImage.category] : []
        const uniqueCategories = [
            ...new Map(
                allKitsImageCategories.map(item => [item.slug, item])
            ).values(),
            ...new Map(
                Kits.map(item => [item.category.slug, item.category])
            ).values()
        ].sort((a, b) => Number(a.priority) - Number(b.priority))

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
                    {uniqueCategories.map((item, i) => (
                    <div
                        key={i}
                        style={{
                        width: "25%",
                        padding: "8px",
                        boxSizing: "border-box",
                        }}
                    >
                        <a
                        href={`/legacy/kits/${item.slug === 'kits' ? 'all' : item.slug}`}
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
        )
    }

    const [subCatNameResult, subsubCatNameResult] = await Promise.allSettled([
        await prismadb.allcategory.findFirst({
            where: {
                slug: subslug ?? '',
                type: 'Sub Category',
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
            },
            select:{
                name: true,
                description: true
            }
        }),
        await prismadb.allcategory.findFirst({
            where: {
                slug: subsubslug ?? '',
                type: 'Sub Sub Category',
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
            },
            select:{
                name: true,
                description: true
            }
        }),
    ]);

    const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
    const subSubCatName = subsubCatNameResult.status === 'fulfilled' ? subsubCatNameResult.value : { name: '' };
    
    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID, 'kits', subslug, subsubslug);

    let sliderRows: SliderData[] = [];
    let checkboxRows: CheckBoxData[] = [];

    let counterShow = 0;

    for (const key in allSpecsCombined) {
        if(allSpecsCombined[key]) {
        if(key !== 'impedance' && key !== 'program-power'){ 
            if(key !== 'dome-material' && key !== 'nominal-impedance' && key !== 'cone-material') {
            const allValueWithoutDuplicates: number[] = removeDuplicates(allSpecsCombined[key].map((val) => Number(val.value)));
            const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => !Number.isNaN(number));
            const sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => a - b);
            if(sortedValues.length>1){
                counterShow+=1
            }
            sliderRows.push(
                {
                  name: allSpecsCombined[key][0]?.childname ?? '', 
                  value: sortedValues, 
                  unit: allSpecsCombined[key][0]?.unit ?? '',
                  max_index: sortedValues.length - 1,
                  min_index: 0,
                  minIndex: 0,
                  maxIndex: sortedValues.length - 1,
                  slug: key
                },
            )
            }
            else{
            const allValueWithoutDuplicates: string[] = removeDuplicates(allSpecsCombined[key].map((val) => val.value));
            const allValueWithoutDuplicatesAndNone = allValueWithoutDuplicates.filter(number => number != '');
            const sortedValues = allValueWithoutDuplicatesAndNone.sort()
            if(sortedValues.length>1){
                counterShow+=1
            }
            checkboxRows.push(
                {
                    name: allSpecsCombined[key][0]?.childname ?? '', 
                    value: sortedValues, 
                    unit: allSpecsCombined[key][0]?.unit ?? '',
                    slug: key,
                },
            )
            }
        }
        }
    }


    return( 
    tempData &&
    <div className="drivers-container">
        <div className="drivers-grid">
            <AllDriversandFiltersProducts
                data={tempData}
                // slider={sliderRows}
                // checkbox={checkboxRows}
                // showFilters={counterShow !== 0}
            />
        </div>
    </div>
    );
}

