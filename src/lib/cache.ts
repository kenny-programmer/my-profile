/**
 * Simple in-memory TTL cache for API responses
 */
interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(private readonly defaultTtlMs = 60_000) {}

  set(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}
