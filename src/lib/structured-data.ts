/**
 * JSON-LD structured data helpers (Schema.org)
 */
export interface PersonSchema {
  name: string
  url: string
  jobTitle?: string
  sameAs?: string[]
}

export function personSchema(data: PersonSchema): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...data,
  })
}

export interface ArticleSchema {
  title: string
  description: string
  url: string
  datePublished: string
  author: string
}

export function articleSchema(data: ArticleSchema): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    url: data.url,
    datePublished: data.datePublished,
    author: { '@type': 'Person', name: data.author },
  })
}
