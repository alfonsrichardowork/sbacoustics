'use client'

import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Layers3,
  Package,
  Save,
  Search,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { normalizeTree } from '../page'
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from 'next/navigation'

export type PriorityProduct = {
  id: string
  name: string
  slug: string
  priority: string
  categoryId: string   // the owning (deepest) category link
  image?: string
}

export type PriorityProductRecord = {
  id: string
  name: string
  slug: string
  image?: string
  links: Array<{ categoryId: string; priority: string }>
}
export type PrioritySavePayload = {
  categories: Array<{ id: string; priority: string }>
  products: Array<{ productId: string; categoryId: string; priority: string }>
}

export type CategoryNode = {
  id: string
  name: string
  type: string
  priority: string
  children: CategoryNode[]
  products: PriorityProduct[]
}

export type PriorityCategoryRecord = {
  id: string
  name: string
  type: string
  priority: string | null
  under_categoryId: string | null
}

export type PrismaCategoryPriorityRecord = Pick<PriorityCategoryRecord, 'id' | 'name' | 'type' | 'priority' | 'under_categoryId'>
export type PrismaProductPriorityRecord = Pick<PriorityProduct, 'id' | 'name' | 'slug' | 'priority'> & {
  cover_img_url?: string | null
  allCat: Array<{ categoryId: string }>
}


type ReorderOperation =
  | { type: 'category'; parentCategoryId: string | null; orderedIds: string[] }
  | { type: 'product'; categoryId: string; orderedIds: string[] }


function updateList(nodes: CategoryNode[], operation: ReorderOperation): CategoryNode[] {
  if (operation.type === 'product') {
    return nodes.map((node) => node.id === operation.categoryId
      ? { ...node, products: operation.orderedIds.map((id, index) => ({ ...node.products.find((product) => product.id === id)!, priority: String(index + 1) })) }
      : { ...node, children: updateList(node.children, operation) })
  }
  const matchesParent = (operation.parentCategoryId === null && nodes === undefined)
  void matchesParent
  return nodes.map((node) => ({ ...node, children: updateList(node.children, operation) }))
}

function reorderCategories(nodes: CategoryNode[], parentId: string | null, orderedIds: string[]): CategoryNode[] {
  if (parentId === null) return orderedIds.map((id, index) => ({ ...nodes.find((node) => node.id === id)!, priority: String(index + 1) }))
  return nodes.map((node) => node.id === parentId
    ? { ...node, children: orderedIds.map((id, index) => ({ ...node.children.find((child) => child.id === id)!, priority: String(index + 1) })) }
    : { ...node, children: reorderCategories(node.children, parentId, orderedIds) })
}

function SortableRow({ label, meta, onDragStart, onDrop, muted = false, priority }: { label: string; meta: string; onDragStart: () => void; onDrop: () => void; muted?: boolean; priority: string }) {
  return (
    <div draggable onDragStart={onDragStart} onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className={cn('group flex cursor-grab items-center gap-3 border-b border-border/60 px-3 py-3 transition-colors last:border-0 hover:bg-accent/60 active:cursor-grabbing', muted && 'opacity-70')}>
      <GripVertical className="text-muted-foreground" aria-hidden="true" />
      <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground"><Package aria-hidden="true" /></div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{label}</p><p className="truncate text-xs text-muted-foreground">{meta}</p></div>
      <span className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">{priority}</span>
    </div>
  )
}

function CategoryBranch({ node, depth, onProductReorder, onCategoryReorder, expanded, toggle }: { node: CategoryNode; depth: number; onProductReorder: (categoryId: string, ids: string[]) => void; onCategoryReorder: (parentId: string | null, ids: string[]) => void; expanded: Set<string>; toggle: (id: string) => void }) {
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null)
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null)
  const isOpen = expanded.has(node.id)
  const childIds = node.children.map((child) => child.id)
  const productIds = node.products.map((product) => product.id)

  const dropProduct = (targetId: string) => {
    if (!draggedProduct || draggedProduct === targetId) return
    const ids = productIds.filter((id) => id !== draggedProduct)
    ids.splice(ids.indexOf(targetId), 0, draggedProduct)
    onProductReorder(node.id, ids)
    setDraggedProduct(null)
  }
  const dropCategory = (targetId: string) => {
    if (!draggedCategory || draggedCategory === targetId) return
    const ids = childIds.filter((id) => id !== draggedCategory)
    ids.splice(ids.indexOf(targetId), 0, draggedCategory)
    onCategoryReorder(node.id, ids)
    setDraggedCategory(null)
  }


  return (
    <div className="flex flex-col gap-3" style={{ marginLeft: depth ? 24 : 0 }}>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3 shadow-sm">
        <button type="button" onClick={() => toggle(node.id)} className="rounded-md p-1 hover:bg-accent" aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${node.name}`}>
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers3 aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">
              {node.name}
            </h3>
            <Badge variant="secondary">
              {node.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {node.children.length} subcategories · {node.products.length} products
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {node.priority || '—'}
        </span>
      </div>
      {isOpen && 
        <div className="flex flex-col gap-3 border-l border-border pl-3">
          {node.children.length > 0 && 
            <div className="flex flex-col gap-2">
              {node.children.map((child) => 
                <div key={child.id} draggable onDragStart={() => setDraggedCategory(child.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropCategory(child.id)}>
                  <CategoryBranch node={child} depth={depth + 1} onProductReorder={onProductReorder} onCategoryReorder={onCategoryReorder} expanded={expanded} toggle={toggle} />
                </div>
              )}
            </div>
          }
          {node.children.length > 0 && node.products.length > 0 && <Separator />}
          {node.products.length > 0 && 
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Products in {node.name}
                </span>
                <Badge variant="outline">
                  {node.products.length}
                </Badge>
              </div>
              {node.products.map((product) => 
                <SortableRow key={product.id} label={product.name} meta={product.slug} onDragStart={() => setDraggedProduct(product.id)} onDrop={() => dropProduct(product.id)} priority={product.priority} />
              )}
            </div>
          }
          {node.children.length === 0 && node.products.length === 0 && 
            <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              This category has no subcategories or products yet.
            </div>
          }
        </div>
      }
    </div>
  )
}


function flattenPriorityTree(
  nodes: CategoryNode[],
  result: PrioritySavePayload = { categories: [], products: [] },
) {
  nodes.forEach((node) => {
    result.categories.push({ id: node.id, priority: node.priority })
    node.products.forEach((product) =>
      result.products.push({
        productId: product.id,
        categoryId: product.categoryId, // always the deepest link
        priority: product.priority,
      }),
    )
    flattenPriorityTree(node.children, result)
  })
  return result
}

export function CategoryPriorityManager({ initialTree: providedTree = [], onSave, brandId}: { initialTree?: CategoryNode[]; onSave?: (payload: PrioritySavePayload) => Promise<void> | void ; brandId: string}) {
  const [tree, setTree] = useState(() => normalizeTree(providedTree))
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(providedTree.map((n) => n.id)),
  )
  const [query, setQuery] = useState('')
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [draggedRoot, setDraggedRoot] = useState<string | null>(null)
  const router = useRouter();

  const visibleTree = useMemo(() => query.trim() ? tree.filter((node) => node.name.toLowerCase().includes(query.toLowerCase()) || node.children.some((child) => child.name.toLowerCase().includes(query.toLowerCase()))) : tree, [query, tree])
  const updateProducts = (categoryId: string, ids: string[]) => { setTree((current) => updateProductsInTree(current, categoryId, ids)); setDirty(true); setSaved(false) }
  const updateCategories = (parentId: string | null, ids: string[]) => { setTree((current) => reorderCategories(current, parentId, ids)); setDirty(true); setSaved(false) }
  const save = async () => {
    // await onSave?.(flattenPriorityTree(tree))
    // setSaved(true)
    // setDirty(false)
    try {
      let payload = flattenPriorityTree(tree)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/api/${brandId}/priority/allmenupriority`,
        payload
      );

      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brandId}/`);
        router.refresh();
        toast.error("Session expired, please login again");
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brandId}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again");
      }
      else if(response.data === 'unauthorized'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brandId}/`);
        router.refresh();
        toast.error("Unauthorized!");
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${brandId}`);
        router.refresh();
        toast.success('Priority Saved Successfully!');
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setDirty(false)
      setSaved(true)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles aria-hidden="true" /> 
              Catalog operations
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Menu priority
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Control the order customers see across every category level and its products.
              </p>
            </div>
          </div>
          <Button onClick={save} disabled={!dirty} size="lg">
            <Save data-icon="inline-start" />
            {saved ? 'Saved' : 'Save priorities'}
            </Button>
        </header>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="min-w-0">
            <CardHeader className="gap-4 border-b border-border">
              <div className="flex flex-col gap-1">
              <CardTitle>
              All drivers catalog
              </CardTitle>
              <CardDescription>
                Drag categories within their level and products within their parent category.
              </CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className="pl-9" aria-label="Search categories" />
            </div>
          </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 md:p-6">{visibleTree.map((node) => 
              <div key={node.id} draggable onDragStart={() => setDraggedRoot(node.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (!draggedRoot || draggedRoot === node.id) return; const ids = tree.map((item) => item.id).filter((id) => id !== draggedRoot); ids.splice(ids.indexOf(node.id), 0, draggedRoot); updateCategories(null, ids); setDraggedRoot(null) }}>
                <CategoryBranch node={node} depth={0} onProductReorder={updateProducts} onCategoryReorder={updateCategories} expanded={expanded} toggle={(id) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next })} />
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                How priorities work
              </CardTitle>
              <CardDescription>
                Ordering is scoped to each parent.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  Categories
                </strong>
                reorder among siblings at the same level.
              </p>
              <p>
                <strong className="text-foreground">
                  Products
                </strong> 
                reorder inside their assigned category.
              </p>
              <Separator />
              <p className="text-xs">
                Blank priorities fall behind explicitly ordered items and are assigned when saved.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-5">
              <p className="text-sm font-medium">
                Unsaved changes
              </p>
              <p className="text-sm text-primary-foreground/75">
                {dirty ? 'You have reordered items. Save to publish the new menu.' : saved ? 'Your latest ordering is saved.' : 'Drag any row to update its position.'}
              </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

function updateProductsInTree(nodes: CategoryNode[], categoryId: string, ids: string[]): CategoryNode[] {
  return nodes.map((node) => node.id === categoryId ? { ...node, products: ids.map((id, index) => ({ ...node.products.find((product) => product.id === id)!, priority: String(index + 1) })) } : { ...node, children: updateProductsInTree(node.children, categoryId, ids) })
}
