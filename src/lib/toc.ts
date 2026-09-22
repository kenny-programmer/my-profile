/**
 * Table of Contents extractor for MDX blog posts
 */
export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const items: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    items.push({ id, text, level })
  }

  return items
}
