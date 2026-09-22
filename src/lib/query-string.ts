/**
 * Query string builder and parser
 */

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  return filtered.length ? `?${filtered.join('&')}` : ''
}

export function parseQueryString(search: string): Record<string, string> {
  const params: Record<string, string> = {}
  const str = search.startsWith('?') ? search.slice(1) : search
  if (!str) return params
  for (const pair of str.split('&')) {
    const [k, v] = pair.split('=')
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v ?? '')
  }
  return params
}
