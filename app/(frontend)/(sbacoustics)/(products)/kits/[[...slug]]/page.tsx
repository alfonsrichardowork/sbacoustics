
import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";
import AllDriversProducts from '../../components-all-drivers-page/all-product';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';

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
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "url": `${baseUrl}/kits`,
            "name": "SB Acoustics",
            "description": `All Kits Products Provided by SB Acoustics`,
            "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Product",
                "url": `${baseUrl}/kits/sb-acoustics-kits`,
                "name": "SB Acoustics Kits",
                "description": "Discover All SB Acoustics Kits by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/kitscover/sbacousticskitscover.jpg`,
                "sku": "sb-acoustics-kits",
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
                "url": `${baseUrl}/kits/open-source-kits`,
                "name": "Open Source Kits",
                "description": "Discover Open Source Kits by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/kitscover/opensourcekitscover.jpg`,
                "sku": "open-source-kits",
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
                "url": `${baseUrl}/kits/accessories`,
                "name": "Accessories",
                "description": "Discover Accessories by SB Acoustics",
                "image": `${baseUrl}/images/sbacoustics/kitscover/accessoriescover.jpg`,
                "sku": "accessories",
                "brand": {
                "@type": "Brand",
                "name": "SB Acoustics"
                }
            }
            }]
        };

        const rows = [
            createData('SB Acoustics Kits', "/images/sbacoustics/kitscover/sbacousticskitscover.jpg", '/kits/sb-acoustics-kits'),
            createData('Open Source Kits', "/images/sbacoustics/kitscover/opensourcekitscover.jpg", '/kits/open-source-kits'),
            createData('Accessories', "/images/sbacoustics/kitscover/accessoriescover.jpg", '/kits/accessories'),
            // createData('Discontinued', "/images/sbacoustics/kitscover/discontinuedcover.jpg", '/kits/discontinued'),
        ];
        return(
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <h1 className="sr-only">All Kits | SB Acoustics</h1>
                {rows.map((item, i) => (
                <div key={i}>
                    <Link 
                    href={`${item.link}`} 
                    className="group cursor-pointer space-y-4 block"
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

