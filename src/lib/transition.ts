/**
 * CSS transition helpers for consistent motion design
 */

export interface TransitionOptions {
  duration?: number  // ms
  delay?: number     // ms
  easing?: string
  properties?: string[]
}

export function buildTransition(options: TransitionOptions = {}): string {
  const {
    duration = 200,
    delay = 0,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties = ['all'],
  } = options

  return properties
    .map((prop) => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ')
}

/** Tailwind-friendly transition class builder */
export function transitionClasses(fast?: boolean): string {
  return fast
    ? 'transition-all duration-150 ease-in-out'
    : 'transition-all duration-300 ease-in-out'
}
