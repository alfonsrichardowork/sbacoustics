
import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import prismadb from '@/lib/prismadb';
import AllDriversProducts from '../../components-all-drivers-page/all-product';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';
import '@/app/legacy/(sbacoustics)/(products)/drivers/driverpage.css'
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';

export const revalidate = 60;

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
    const subsubsubslug = slug[2] || null;

    if(!subslug && !subsubslug && !subsubsubslug){

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
            ].sort((a, b) => {
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
            <div className="all-driver-page-parent">
                <div className="all-driver-page-child-grid">
                {uniqueCategories.map((item, i) => (
                    <a 
                        key={i}
                        href={`/legacy/kits/${item.slug === 'kits' ? 'all' : item.slug}`}
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
        )
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
    
    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID, 'kits', subslug, subsubslug, subsubsubslug);

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

