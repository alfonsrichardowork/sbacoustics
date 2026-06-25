
import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";
import AllDriversProducts from '../../components-all-drivers-page/all-product';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';

export const revalidate = 3600;

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
        const uniqueCategories = [
            ...new Map(
                Kits.map(item => [item.category.slug, item.category])
            ).values()
        ].sort((a, b) => Number(a.priority) - Number(b.priority))

        const allKit = await prismadb.allcategory.findFirst({
        where: {
            slug: 'kits',
            brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
            shown_on_all_drivers_page: true,
        },
        select: {
            name: true,
            slug: true,
            thumbnail_url: true,
        },
        })

        const itemListElement = [
            ...(allKit
                ? [{
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                    "@type": "Product",
                    "url": `${baseUrl}/kits/all`,
                    "name": `All ${allKit.name}`,
                    "description": `Discover All ${allKit.name} by SB Acoustics`,
                    "image": allKit.thumbnail_url.startsWith('/uploads/')
                        ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allKit.thumbnail_url}`
                        : allKit.thumbnail_url,
                    "sku": `all-${allKit.slug}`,
                    "brand": {
                        "@type": "Brand",
                        "name": "SB Acoustics",
                    },
                    },
                }]
            : []),

            ...uniqueCategories.map((val, index) => ({
                "@type": "ListItem",
                "position": index + (allKit ? 2 : 1),
                "item": {
                "@type": "Product",
                "url": `${baseUrl}/kits/${val.slug}`,
                "name": val.name,
                "description": `Discover All ${val.name} by SB Acoustics`,
                "image": val.thumbnail_url.startsWith('/uploads/')
                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.thumbnail_url}`
                    : val.thumbnail_url,
                "sku": val.slug,
                "brand": {
                    "@type": "Brand",
                    "name": "SB Acoustics",
                },
                },
            })),
        ]

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "url": `${baseUrl}/kits`,
            "name": "SB Acoustics",
            "description": "All Kits Provided by SB Acoustics",
            itemListElement,
        }

        return(
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <h1 className="sr-only">All Kits | SB Acoustics</h1>
                 {allKit &&
                    <div>
                    <Link 
                        href='/kits/all'
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickable
                            src={allKit.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allKit.thumbnail_url}` : allKit.thumbnail_url} 
                            alt={`${allKit.name} by SB Acoustics`}
                            width={1000}
                            height={1000}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">All {allKit.name}</h2>
                    </Link>
                    </div>
                }
                 {uniqueCategories.map((item, i) => (
                    <div key={i}>
                    <Link 
                        href={`/kits/${item.slug}`} 
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickable
                            src={item.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.thumbnail_url}` : item.thumbnail_url} 
                            alt={`${item.name} by SB Acoustics`}
                            width={1000}
                            height={1000}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">{item.name}</h2>
                    </Link>
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": !subslug ? `${baseUrl}/kits` : subslug === 'all' ? `${baseUrl}/kits/all` : subslug && !subsubslug ? `${baseUrl}/kits/${subslug}` : subslug && subsubslug ? `${baseUrl}/kits/${subslug}/${subsubslug}` : `${baseUrl}/kits`, 
        "name": `${!subslug || subslug === 'all' ? `All Kits` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All Kits`} | SB Acoustics`,
        "description": `Found out more about ${!subslug || subslug === 'all' ? `All Kits` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All Kits`} from SB Acoustics!`,
        "itemListElement": tempData?.map((kits: AllFilterProductsOnlyType, index: number) => ({
         "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "url": `${baseUrl}/products/${kits.products.slug}`,
            "name": kits.products.name,
            "description": kits.products.name,
            "image": `${baseUrl}${kits.products.cover_img}`,
            "sku": kits.products.slug || kits.products.id,
            "brand": {
              "@type": "Brand",
              "name": "SB Acoustics"
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
      
      <h1 className='sr-only'>{!subslug || subslug === 'all' ? `All Kits` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All Kits`} | SB Acoustics</h1>
      
      {tempData &&
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <div className="md:grid lg:grid-cols-4 md:grid-cols-3">
                <AllDriversProducts allActiveSliderVal={[]} allActiveCheckboxVal={[]} products={tempData}/>
            </div>
        </div>
      }
    </>
  );
}

