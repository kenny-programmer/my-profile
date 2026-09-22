/**
 * Client-side search/filter helper for blog posts
 */
export interface Searchable {
  title: string
  tags?: string[]
  description?: string
}

export function filterItems<T extends Searchable>(items: T[], query: string): T[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(q))
  )
}
