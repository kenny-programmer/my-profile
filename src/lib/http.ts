/**
 * Typed HTTP client wrapper around fetch
 */
export interface RequestOptions extends RequestInit {
  timeout?: number
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string
  ) {
    super(`HTTP ${status} ${statusText} — ${url}`)
    this.name = 'HttpError'
  }
}

export async function httpGet<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = 10_000, ...init } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    if (!res.ok) throw new HttpError(res.status, res.statusText, url)
    return res.json() as Promise<T>
  } finally {
    clearTimeout(timer)
  }
}

export async function httpPost<T>(
  url: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return httpGet<T>(url, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: JSON.stringify(body),
  })
}
