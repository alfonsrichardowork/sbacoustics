import prismadb from '@/lib/prismadb'
import {
  CategoryNode,
  CategoryPriorityManager,
  PriorityCategoryRecord,
  PriorityProduct,
  PriorityProductRecord,
  PrismaCategoryPriorityRecord,
  PrismaProductPriorityRecord,
} from './components/priority-form'

function sortByPriority<T extends { priority: string; name: string; id: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aPriority = Number(a.priority)
    const bPriority = Number(b.priority)
    const aHasPriority = Number.isFinite(aPriority) && a.priority.trim() !== ''
    const bHasPriority = Number.isFinite(bPriority) && b.priority.trim() !== ''
    if (aHasPriority && bHasPriority && aPriority !== bPriority) return aPriority - bPriority
    if (aHasPriority !== bHasPriority) return aHasPriority ? -1 : 1
    return a.name.localeCompare(b.name) || a.id.localeCompare(b.id)
  })
}


export function normalizeTree(nodes: CategoryNode[]): CategoryNode[] {
  return sortByPriority(nodes).map((node) => ({ ...node, children: normalizeTree(node.children), products: sortByPriority(node.products) }))
}

export function buildCategoryPriorityTree(
  categories: PriorityCategoryRecord[],
  products: PriorityProductRecord[],
): CategoryNode[] {
  const productsByCategory = new Map<string, PriorityProduct[]>()
  for (const product of products) {
    for (const categoryId of product.categoryIds) {
      const categoryProducts = productsByCategory.get(categoryId) ?? []
      categoryProducts.push(product)
      productsByCategory.set(categoryId, categoryProducts)
    }
  }

  const byParent = new Map<string | null, PriorityCategoryRecord[]>()
  for (const category of categories) {
    const parent = category.under_categoryId?.trim() || null
    const siblings = byParent.get(parent) ?? []
    siblings.push(category)
    byParent.set(parent, siblings)
  }

  const makeNode = (category: PriorityCategoryRecord): CategoryNode => ({
    id: category.id,
    name: category.name,
    type: category.type,
    priority: category.priority ?? '',
    products: productsByCategory.get(category.id) ?? [],
    children: (byParent.get(category.id) ?? []).map(makeNode),
  })

  return normalizeTree((byParent.get(null) ?? []).map(makeNode))
}

export function adaptPrismaPriorityData(
  categories: PrismaCategoryPriorityRecord[],
  products: PrismaProductPriorityRecord[],
): { categories: PriorityCategoryRecord[]; products: PriorityProductRecord[] } {
  return {
    categories: categories.map((category) => ({
      ...category,
      under_categoryId: category.under_categoryId || null,
    })),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      priority: product.priority ?? '',
      image: product.cover_img_url ?? undefined,
      categoryIds: product.allCat.map((relation) => relation.categoryId),
    })),
  }
}

export default async function Page(props: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await props.params

  // every category of this brand (one query, so we can walk any depth)
  const allBrandCategories = await prismadb.allcategory.findMany({
    where: { brandId },
    select: {
      id: true,
      name: true,
      type: true,
      priority: true,
      under_categoryId: true,
      shown_on_all_drivers_page: true,
    },
  })

  // roots = shown on all drivers page
  const roots = allBrandCategories.filter(
  (category) =>
    category.shown_on_all_drivers_page &&
    !category.under_categoryId?.trim(),
  )

  // collect roots + all descendants
  const childrenByParent = new Map<string, typeof allBrandCategories>()
  for (const c of allBrandCategories) {
    const parent = c.under_categoryId?.trim()
    if (!parent) continue
    childrenByParent.set(parent, [...(childrenByParent.get(parent) ?? []), c])
  }

  const included: typeof allBrandCategories = []
  const seen = new Set<string>()
  const stack = [...roots]
  while (stack.length) {
    const current = stack.pop()!
    if (seen.has(current.id)) continue
    seen.add(current.id)
    included.push(current)
    stack.push(...(childrenByParent.get(current.id) ?? []))
  }

  const categoryIds = included.map((c) => c.id)

  const products = await prismadb.product.findMany({
    where: {
      brandId,
      isArchived: false,
      allCat: { some: { categoryId: { in: categoryIds } } },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      priority: true,
      cover_img_url: true,
      allCat: { select: { categoryId: true } },
    },
  })

  const { categories, products: adaptedProducts } = adaptPrismaPriorityData(
    // roots must look top-level to the tree builder
    included.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      priority: c.priority,
      under_categoryId: c.under_categoryId || null,
    })),
    products.map((p) => ({
      ...p,
      // keep only links inside this tree
      allCat: p.allCat.filter((rel) => seen.has(rel.categoryId)),
    })),
  )
  return (
    <CategoryPriorityManager
      initialTree={buildCategoryPriorityTree(categories, adaptedProducts)}
      brandId = {brandId}
    />
  )
}
