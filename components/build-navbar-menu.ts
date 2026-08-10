import { NavbarComponents } from '@/app/(frontend)/types'
import { SerializedCategory } from '@/app/(frontend)/actions/get-all-navbar-content'

export type NavbarMenus = {
  firstMenu: NavbarComponents[]
  subMenuMapping: Record<string, NavbarComponents[]>
  subSubMenuMapping: Record<string, NavbarComponents[]>
  subSubSubMenuMapping: Record<string, NavbarComponents[]>
  subSubSubSubMenuMapping: Record<string, NavbarComponents[]>
  kitsMenu: NavbarComponents[]
  kitsSubMenuMapping: Record<string, NavbarComponents[]>
}

/** key used by every mapping: `${title}-${parent}` */
export const menuKey = (title: string, parent: string) => `${title}-${parent}`

const clean = (value?: string | null) => (value ?? '').trim()

/** category -> menu row. `parent` is non-empty only when the row drills deeper. */
function categoryToItem(cat: SerializedCategory, hasChildren: boolean): NavbarComponents {
  return {
    title: cat.displayName || cat.name,
    parent: hasChildren ? cat.id : '',
    href: clean(cat.slug),
    url: clean(cat.thumbnail_url),
    imageDesc: clean(cat.description),
    newProd: false,
    tempAllFinished: false,
  } as NavbarComponents
}

function productToItem(
  product: NonNullable<SerializedCategory['products']>[number],
): NavbarComponents {
  return {
    title: product.name,
    parent: '', // leaf: renders as a clickable product
    href: clean(product.slug),
    url: clean(product.cover_img_url || product.featured_img_url),
    imageDesc: clean(product.navbarNotes || product.description),
    newProd: Boolean(product.isNewProduct),
    tempAllFinished: Boolean((product as any).tempAllFinished),
  } as NavbarComponents
}

/**
 * A level's rows = its child categories first, then its own products
 * (already priority-ordered by the API).
 */
function rowsFor(cat: SerializedCategory, kits: boolean): NavbarComponents[] {
  const childRows = cat.children.map((child) =>
    categoryToItem(child, hasContent(child, kits)),
  )
  const productRows = (cat.products ?? [])
    .filter((p) => !p.isArchived && Boolean(p.isKits) === kits)
    .map(productToItem)

  return [...childRows, ...productRows]
}

function hasContent(cat: SerializedCategory, kits: boolean): boolean {
  return rowsFor(cat, kits).length > 0
}

/**
 * Flattens the API hierarchy into the flat menu + mapping shape the navbar uses.
 * The API already sorts categories and products by numeric priority, so we
 * never re-sort here — insertion order IS the priority order.
 */
export function buildNavbarMenus(categories: SerializedCategory[]): NavbarMenus {
  const menus: NavbarMenus = {
    firstMenu: [],
    subMenuMapping: {},
    subSubMenuMapping: {},
    subSubSubMenuMapping: {},
    subSubSubSubMenuMapping: {},
    kitsMenu: [],
    kitsSubMenuMapping: {},
  }

  const walk = (
    cat: SerializedCategory,
    depth: number,
    kits: boolean,
  ) => {
    const rows = rowsFor(cat, kits)
    if (rows.length === 0) return

    const item = categoryToItem(cat, true)
    const key = menuKey(item.title, cat.id)

    if (kits) {
      if (depth === 1) menus.kitsSubMenuMapping[key] = rows
    } else {
      if (depth === 1) menus.subMenuMapping[key] = rows
      else if (depth === 2) menus.subSubMenuMapping[key] = rows
      else if (depth === 3) menus.subSubSubMenuMapping[key] = rows
      else if (depth === 4) menus.subSubSubSubMenuMapping[key] = rows
    }

    if (depth < 3) cat.children.forEach((child) => walk(child, depth + 1, kits))
  }

  for (const root of categories) {
    // DRIVERS
    if (hasContent(root, false)) {
      menus.firstMenu.push(categoryToItem(root, true))
      walk(root, 1, false)
    }
    // KITS
    if (hasContent(root, true)) {
      menus.kitsMenu.push(categoryToItem(root, true))
      walk(root, 1, true)
    }
  }

  return menus
}
