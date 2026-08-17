type CategoryRecord = Awaited<ReturnType<typeof loadCategories>>[number]
type ProductLink = CategoryRecord['productCategories'][number]
type ProductRecord = ProductLink['product']

type CategoryNode = CategoryRecord & { children: CategoryNode[] }

async function loadCategories(brandId?: string) {
  const response = await fetch(`/api/test/categories/${brandId}`)
  if (!response.ok) {
    throw new Error('Failed to load categories')
  }
  return response.json()
}

/** "" / "abc" -> Infinity, "10" -> 10, "2.5" -> 2.5 */
function priorityValue(priority?: string | null) {
  if (priority == null) return Number.POSITIVE_INFINITY
  const trimmed = String(priority).trim()
  if (!trimmed) return Number.POSITIVE_INFINITY
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY
}

function compareByPriority(
  a: { priority?: string | null },
  b: { priority?: string | null },
) {
  return priorityValue(a.priority) - priorityValue(b.priority)
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

function getCombinedName(node: CategoryNode) {
  const parts: string[] = [node.name]
  let current = node
  const seen = new Set<string>([node.id])

  while (current.combine_name) {
    const child = current.children.find(
      (c: CategoryNode) => c.combine_name && !seen.has(c.id),
    )
    if (!child) break
    parts.push(child.name)
    seen.add(child.id)
    current = child
  }

  return parts.join(' / ')
}

function serializeProduct(product: ProductRecord, priority: string | null) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    cover_img_url: product.cover_img_url,
    isKits: product.isKits,
    isNewProduct: product.isNewProduct,
    navbarNotes: product.navbarNotes,
    priority: priority ?? '',
    tempAllFinished: product.tempAllFinished,
    isArchived: product.isArchived,
  }
}

type SerializedProduct = ReturnType<typeof serializeProduct>

export type SerializedCategory = {
  id: string
  type: string
  name: string
  displayName: string
  singularname: string
  slug: string
  priority: string
  shown_on_all_drivers_page: boolean
  under_categoryId: string
  combine_name: boolean
  show_products: boolean
  children: SerializedCategory[]
  products?: SerializedProduct[]
}

function serializeCategory(node: CategoryNode): SerializedCategory {
  const products = new Map<string, { product: ProductRecord; priority: string | null }>()

  if (node.show_products) {
    // Only links attached directly to this category; children keep their own.
    for (const link of node.productCategories) {
      if (!link.product) continue
      const existing = products.get(link.product.id)
      if (existing && priorityValue(existing.priority) <= priorityValue(link.priority)) continue
      products.set(link.product.id, { product: link.product, priority: link.priority })
    }
  }

  const orderedProducts = [...products.values()]
    .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority))
    .map(({ product, priority }) => serializeProduct(product, priority))

  return {
    id: node.id,
    type: node.type,
    name: node.name,
    displayName: getCombinedName(node),
    singularname: node.singularname,
    slug: node.slug,
    priority: node.priority,
    shown_on_all_drivers_page: node.shown_on_all_drivers_page,
    under_categoryId: node.under_categoryId,
    combine_name: node.combine_name,
    show_products: node.show_products,
    children: node.children.map(serializeCategory),
    ...(node.show_products ? { products: orderedProducts } : {}),
  }
}

const getAllNavbarContent = async (path: string): Promise<SerializedCategory[]> => {
  const brandId = path.includes('sbaudience')
    ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    : path.includes('sbautomotive')
      ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
      : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID

  const categories = await loadCategories(brandId)
  const { roots } = buildHierarchy(categories)
  return roots.map(serializeCategory)
}

export default getAllNavbarContent
