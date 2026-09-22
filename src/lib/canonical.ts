/**
 * Canonical URL helpers
 */
export function canonicalUrl(path: string, base?: string): string {
  const siteBase = base ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  const normalised = path.startsWith('/') ? path : `/${path}`
  const clean = normalised.length > 1 ? normalised.replace(/\/$/, '') : normalised
  return `${siteBase}${clean}`
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url)
}
