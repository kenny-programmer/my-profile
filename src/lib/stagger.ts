/**
 * Stagger delay calculator for list animations
 */

export interface StaggerOptions {
  baseDelay?: number   // ms
  staggerBy?: number   // ms per item
  maxDelay?: number    // ms cap
}

export function staggerDelay(index: number, options: StaggerOptions = {}): string {
  const { baseDelay = 0, staggerBy = 50, maxDelay = 500 } = options
  const delay = Math.min(baseDelay + index * staggerBy, maxDelay)
  return `${delay}ms`
}

/** Generate an array of stagger delays for N items */
export function staggerDelays(count: number, options: StaggerOptions = {}): string[] {
  return Array.from({ length: count }, (_, i) => staggerDelay(i, options))
}
