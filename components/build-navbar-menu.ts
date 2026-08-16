import { NavbarComponents } from '@/app/(frontend)/types'
import { SerializedCategory } from '@/app/(frontend)/actions/get-all-navbar-content'

export type NavbarMenus = {
  firstMenu: NavbarComponents[]
  subMenuMapping: Record<string, NavbarComponents[]>
  subSubMenuMapping: Record<string, NavbarComponents[]>
  subSubSubMenuMapping: Record<string, NavbarComponents[]>
  subSubSubSubMenuMapping: Record<string, NavbarComponents[]>
}

/** key used by every mapping: `${title}-${parent}` */
export const menuKey = (title: string, parent: string) => `${title}-${parent}`

const clean = (value?: string | null) => (value ?? '').trim()

/**
 * Builds a category URL from the parent path + category slug.
 */
const buildCategoryPath = (parentPath: string, slug?: string | null) => {
  const cleanSlug = clean(slug)

  if (!cleanSlug) return parentPath || '/'

  return `${parentPath}/${cleanSlug}`.replace(/\/+/g, '/')
}

function shortenMaterial(name: string): string {
  return name
    .replace(/Polypropylene/gi, "Poly")
    // .replace(/Satori /gi, "")
    .replace(/Aluminum/gi, "Alu");
}

/** category -> menu row. */
function categoryToItem(
  cat: SerializedCategory,
  hasChildren: boolean,
  href: string,
): NavbarComponents {
  return {
    title: cat.displayName || cat.name,
    parent: hasChildren ? cat.under_categoryId : '',
    href,
    url: '',
    imageDesc: '',
    newProd: false,
    tempAllFinished: false,
  } as NavbarComponents
}

function productToItem(
  product: NonNullable<SerializedCategory['products']>[number],
): NavbarComponents {
  return {
    title: shortenMaterial(product.name),
    parent: '', // leaf: renders as a clickable product
    href: `/products/${clean(product.slug)}`,
    url: clean(product.cover_img_url),
    imageDesc: clean(product.navbarNotes),
    newProd: Boolean(product.isNewProduct),
    tempAllFinished: Boolean(product.tempAllFinished),
  } as NavbarComponents
}

/**
 * A level's rows = its child categories first, then its own products.
 *
 * Category hrefs include the complete hierarchy path.
 */

function rowsFor(
  cat: SerializedCategory,
  parentPath: string,
): NavbarComponents[] {
  const childRows = cat.children.map((child) => {
    const childPath = buildCategoryPath(
      parentPath,
      child.slug,
    )

    return categoryToItem(
      child,
      hasContent(child),
      childPath,
    )
  })

  const productRows = (cat.products ?? [])
    .filter((p) => !p.isArchived)
    .map(productToItem)

  return [...childRows, ...productRows]
}


function hasContent(cat: SerializedCategory): boolean {
  return (
    cat.children.length > 0 ||
    (cat.products ?? []).some((p) => !p.isArchived)
  )
}

/**
 * Flattens the API hierarchy into the flat menu + mapping shape
 * the navbar uses.
 *
 * Category hrefs contain the complete parent hierarchy:
 *
 * /drivers
 * /drivers/tweeters
 * /drivers/tweeters/dome-tweeters
 *
 * Products continue to use:
 *
 * /products/product-slug
 */
export function buildNavbarMenus(
  categories: SerializedCategory[],
): NavbarMenus {
  const menus: NavbarMenus = {
    firstMenu: [],
    subMenuMapping: {},
    subSubMenuMapping: {},
    subSubSubMenuMapping: {},
    subSubSubSubMenuMapping: {},
  }

const walk = (
  cat: SerializedCategory,
  depth: number,
  categoryPath: string,
) => {
  const rows = rowsFor(cat, categoryPath)

  if (rows.length === 0) return

  const item = categoryToItem(
    cat,
    true,
    categoryPath,
  )

  const key = menuKey(item.title, cat.under_categoryId)

  if (depth === 1) {
    menus.subMenuMapping[key] = rows
  } else if (depth === 2) {
    menus.subSubMenuMapping[key] = rows
  } else if (depth === 3) {
    menus.subSubSubMenuMapping[key] = rows
  } else if (depth === 4) {
    menus.subSubSubSubMenuMapping[key] = rows
  }

  // Pass the current category's full path
  // to its children.
  if (depth < 4) {
    cat.children.forEach((child) => {
      const childPath = buildCategoryPath(
        categoryPath,
        child.slug,
      )

      walk(
        child,
        depth + 1,
        childPath,
      )
    })
  }
}

for (const root of categories) {
  if (hasContent(root)) {
    const rootPath = buildCategoryPath('', root.slug)

    menus.firstMenu.push(
      categoryToItem(
        root,
        true,
        rootPath,
      ),
    )

    // Start walking from the root's actual path
    walk(root, 1, rootPath)
  }
}


  return menus
}