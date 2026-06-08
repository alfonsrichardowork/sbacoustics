import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';
import { LazyImageClickableSBAudience } from "@/components/lazyImageclickablesbaudience";
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';

export async function generateStaticParams() {
    const connectors = await prismadb.allproductcategory.findMany({
        where: {
            category: {
            brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
            },
            product: {
            brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
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
        .filter(c => c.type === 'Category' && c.slug === 'drivers')
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

function createData(
  value: string,
  url: string,
  link: string,
) {
  return { url, value, link };
}

export default async function SBAudienceDriversPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
    const { slug = [] } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
    const subslug = slug[0] || null;

    if(!subslug){

        const Drivers = await prismadb.allproductcategory.findMany({
            where: {
                category: {
                shown_on_all_drivers_page: true,
                brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
                type: { not: 'Category' }
                },
                product: {
                brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
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
                    name: true,
                    thumbnail_url: true,
                    slug: true,
                    priority: true,
                },
                },
            }
        })
        const uniqueCategories = [
            ...new Map(
                Drivers.map(item => [item.category.slug, item.category])
            ).values()
        ].sort((a, b) => Number(a.priority) - Number(b.priority))

        const allDriver = await prismadb.allcategory.findFirst({
        where: {
            slug: 'drivers',
            brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
            shown_on_all_drivers_page: true,
        },
        select: {
            name: true,
            slug: true,
            thumbnail_url: true,
        },
        })


        const itemListElement = [
            ...(allDriver
                ? [{
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                    "@type": "Product",
                    "url": `${baseUrl}/sbaudience/drivers/all`,
                    "name": `All ${allDriver.name}`,
                    "description": `Discover All ${allDriver.name} by SB Audience`,
                    "image": allDriver.thumbnail_url.startsWith('/uploads/')
                        ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allDriver.thumbnail_url}`
                        : allDriver.thumbnail_url,
                    "sku": `all-${allDriver.slug}`,
                    "brand": {
                        "@type": "Brand",
                        "name": "SB Audience",
                    },
                    },
                }]
            : []),

            ...uniqueCategories.map((val, index) => ({
                "@type": "ListItem",
                "position": index + (allDriver ? 2 : 1),
                "item": {
                "@type": "Product",
                "url": `${baseUrl}/sbaudience/drivers/${val.slug}`,
                "name": val.name,
                "description": `Discover All ${val.name} by SB Audience`,
                "image": val.thumbnail_url.startsWith('/uploads/')
                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.thumbnail_url}`
                    : val.thumbnail_url,
                "sku": val.slug,
                "brand": {
                    "@type": "Brand",
                    "name": "SB Audience",
                },
                },
            })),
        ]

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "url": `${baseUrl}/sbaudience/drivers`,
            "name": "SB Audience",
            "description": "All Drivers Provided by SB Audience",
            itemListElement,
        }
        return(
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
                <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <h1 className="sr-only">All Drivers | SB Audience</h1>
                {allDriver &&
                    <div>
                    <Link 
                        href='/sbaudience/drivers/all'
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickableSBAudience
                            src={allDriver.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allDriver.thumbnail_url}` : allDriver.thumbnail_url} 
                            alt={`${allDriver.name} by SB Audience`}
                            width={500}
                            height={500}
                            classname={'w-fit h-full object-contain'}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">All {allDriver.name}</h2>
                    </Link>
                    </div>
                }
                {uniqueCategories.map((item, i) => (
                    <div key={i}>
                    <Link 
                        href={`/sbaudience/drivers/${item.slug}`} 
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickableSBAudience
                            src={item.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.thumbnail_url}` : item.thumbnail_url} 
                            alt={`${item.name} by SB Audience`}
                            width={500}
                            height={500}
                            classname={'w-fit h-full object-contain'}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">{item.name}</h2>
                    </Link>
                    </div>
                ))}
                </div>
            </div>
        );
    }

    const [subCatNameResult] = await Promise.allSettled([
        await prismadb.allcategory.findFirst({
            where: {
                slug: subslug ?? '',
                type: 'Sub Category',
                brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
            },
            select:{
                name: true,
                description: true
            }
        })
    ]);

    const subCatName = subCatNameResult.status === 'fulfilled' ? subCatNameResult.value : { name: '' };
    
    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_AUDIENCE_ID, 'drivers', subslug, null);

    let sliderRows: SliderData[] = [];
    let checkboxRows: CheckBoxData[] = [];

    let counterShow = 0;

    for (const key in allSpecsCombined) {
        if(allSpecsCombined[key]) {
        if(key !== 'diaphragm-material' && key !== 'magnet' && key !== 'mechanical-connection-of-driver') {
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": !subslug ? `${baseUrl}/sbaudience/drivers` : subslug === 'all' ? `${baseUrl}/sbaudience/drivers/all` : subslug ? `${baseUrl}/sbaudience/drivers/${subslug}` : `${baseUrl}/sbaudience/drivers`, 
        "name": `${!subslug || subslug === 'all' ? `All Drivers` 
        : subslug ? subCatName?.name : `All Drivers`} | SB Audience`,
        "description": `Found out more about ${!subslug || subslug === 'all' ? `All` 
        : subslug ? subCatName?.name : `All`} Drivers from SB Audience!`,
        "itemListElement": tempData?.map((driver: AllFilterProductsOnlyType, index: number) => ({
         "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "url": `${baseUrl}/sbaudience/products/${driver.products.slug}`,
            "name": driver.products.name,
            "description": driver.products.name,
            "image": `${baseUrl}${driver.products.cover_img}`,
            "sku": driver.products.slug || driver.products.id,
            "brand": {
              "@type": "Brand",
              "name": "SB Audience"
            }
          }
        }))
    };


  return( 
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h1 className='sr-only'>{!subslug || subslug === 'all' ? `All Drivers` 
        : subslug ? subCatName?.name : `All Drivers`} | SB Audience</h1>
      
      {tempData &&
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <div className="md:grid lg:grid-cols-5 md:grid-cols-4">
                <AllDriversandFiltersProducts data={tempData} slider={sliderRows} checkbox={checkboxRows} showFilters={counterShow!==0}/>
            </div>
        </div>
      }
    </>
  );
}

