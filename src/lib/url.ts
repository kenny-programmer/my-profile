/**
 * URL manipulation helpers
 */

export function joinUrl(...parts: string[]): string {
  return parts
    .map((p, i) => (i === 0 ? p.replace(/\/+$/, '') : p.replace(/^\/+/, '').replace(/\/+$/, '')))
    .filter(Boolean)
    .join('/')
}

export function getDomain(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

export function setQueryParam(url: string, key: string, value: string): string {
  try { const u = new URL(url); u.searchParams.set(key, value); return u.toString() }
  catch { return url }
}

export function removeQueryParam(url: string, key: string): string {
  try { const u = new URL(url); u.searchParams.delete(key); return u.toString() }
  catch { return url }
}
