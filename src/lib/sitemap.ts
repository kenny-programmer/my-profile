/**
 * Sitemap entry builder for Next.js
 */
export interface SitemapEntry {
  url: string
  lastModified?: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export function buildSitemapEntry(
  path: string,
  base: string,
  opts: Omit<SitemapEntry, 'url'> = {}
): SitemapEntry {
  return {
    url: `${base}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
    ...opts,
  }
}
