/**
 * Lightweight spy/stub utilities for testing without a full mock library
 */

export interface Spy<T extends (...args: unknown[]) => unknown> {
  fn: T
  calls: Parameters<T>[]
  callCount: number
  reset: () => void
}

export function createSpy<T extends (...args: unknown[]) => unknown>(
  implementation?: T
): Spy<T> {
  const calls: Parameters<T>[] = []
  const fn = ((...args: Parameters<T>) => {
    calls.push(args)
    return implementation?.(...args)
  }) as T

  return {
    fn,
    get calls() { return calls },
    get callCount() { return calls.length },
    reset() { calls.length = 0 },
  }
}
