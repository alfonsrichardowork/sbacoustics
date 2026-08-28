import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import prismadb from '@/lib/prismadb';
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';
import '@/app/legacy/(sbacoustics)/(products)/drivers/driverpage.css'

export const revalidate = 60;

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
}

export default async function DriversPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
    const { slug = [] } = await params;  
    const subslug = slug[0] || null;
    const subsubslug = slug[1] || null;
    const subsubsubslug = slug[2] || null;

    if(!subslug && !subsubslug && !subsubsubslug){
        const Drivers = await prismadb.allproductcategory.findMany({
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
                        slug: 'drivers',
                    },
                    },
                },
                },
            },
            select: {
                category: {
                select: {
                    id: true,
                    name: true,
                    thumbnail_url: true,
                    slug: true,
                    priority: true,
                    under_categoryId: true,
                },
                },
            }
        })

        
        const allCategories = await prismadb.allcategory.findMany({
            where: {
                brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
            },
            select: {
                id: true,
                slug: true,
                under_categoryId: true,
            },
        });

        const categoryMap = new Map(
            allCategories.map(category => [
                category.id,
                category
            ])
        );

        const getCategoryPath = (
        category: {
            slug: string;
            under_categoryId: string | null;
        }
            ) => {
            const slugs = [category.slug];

            let currentParentId = category.under_categoryId;

            while (currentParentId) {
                const parent = categoryMap.get(currentParentId);

                if (!parent) {
                break;
                }

                slugs.push(parent.slug);

                currentParentId = parent.under_categoryId;
            }

            return '/' + slugs.reverse().join('/');
        };

        const allDriverImage = await prismadb.allproductcategory.findFirst({
            where: {
                category: {
                    shown_on_all_drivers_page: true,
                    brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
                    type: 'Category',
                    slug: 'drivers'
                },
            },
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        thumbnail_url: true,
                        slug: true,
                        priority: true,
                        under_categoryId: true,
                    },
                },
            }
        })
        const allDriverImageCategories = allDriverImage ? [allDriverImage.category] : []
        const uniqueCategories = [
            ...new Map(
                allDriverImageCategories.map(item => [item.slug, item])
            ).values(),
            ...new Map(
                Drivers.map(item => [item.category.slug, item.category])
            ).values()
            ].map(category => ({
            ...category,
            url: getCategoryPath(category),
            })).sort((a, b) => {
            const aHasPriority = a.priority !== '';
            const bHasPriority = b.priority !== '';

            if (!aHasPriority && !bHasPriority) {
                return a.name.localeCompare(b.name);
            }

            if (!aHasPriority) {
                return 1;
            }
            if (!bHasPriority) {
                return -1;
            }

            return Number(a.priority) - Number(b.priority);
        });

        return(
            // <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
            //     <script
            //     type="application/ld+json"
            //     dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            //     /> 
            //     <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            //     <h1 className="sr-only">All Drivers | SB Acoustics</h1>
            //     {allDriver &&
            //         <div>
            //         <Link 
            //             href='/drivers/all'
            //             className=" group cursor-pointer space-y-4 block"
            //         >
            //             <div className="relative aspect-square">
            //             <LazyImageClickable
            //                 src={allDriver.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allDriver.thumbnail_url}` : allDriver.thumbnail_url} 
            //                 alt={`${allDriver.name} by SB Acoustics`}
            //                 width={1000}
            //                 height={1000}
            //             />
            //             </div>
                        
            //             <h2 className="font-bold text-xl text-center">All {allDriver.name}</h2>
            //         </Link>
            //         </div>
            //     }


            //     {uniqueCategories.map((item, i) => (
            //         <div key={i}>
            //         <Link 
            //             href={`/drivers/${item.slug}`} 
            //             className=" group cursor-pointer space-y-4 block"
            //         >
            //             <div className="relative aspect-square">
            //             <LazyImageClickable
            //                 src={item.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.thumbnail_url}` : item.thumbnail_url} 
            //                 alt={`${item.name} by SB Acoustics`}
            //                 width={1000}
            //                 height={1000}
            //             />
            //             </div>
                        
            //             <h2 className="font-bold text-xl text-center">{item.name}</h2>
            //         </Link>
            //         </div>
            //     ))}
            //     </div>
            // </div>
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
                        href={`/legacy${item.slug === 'drivers' ? '/drivers/all' : item.url}`}
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

    const [subCatNameResult, subsubCatNameResult, subsubsubCatNameResult] = await Promise.allSettled([
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
        await prismadb.allcategory.findFirst({
            where: {
                slug: subsubsubslug ?? '',
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
    const subSubsubCatName = subsubsubCatNameResult.status === 'fulfilled' ? subsubsubCatNameResult.value : { name: '' };

    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID, 'drivers', subslug, subsubslug, subsubsubslug);

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
            let sortedValues = []
            if(key === 'nominal-impedance') {
                sortedValues = allValueWithoutDuplicatesAndNone.slice().sort((a, b) => Number(a) - Number(b));
            }
            else {
                sortedValues = allValueWithoutDuplicatesAndNone.sort()
            }
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

