import prismadb from '@/lib/prismadb'
import {
  CategoryNode,
  CategoryPriorityManager,
  PriorityCategoryRecord,
  PriorityProduct,
  PriorityProductRecord,
} from './components/priority-form'

function sortByPriority<T extends { priority: string }>(items: T[]) {
  const value = (raw: string) => {
    const n = Number(raw?.trim())
    return raw?.trim() && Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
  }
  return [...items].sort((a, b) => value(a.priority) - value(b.priority))
}

export function normalizeTree(nodes: CategoryNode[]): CategoryNode[] {
  return sortByPriority(nodes).map((node) => ({
    ...node,
    children: normalizeTree(node.children),
    products: sortByPriority(node.products),
  }))
}

export function buildCategoryPriorityTree(
  categories: PriorityCategoryRecord[],
  products: PriorityProductRecord[],
): CategoryNode[] {
  const byParent = new Map<string | null, PriorityCategoryRecord[]>()
  for (const category of categories) {
    const parent = category.under_categoryId?.trim() || null
    byParent.set(parent, [...(byParent.get(parent) ?? []), category])
  }

  // depth of every category, so we can find the deepest link of a product
  const depthById = new Map<string, number>()
  const walk = (parent: string | null, depth: number) => {
    for (const category of byParent.get(parent) ?? []) {
      depthById.set(category.id, depth)
      walk(category.id, depth + 1)
    }
  }
  walk(null, 0)

  // one product -> exactly one owning category (deepest link)
  const productsByCategory = new Map<string, PriorityProduct[]>()
  for (const product of products) {
    const links = product.links.filter((link) => depthById.has(link.categoryId))
    if (!links.length) continue

    const owner = links.reduce((best, link) =>
      (depthById.get(link.categoryId) ?? -1) > (depthById.get(best.categoryId) ?? -1) ? link : best,
    )

    productsByCategory.set(owner.categoryId, [
      ...(productsByCategory.get(owner.categoryId) ?? []),
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        categoryId: owner.categoryId,
        priority: owner.priority ?? '',
      },
    ])
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

export default async function Page(props: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await props.params

  const allBrandCategories = await prismadb.allcategory.findMany({
    where: { brandId },
    select: {
      id: true, name: true, type: true, priority: true,
      under_categoryId: true, shown_on_all_drivers_page: true,
    },
  })

  const shown = allBrandCategories.filter((c) => c.shown_on_all_drivers_page)
  const shownIds = new Set(shown.map((c) => c.id))
  // 'Category' type is top level; anything else shown sits under its parent
  const roots = shown.filter(
    (c) => c.type === 'Category' || !c.under_categoryId?.trim() || !shownIds.has(c.under_categoryId.trim()),
  )

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

  const products = await prismadb.product.findMany({
    where: {
      brandId,
      isArchived: false,
      allCat: { some: { categoryId: { in: [...seen] } } },
    },
    select: {
      id: true, name: true, slug: true, cover_img_url: true,
      allCat: { select: { categoryId: true, priority: true } },
    },
  })

  const categories: PriorityCategoryRecord[] = included.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    priority: c.priority,
    under_categoryId: roots.some((r) => r.id === c.id) ? null : c.under_categoryId || null,
  }))

  const adaptedProducts: PriorityProductRecord[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.cover_img_url ?? undefined,
    links: p.allCat
      .filter((rel) => seen.has(rel.categoryId))
      .map((rel) => ({ categoryId: rel.categoryId, priority: rel.priority ?? '' })),
  }))

  return (
    <CategoryPriorityManager
      initialTree={buildCategoryPriorityTree(categories, adaptedProducts)}
      brandId={brandId}
    />
  )
}
