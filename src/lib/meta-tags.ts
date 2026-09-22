/**
 * Meta tag collection builder for Next.js Metadata API
 */
export interface PageMeta {
  title: string
  description: string
  canonical?: string
  noIndex?: boolean
  image?: string
  keywords?: string[]
}

export function buildMetaTags(meta: PageMeta): Record<string, unknown> {
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(', '),
    robots: meta.noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: meta.canonical ? { canonical: meta.canonical } : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description,
      ...(meta.image ? { images: [{ url: meta.image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      ...(meta.image ? { images: [meta.image] } : {}),
    },
  }
}
