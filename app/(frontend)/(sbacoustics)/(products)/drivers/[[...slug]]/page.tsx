import { AllFilterProductsOnlyType, CheckBoxData, ChildSpecificationProp, SliderData } from '@/app/(frontend)/types';
import { LazyImageClickable } from '@/components/lazyImageclickable';
import prismadb from '@/lib/prismadb';
import Link from "next/link";
import AllDriversandFiltersProducts from '../../components-all-drivers-page/all-filters';
import { getAllProductsForFilterPage } from '@/app/(frontend)/actions/get-all-products-for-filter-page';
import { buildNavbarMenus, NavbarMenus } from '@/components/build-navbar-menu';
import { buildHierarchy, serializeCategory, SerializedCategory } from '@/app/(frontend)/actions/get-all-navbar-content';


export function getNavbarRoutes(menus: NavbarMenus): string[][] {
  const allRoutes = [
    ...menus.firstMenu,
    ...Object.values(menus.subMenuMapping).flat(),
    ...Object.values(menus.subSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubSubMenuMapping).flat(),
  ]
    .map(item => item.href)
    .filter(
      (href): href is string =>
        !!href && !href.startsWith('/products/')
    );

  return menus.firstMenu.map(first => {
    return [
      ...new Set(
        allRoutes.filter(
          href =>
            href === first.href ||
            href.startsWith(`${first.href}/`)
        )
      ),
    ];
  });
}


export const revalidate = 60;

export async function generateStaticParams() {
    
    const categories = await prismadb.allcategory.findMany({
        where: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
        OR: [
            { shown_on_all_drivers_page: true },
            { under_categoryId: { not: "" } },
        ],
        },
        select: {
        id: true,
        name: true,
        type: true,
        singularname: true,
        slug: true,
        priority: true,
        shown_on_all_drivers_page: true,
        under_categoryId: true,
        combine_name: true,
        show_products: true,
        },
    })

    const allBrandCategories = await prismadb.allcategory.findMany({
        where: { brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
        select: { id: true, under_categoryId: true },
    })

    const categoryParentMap = new Map(
        allBrandCategories.map((c) => [c.id, c.under_categoryId])
    )

    const getCategoryFamily = (categoryId: string) => {
        const family: string[] = []
        const visited = new Set<string>()
        let currentId = categoryId

        while (currentId && !visited.has(currentId)) {
        visited.add(currentId)
        family.push(currentId)

        const parentId = categoryParentMap.get(currentId)
        if (!parentId || parentId === "") break

        currentId = parentId
        }

        return family
    }

    const productCategoryIds = categories
        .filter((c) => c.show_products)
        .map((c) => c.id)

    const categoryFamilies = productCategoryIds.map((categoryId) => ({
        categoryId,
        family: getCategoryFamily(categoryId),
    }))

    const requiredCategoryIds = [
        ...new Set(categoryFamilies.flatMap(({ family }) => family)),
    ]

    const productCategoryRelations =
        requiredCategoryIds.length > 0
        ? await prismadb.allproductcategory.findMany({
            where: { categoryId: { in: requiredCategoryIds } },
            select: { productId: true, categoryId: true },
            })
        : []

    const productCategoryMap = new Map<string, Set<string>>()

    for (const item of productCategoryRelations) {
        if (!productCategoryMap.has(item.productId)) {
        productCategoryMap.set(item.productId, new Set())
        }
        productCategoryMap.get(item.productId)!.add(item.categoryId)
    }

    const qualifyingProductIdsByCategory: Record<string, string[]> = {}

    for (const { categoryId, family } of categoryFamilies) {
        qualifyingProductIdsByCategory[categoryId] = [
        ...productCategoryMap.entries(),
        ]
        .filter(([, productCategories]) =>
            family.every((familyCategoryId) =>
            productCategories.has(familyCategoryId)
            )
        )
        .map(([productId]) => productId)
    }

    for (const category of categories) {
        if (!category.show_products) {
        continue
        }

        const currentProducts =
        qualifyingProductIdsByCategory[category.id] ?? []

        if (currentProducts.length === 0) {
        continue
        }

        
        const descendantCategoryIds = categories
        .filter((possibleDescendant) => {
            if (
            possibleDescendant.id === category.id ||
            !possibleDescendant.show_products
            ) {
            return false
            }

            let currentId = possibleDescendant.id
            const visited = new Set<string>()

            while (currentId && !visited.has(currentId)) {
            visited.add(currentId)

            const parentId = categoryParentMap.get(currentId)

            if (!parentId || parentId === "") {
                break
            }

            if (parentId === category.id) {
                return true
            }

            currentId = parentId
            }

            return false
        })
        .map((possibleDescendant) => possibleDescendant.id)

        if (descendantCategoryIds.length === 0) {
        continue
        }

        const productsClaimedByDescendants = new Set(
        descendantCategoryIds.flatMap(
            (descendantCategoryId) =>
            qualifyingProductIdsByCategory[descendantCategoryId] ?? []
        )
        )

        // Remove those products from this parent category.
        qualifyingProductIdsByCategory[category.id] =
        currentProducts.filter(
            (productId) =>
            !productsClaimedByDescendants.has(productId)
        )
    }

    const allQualifyingProductIds = [
        ...new Set(Object.values(qualifyingProductIdsByCategory).flat()),
    ]

    const productCategories =
        allQualifyingProductIds.length > 0
        ? await prismadb.allproductcategory.findMany({
            where: {
                productId: { in: allQualifyingProductIds },
                categoryId: { in: productCategoryIds },
            },
            select: {
                id: true,
                categoryId: true,
                productId: true,
                priority: true,
                product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    cover_img_url: true,
                    isKits: true,
                    isNewProduct: true,
                    navbarNotes: true,
                    tempAllFinished: true,
                    isArchived: true,
                },
                },
            },
            })
        : []

    const linksByCategoryAndProduct = new Map<
        string,
        (typeof productCategories)[number]
    >()

    for (const link of productCategories) {
        linksByCategoryAndProduct.set(
        `${link.categoryId}::${link.productId}`,
        link
        )
    }

    const priorityValue = (raw?: string | null) => {
        const n = Number(raw?.trim())
        return raw?.trim() && Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
    }

    const x = categories.map((category) => {
        const qualifyingProductIds =
        qualifyingProductIdsByCategory[category.id] ?? []

        const categoryProducts = qualifyingProductIds
        .map((productId) =>
            linksByCategoryAndProduct.get(`${category.id}::${productId}`)
        )
        .filter(
            (link): link is (typeof productCategories)[number] => Boolean(link)
        )
        .sort(
            (a, b) =>
            priorityValue(a.priority) - priorityValue(b.priority) ||
            (a.product?.name ?? "").localeCompare(b.product?.name ?? "")
        )

        return {
        id: category.id,
        name: category.name,
        type: category.type,
        singularname: category.singularname,
        slug: category.slug,
        priority: category.priority,
        shown_on_all_drivers_page: category.shown_on_all_drivers_page,
        under_categoryId: category.under_categoryId,
        combine_name: category.combine_name,
        show_products: category.show_products,

        productCategories: categoryProducts,
        }
    })

    const { roots } = buildHierarchy(x)
    const navbarData: SerializedCategory[] = roots.map(serializeCategory)
    const menus = buildNavbarMenus(navbarData)
    const y = getNavbarRoutes(menus)
    const firstRouteGroup = y[0] ?? []

    return firstRouteGroup.map((path) => ({
        slug: path.split('/').slice(2),
    }))
}

function removeDuplicates<RangeSliderFilter>(arr: RangeSliderFilter[]): RangeSliderFilter[] {
  return Array.from(new Set(arr));
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
            },
        });

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

        const uniqueCategories = [
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

        const allDriver = await prismadb.allcategory.findFirst({
        where: {
            slug: 'drivers',
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
            ...(allDriver
                ? [{
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                    "@type": "Product",
                    "url": `${baseUrl}/drivers/all`,
                    "name": `All ${allDriver.name}`,
                    "description": `Discover All ${allDriver.name} by SB Acoustics`,
                    "image": allDriver.thumbnail_url.startsWith('/uploads/')
                        ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allDriver.thumbnail_url}`
                        : allDriver.thumbnail_url,
                    "sku": `all-${allDriver.slug}`,
                    "brand": {
                        "@type": "Brand",
                        "name": "SB Acoustics",
                    },
                    },
                }]
            : []),

            ...uniqueCategories.map((val, index) => ({
                "@type": "ListItem",
                "position": index + (allDriver ? 2 : 1),
                "item": {
                "@type": "Product",
                "url": `${baseUrl}${val.url}`,
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
            "url": `${baseUrl}/drivers`,
            "name": "SB Acoustics",
            "description": "All Drivers Provided by SB Acoustics",
            itemListElement,
        }
        return(
            <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4"> 
                <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                /> 
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <h1 className="sr-only">All Drivers | SB Acoustics</h1>
                {allDriver &&
                    <div>
                    <Link 
                        href='/drivers/all'
                        className=" group cursor-pointer space-y-4 block"
                    >
                        <div className="relative aspect-square">
                        <LazyImageClickable
                            src={allDriver.thumbnail_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${allDriver.thumbnail_url}` : allDriver.thumbnail_url} 
                            alt={`${allDriver.name} by SB Acoustics`}
                            width={1000}
                            height={1000}
                        />
                        </div>
                        
                        <h2 className="font-bold text-xl text-center">All {allDriver.name}</h2>
                    </Link>
                    </div>
                }


                {uniqueCategories.map((item, i) => (
                    <div key={i}>
                    <Link 
                        href={item.url}
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "url": !subslug ? `${baseUrl}/drivers` : subslug === 'all' ? `${baseUrl}/drivers/all` : subslug && !subsubslug && !subsubsubslug ? `${baseUrl}/drivers/${subslug}` : subslug && subsubslug && !subsubsubslug ? `${baseUrl}/drivers/${subslug}/${subsubslug}` : subslug && subsubslug && subsubsubslug ? `${baseUrl}/drivers/${subslug}/${subsubslug}/${subsubsubslug}` : `${baseUrl}/drivers`, 
        "name": `${!subslug || subslug === 'all' ? `All Drivers` 
        : subslug && !subsubslug && !subsubsubslug ? subCatName?.name : subslug && subsubslug && !subsubsubslug ? subSubCatName?.name : subslug && subsubslug && subsubsubslug ? subSubsubCatName?.name : `All Drivers`} | SB Acoustics`,
        "description": `Found out more about ${!subslug || subslug === 'all' ? `All` 
        : subslug && !subsubslug && !subsubsubslug ? subCatName?.name : subslug && subsubslug && !subsubsubslug ? subSubCatName?.name : subslug && subsubslug && subsubsubslug ? subSubsubCatName?.name : `All`} Drivers from SB Acoustics!`,
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
        : subslug && !subsubslug && !subsubsubslug ? subCatName?.name : subslug && subsubslug && !subsubsubslug ? subSubCatName?.name : subslug && subsubslug && subsubsubslug ? subSubsubCatName?.name : `All Drivers`} | SB Acoustics</h1>
      
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

