/**
 * Open Graph metadata helpers
 */
export interface OgMeta {
  title: string
  description: string
  image?: string
  type?: 'article' | 'website'
  publishedAt?: string
}

export function buildOgMeta(meta: OgMeta): Record<string, string> {
  return {
    'og:title': meta.title,
    'og:description': meta.description,
    'og:type': meta.type ?? 'website',
    ...(meta.image ? { 'og:image': meta.image } : {}),
    ...(meta.publishedAt ? { 'article:published_time': meta.publishedAt } : {}),
  }
}
