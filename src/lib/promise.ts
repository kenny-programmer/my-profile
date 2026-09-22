/**
 * Promise utility helpers
 */

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sequential<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = []
  for (const task of tasks) results.push(await task())
  return results
}

export async function batchedPromises<T>(
  tasks: Array<() => Promise<T>>,
  batchSize: number
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    results.push(...(await Promise.all(batch.map((t) => t()))))
  }
  return results
}
