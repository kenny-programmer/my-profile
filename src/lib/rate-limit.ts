/**
 * Token-bucket rate limiter for API routes
 */
export class RateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>()

  constructor(
    private readonly maxTokens: number,
    private readonly refillRateMs: number
  ) {}

  /** Returns true if the request is allowed, false if rate-limited */
  allow(key: string): boolean {
    const now = Date.now()
    let bucket = this.buckets.get(key)

    if (!bucket) {
      bucket = { tokens: this.maxTokens - 1, lastRefill: now }
      this.buckets.set(key, bucket)
      return true
    }

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill
    const newTokens = Math.floor(elapsed / this.refillRateMs)
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + newTokens)
    bucket.lastRefill = now

    if (bucket.tokens > 0) {
      bucket.tokens--
      return true
    }
    return false
  }
}
