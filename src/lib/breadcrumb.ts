/**
 * Breadcrumb JSON-LD builder for SEO
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbSchema(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  })
}

export function buildBreadcrumbs(
  path: string,
  base: string,
  labels: Record<string, string> = {}
): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean)
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', url: base }]
  let current = base
  for (const seg of segments) {
    current += `/${seg}`
    crumbs.push({ name: labels[seg] ?? seg, url: current })
  }
  return crumbs
}
