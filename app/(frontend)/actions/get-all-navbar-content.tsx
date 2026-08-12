type CategoryRecord = Awaited<ReturnType<typeof loadCategories>>[number]
type ProductRecord = CategoryRecord['productCategories'][number]['product']
type MenuPriorityRecord = Awaited<ReturnType<typeof loadMenuPriorities>>[number]

type CategoryNode = CategoryRecord & { children: CategoryNode[] }

async function loadCategories(brandId?: string) {
  const response = await fetch(`/api/test/categories/${brandId}`);
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  return response.json();
}

async function loadMenuPriorities(categoryIds: string[]) {
    const categoryIdsParam = categoryIds.join(', ')

    const response = await fetch(
        `/api/test/priorities/${encodeURIComponent(categoryIdsParam)}`
    )

    if (!response.ok) {
        throw new Error('Failed to load menu priorities')
    }

    return response.json()
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

function getCombinedName(node: CategoryNode, _nodes: Map<string, CategoryNode>) {
  const parts: string[] = [node.name]
  let current = node
  const seen = new Set<string>([node.id])

  while (current.combine_name) {
    // children are already priority-sorted; take the first combinable one
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

function serializeProduct(product: ProductRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    cover_img_url: product.cover_img_url,
    isKits: product.isKits,
    isNewProduct: product.isNewProduct,
    navbarNotes: product.navbarNotes,
    priority: product.priority,
    tempAllFinished: product.tempAllFinished,
    isArchived: product.isArchived
  }
}

type SerializedProduct = ReturnType<typeof serializeProduct>
export type SerializedCategory = {
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

function serializeCategory(
  node: CategoryNode,
  nodes: Map<string, CategoryNode>,
  menuPriorities: Map<string, MenuPriorityRecord[]>,
): SerializedCategory {
  const products = new Map<string, { product: ProductRecord; priority: number }>()

  if (node.show_products) {
    // ONLY links attached directly to this category — children keep their own.
    for (const link of node.productCategories) {
      const entries = menuPriorities.get(link.product.id) ?? []
      const priority = priorityValue(
        entries.find((item) => item.categoryId === node.id)?.priorityNumber,
      )
      const existing = products.get(link.product.id)
      if (existing && existing.priority <= priority) continue
      products.set(link.product.id, { product: link.product, priority })
    }
  }

  const orderedProducts = [...products.values()]
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        a.product.name.localeCompare(b.product.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        }) ||
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
    children: node.children.map((child: any) => serializeCategory(child, nodes, menuPriorities)),
    ...(node.show_products ? { products: orderedProducts } : {}),
  }
}


const getAllNavbarContent = async (path: string): Promise<SerializedCategory[]> => {
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
  const categories = await loadCategories(brandId)
  const { roots, nodes } = buildHierarchy(categories)
  const priorities = await loadMenuPriorities([...nodes.keys()])

  const menuPriorities = new Map<string, MenuPriorityRecord[]>()
  for (const priority of priorities) {
    const list = menuPriorities.get(priority.productId) ?? []
    list.push(priority)
    menuPriorities.set(priority.productId, list)
  }
  return roots.map((root) => serializeCategory(root, nodes, menuPriorities))
};

export default getAllNavbarContent;

