import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';
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
    const params = uniqueSortedPaths.map(path => ({
        slug: path.split('/').slice(1),
    }));

    return params;
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

export default async function DriversPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
    const { slug = [] } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
    const subslug = slug[0] || null;
    const subsubslug = slug[1] || null;

    if(!subslug && !subsubslug){
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "url": `${baseUrl}/drivers`,
            "name": "SB Acoustics",
            "description": `All Drivers Provided by SB Acoustics`,
            "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/all`,
                "name": "All Drivers",
                "description": "Discover All Drivers by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/tweeterscover.webp`,
                "sku": "all-drivers",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 2,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/tweeters`,
                "name": "Tweeters",
                "description": "Discover All Tweeters by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/tweeterscover.webp`,
                "sku": "tweeters",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 3,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/widebanders`,
                "name": "Widebanders",
                "description": "Discover All Widebanders by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/widebanderscover.webp`,
                "sku": "widebanders",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 4,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/midranges`,
                "name": "Midranges",
                "description": "Discover All Midranges by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/midrangescover.webp`,
                "sku": "midranges",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 5,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/midwoofers`,
                "name": "Midwoofers",
                "description": "Discover All Midwoofers by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/midwooferscover.webp`,
                "sku": "midwoofers",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 6,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/woofers`,
                "name": "Woofers",
                "description": "Discover All Woofers by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/wooferscover.webp`,
                "sku": "woofers",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 7,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/full-ranges`,
                "name": "Full Ranges",
                "description": "Discover All Full Ranges by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/fullrangecover.webp`,
                "sku": "full-ranges",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 8,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/subwoofers`,
                "name": "Subwoofers",
                "description": "Discover All Subwoofers by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/subwooferscover.webp`,
                "sku": "subwoofers",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 9,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/shallow-subwoofers`,
                "name": "Shallow Subwoofers",
                "description": "Discover All Shallow Subwoofers by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/shallowsubwooferscover.webp`,
                "sku": "shallow-subwoofers",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 10,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/passive-radiators`,
                "name": "Passive Radiators",
                "description": "Discover All Passive Radiators by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/passiveradiatorscover.webp`,
                "sku": "passive-radiators",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 11,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/coaxials`,
                "name": "Coaxial",
                "description": "Discover All Coaxials by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/coaxialscover.webp`,
                "sku": "coaxials",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            },
            {
            "@type": "ListItem",
            "position": 12,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/drivers/oem`,
                "name": "OEM",
                "description": "Discover All OEM by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/drivercover/oemcover.webp`,
                "sku": "oem",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            }]
        };
        const rows = [
            createData('All Drivers', "/images/sbacoustics/drivercover/tweeterscover.webp", '/drivers/all'),
            createData('Tweeters', "/images/sbacoustics/drivercover/tweeterscover.webp", '/drivers/tweeters'),
            // createData('Filler Drivers', "/images/sbacoustics/drivercover/fillerdriverscover.webp", '/drivers/filler-drivers'),
            createData('Widebanders', "/images/sbacoustics/drivercover/widebanderscover.webp", '/drivers/widebanders'),
            createData('Midranges', "/images/sbacoustics/drivercover/midrangescover.webp", '/drivers/midranges'),
            createData('Midwoofers', "/images/sbacoustics/drivercover/midwooferscover.webp", '/drivers/midwoofers'),
            createData('Woofers', "/images/sbacoustics/drivercover/wooferscover.webp", '/drivers/woofers'),
            createData('Full Ranges', "/images/sbacoustics/drivercover/fullrangecover.webp", '/drivers/full-ranges'),
            createData('Subwoofers', "/images/sbacoustics/drivercover/subwooferscover.webp", '/drivers/subwoofers'),
            createData('Shallow Subwoofers', "/images/sbacoustics/drivercover/shallowsubwooferscover.webp", '/drivers/shallow-subwoofers'),
            createData('Passive Radiators', "/images/sbacoustics/drivercover/passiveradiatorscover.webp", '/drivers/passive-radiators'),
            createData('Coaxials', "/images/sbacoustics/drivercover/coaxialscover.webp", '/drivers/coaxials'),
            createData('OEM', "/images/sbacoustics/drivercover/oemcover.webp", '/drivers/oem'),
        ];
        return(
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
                <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                /> 
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <h1 className="sr-only">All Drivers | SB Acoustics</h1>
                {rows.map((item, i) => (
                    <div key={i}>
                    <Link 
                        href={`${item.link}`} 
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickable
                            src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                            alt={`${item.value} by SB Acoustics`}
                            width={1000}
                            height={1000}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">{item.value}</h2>
                    </Link>
                    </div>
                ))}
                </div>
            </div>
        );
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

    let [tempData, allSpecsCombined]: [AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>] = await getAllProductsForFilterPage(process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID, 'drivers', subslug, subsubslug);

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": !subslug ? `${baseUrl}/drivers` : subslug === 'all' ? `${baseUrl}/drivers/all` : subslug && !subsubslug ? `${baseUrl}/drivers/${subslug}` : subslug && subsubslug ? `${baseUrl}/drivers/${subslug}/${subsubslug}` : `${baseUrl}/drivers`, 
        "name": `${!subslug || subslug === 'all' ? `All Drivers` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All Drivers`} | SB Acoustics`,
        "description": `Found out more about ${!subslug || subslug === 'all' ? `All` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All`} Drivers from SB Acoustics!`,
        "itemListElement": tempData?.map((driver: AllFilterProductsOnlyType, index: number) => ({
         "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "url": `${baseUrl}/products/${driver.products.slug}`,
            "name": driver.products.name,
            "description": driver.products.name,
            "image": `${baseUrl}${driver.products.cover_img}`,
            "sku": driver.products.slug || driver.products.id,
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
      
      <h1 className='sr-only'>{!subslug || subslug === 'all' ? `All Drivers` 
        : subslug && !subsubslug ? subCatName?.name : subslug && subsubslug ? subSubCatName?.name : `All Drivers`} | SB Acoustics</h1>
      
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

