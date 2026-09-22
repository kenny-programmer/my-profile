/**
 * Retry wrapper with exponential backoff
 */
interface RetryOptions {
  retries?: number
  baseDelay?: number
  maxDelay?: number
  onRetry?: (attempt: number, error: unknown) => void
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, baseDelay = 300, maxDelay = 5000, onRetry } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === retries) throw err
      const delay = Math.min(baseDelay * 2 ** attempt, maxDelay)
      onRetry?.(attempt + 1, err)
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  throw new Error('Unreachable')
}
