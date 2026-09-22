/**
 * CSS easing functions and cubic-bezier helpers
 */

export const EASING = {
  linear:      'linear',
  easeIn:      'cubic-bezier(0.4, 0, 1, 1)',
  easeOut:     'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:      'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce:      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  anticipate:  'cubic-bezier(0.36, 0, 0.66, -0.56)',
} as const

export type EasingName = keyof typeof EASING

/** Get a CSS easing string by name */
export function getEasing(name: EasingName): string {
  return EASING[name]
}
