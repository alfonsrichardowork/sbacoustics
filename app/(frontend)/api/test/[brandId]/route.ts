// import { NextResponse } from "next/server";
// import prismadb from '@/lib/prismadb';

// export async function GET() {
//     // const connectors = await prismadb.allproductcategory.findMany({
//     //     where: {
//     //         category: {
//     //         brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
//     //         },
//     //         product: {
//     //         brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
//     //         },
//     //     },
//     //     select: {
//     //         productId: true,
//     //         category: {
//     //             select: {
//     //                 slug: true,
//     //                 type: true,
//     //             },
//     //         },
//     //     },
//     // });

//     // const paths = Array.from(
//     // connectors.reduce((map, row) => {
//     //     const existing = map.get(row.productId) ?? [];

//     //     existing.push({
//     //     slug: row.category.slug,
//     //     type: row.category.type,
//     //     });

//     //     map.set(row.productId, existing);

//     //     return map;
//     // }, new Map<string, { slug: string; type: string }[]>()).values()
//     // ).flatMap(categories => {
//     // const category = categories
//     //     .filter(c => c.type === 'Category' && c.slug === 'drivers')
//     //     .map(c => c.slug);

//     // const subCategory = categories
//     //     .filter(c => c.type === 'Sub Category')
//     //     .map(c => c.slug);

//     // const subSubCategory = categories
//     //     .filter(c => c.type === 'Sub Sub Category')
//     //     .map(c => c.slug);

//     // const result: string[] = [];

//     // // Category only
//     // if (!subCategory.length) {
//     //     return category;
//     // }

//     // // Category + Sub Category
//     // for (const cat of category) {
//     //     for (const sub of subCategory) {
//     //     if (!subSubCategory.length) {
//     //         result.push(`${cat}/${sub}`);
//     //     } else {
//     //         // Category + Sub Category + Sub Sub Category
//     //         for (const subSub of subSubCategory) {
//     //         result.push(`${cat}/${sub}/${subSub}`);
//     //         }
//     //     }
//     //     }
//     // }

//     // return result;
//     // });

//     // const allPaths = new Set<string>();

//     // for (const path of paths) {
//     //     const parts = path.split('/');

//     //     // Original path
//     //     allPaths.add(path);

//     //     // Level 1 (/drivers)
//     //     if (parts.length >= 1) {
//     //         allPaths.add(parts[0] ?? '');
//     //     }

//     //     // Level 2 (/drivers/midranges)
//     //     if (parts.length >= 2) {
//     //         allPaths.add(parts.slice(0, 2).join('/'));
//     //     }
//     // }

//     // const uniqueSortedPaths = [...allPaths].sort((a, b) => {
//     //     const depthA = a.split('/').length;
//     //     const depthB = b.split('/').length;

//     //     if (depthA !== depthB) {
//     //         return depthA - depthB;
//     //     }

//     //     return a.localeCompare(b);
//     // });

//     const allCat = await prismadb.allcategory.findMany({
//         where: {
//             under_categoryId: { not: '' },
//             brandId : '680c5eee-7ed7-41bc-b14b-4185f8a1c379'
//         }
//     })


//     const products = await prismadb.allproductcategory.findMany({
//         where: {
            
//         }
//     })

    
//     return NextResponse.json('');
// }






import prismadb from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

type CategoryRecord = Awaited<ReturnType<typeof loadCategories>>[number]
type ProductRecord = CategoryRecord['productCategories'][number]['product']
type MenuPriorityRecord = Awaited<ReturnType<typeof loadMenuPriorities>>[number]

type CategoryNode = CategoryRecord & { children: CategoryNode[] }

async function loadCategories(brandId?: string) {
  return prismadb.allcategory.findMany({
    where: brandId ? { brandId } : undefined,
    include: { productCategories: { include: { product: true } } },
  })
}

async function loadMenuPriorities(categoryIds: string[]) {
  return prismadb.menupriority.findMany({
    where: { categoryId: { in: categoryIds } },
  })
}

/** "" / "abc" -> Infinity, "10" -> 10, "2.5" -> 2.5 */
function priorityValue(priority?: string | null) {
  if (priority == null) return Number.POSITIVE_INFINITY
  const trimmed = priority.trim()
  if (!trimmed) return Number.POSITIVE_INFINITY
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY
}

/** numeric priority first, then name (natural), then id for stability */
function compareByPriority(
  a: { priority?: string; name: string; id: string },
  b: { priority?: string; name: string; id: string },
) {
  return (
    priorityValue(a.priority) - priorityValue(b.priority) ||
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }) ||
    a.id.localeCompare(b.id)
  )
}

function buildHierarchy(categories: CategoryRecord[]) {
  const nodes = new Map<string, CategoryNode>()
  for (const category of categories) nodes.set(category.id, { ...category, children: [] })

  const roots: CategoryNode[] = []
  for (const node of nodes.values()) {
    const parentId = node.under_categoryId?.trim()
    const parent = parentId ? nodes.get(parentId) : undefined
    if (parent && parent.id !== node.id) parent.children.push(node)
    else roots.push(node)
  }

  const sortChildren = (node: CategoryNode) => {
    node.children.sort(compareByPriority)
    node.children.forEach(sortChildren)
  }
  roots.sort(compareByPriority)
  roots.forEach(sortChildren)

  return { nodes, roots }
}

/**
 * Walks the ancestor chain and joins names while EVERY link in the chain
 * (parent and child) has combine_name === true.
 * e.g. "Cat 1" (combine) -> "Cat 2" (combine) => "Cat 1 / Cat 2"
 */
function getCombinedName(node: CategoryNode, nodes: Map<string, CategoryNode>) {
  const parts: string[] = [node.name]
  let current = node
  const seen = new Set<string>([node.id])

  while (current.combine_name) {
    const parentId = current.under_categoryId?.trim()
    if (!parentId || seen.has(parentId)) break
    const parent = nodes.get(parentId)
    if (!parent || !parent.combine_name) break
    parts.unshift(parent.name)
    seen.add(parent.id)
    current = parent
  }

  return parts.join(' / ')
}

function serializeProduct(product: ProductRecord) {
  return {
    id: product.id,
    brandId: product.brandId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    cover_img_url: product.cover_img_url,
    drawing_img_url: product.drawing_img_url,
    graph_img_url: product.graph_img_url,
    featured_img_url: product.featured_img_url,
    featuredDesc: product.featuredDesc,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    isKits: product.isKits,
    isNewProduct: product.isNewProduct,
    navbarNotes: product.navbarNotes,
    sizeId: product.sizeId,
    priority: product.priority,
    updatedBy: product.updatedBy,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

type SerializedProduct = ReturnType<typeof serializeProduct>
type SerializedCategory = {
  id: string
  brandId: string
  type: string
  name: string
  displayName: string
  singularname: string
  slug: string
  description: string
  priority: string
  thumbnail_url: string
  shown_on_all_drivers_page: boolean
  under_categoryId: string
  combine_name: boolean
  show_products: boolean
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  children: SerializedCategory[]
  products?: SerializedProduct[]
}

function getCategoryDistances(node: CategoryNode) {
  const distances = new Map<string, number>()
  const visit = (current: CategoryNode, distance: number, path = new Set<string>()) => {
    if (path.has(current.id)) return
    distances.set(current.id, distance)
    const nextPath = new Set(path).add(current.id)
    current.children.forEach((child) => visit(child, distance + 1, nextPath))
  }
  visit(node, 0)
  return distances
}

function serializeCategory(
  node: CategoryNode,
  nodes: Map<string, CategoryNode>,
  menuPriorities: Map<string, MenuPriorityRecord[]>,
): SerializedCategory {
  const categoryDistances = getCategoryDistances(node)
  const products = new Map<string, { product: ProductRecord; distance: number; priority: number }>()

  if (node.show_products) {
    for (const [categoryId, distance] of categoryDistances) {
      const category = nodes.get(categoryId)
      if (!category) continue
      for (const link of category.productCategories) {
        const entries = menuPriorities.get(link.product.id) ?? []
        // prefer a priority set on THIS menu node, else the owning category
        const priority = priorityValue(
          entries.find((item) => item.categoryId === node.id)?.priorityNumber ??
            entries.find((item) => item.categoryId === categoryId)?.priorityNumber,
        )
        const existing = products.get(link.product.id)
        if (existing && (existing.priority < priority || (existing.priority === priority && existing.distance <= distance))) {
          continue
        }
        products.set(link.product.id, { product: link.product, distance, priority })
      }
    }
  }

  const orderedProducts = [...products.values()]
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        a.distance - b.distance ||
        a.product.name.localeCompare(b.product.name, undefined, { numeric: true, sensitivity: 'base' }) ||
        a.product.id.localeCompare(b.product.id),
    )
    .map(({ product }) => serializeProduct(product))

  return {
    id: node.id,
    brandId: node.brandId,
    type: node.type,
    name: node.name,
    displayName: getCombinedName(node, nodes),
    singularname: node.singularname,
    slug: node.slug,
    description: node.description,
    priority: node.priority,
    thumbnail_url: node.thumbnail_url,
    shown_on_all_drivers_page: node.shown_on_all_drivers_page,
    under_categoryId: node.under_categoryId,
    combine_name: node.combine_name,
    show_products: node.show_products,
    updatedBy: node.updatedBy,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    children: node.children.map((child) => serializeCategory(child, nodes, menuPriorities)),
    ...(node.show_products ? { products: orderedProducts } : {}),
  }
}

export async function GET(request: NextRequest) {
  try {
    const brandId =
      request.nextUrl.searchParams.get('brandId')?.trim() || '680c5eee-7ed7-41bc-b14b-4185f8a1c379'
    const categories = await loadCategories(brandId)
    const { roots, nodes } = buildHierarchy(categories)
    const priorities = await loadMenuPriorities([...nodes.keys()])

    const menuPriorities = new Map<string, MenuPriorityRecord[]>()
    for (const priority of priorities) {
      const list = menuPriorities.get(priority.productId) ?? []
      list.push(priority)
      menuPriorities.set(priority.productId, list)
    }

    return NextResponse.json({
      categories: roots.map((root) => serializeCategory(root, nodes, menuPriorities)),
    })
  } catch (error) {
    console.error('[categories] Failed to build category hierarchy', error)
    return NextResponse.json({ error: 'Unable to load categories' }, { status: 500 })
  }
}
