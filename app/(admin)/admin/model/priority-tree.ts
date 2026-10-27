export type PriorityProduct = {
  id: string
  name: string
  priority: string
  categoryId: string
}

export type CategoryNode = {
  id: string
  name: string
  priority: string
  showProducts: boolean
  children: CategoryNode[]
  products: PriorityProduct[]
}

export type PriorityCategoryRecord = {
  id: string
  name: string
  priority: string | null
  show_products: boolean
  under_categoryId: string | null
}

export type PriorityProductRecord = {
  id: string
  name: string
  links: { categoryId: string; priority: string | null }[]
}

export function sortByPriority<T extends { priority: string }>(items: T[]) {
  const value = (raw: string) => {
    const n = Number(raw?.trim())
    return raw?.trim() && Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
  }
  return [...items].sort((a, b) => value(a.priority) - value(b.priority))
}

export function normalizeTree(nodes: CategoryNode[]): CategoryNode[] {
  return sortByPriority(nodes).map((node) => ({
    ...node,
    products: sortByPriority(node.products),
    children: normalizeTree(node.children),
  }))
}

export function buildCategoryPriorityTree(
  categories: PriorityCategoryRecord[],
  products: PriorityProductRecord[],
): CategoryNode[] {
  const included = new Set(categories.filter((c) => c.show_products).map((c) => c.id))

  // one product -> ONE ENTRY PER INCLUDED CATEGORY LINK (no "owning category" collapse)
  const productsByCategory = new Map<string, PriorityProduct[]>()
  for (const product of products) {
    for (const link of product.links) {
      if (!included.has(link.categoryId)) continue
      const list = productsByCategory.get(link.categoryId) ?? []
      list.push({
        id: product.id,
        name: product.name,
        priority: link.priority ?? '',
        categoryId: link.categoryId,
      })
      productsByCategory.set(link.categoryId, list)
    }
  }

  const nodes = new Map<string, CategoryNode>(
    categories.map((c) => [
      c.id,
      {
        id: c.id,
        name: c.name,
        priority: c.priority ?? '',
        showProducts: c.show_products,
        children: [],
        products: productsByCategory.get(c.id) ?? [],
      },
    ]),
  )

  const roots: CategoryNode[] = []
  for (const c of categories) {
    const node = nodes.get(c.id)!
    const parent = c.under_categoryId ? nodes.get(c.under_categoryId) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  }

  return normalizeTree(roots)
}
