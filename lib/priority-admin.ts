import { CategoryNode } from "@/app/(admin)/admin/(dashboard)/[brandId]/(routes)/(products)/menupriority/priority/components/priority-form";

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