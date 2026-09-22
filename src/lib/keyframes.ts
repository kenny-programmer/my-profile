/**
 * Reusable keyframe animation definitions
 */

export const KEYFRAMES = {
  fadeIn: {
    from: { opacity: 0 },
    to:   { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to:   { opacity: 0 },
  },
  slideUp: {
    from: { transform: 'translateY(16px)', opacity: 0 },
    to:   { transform: 'translateY(0)',    opacity: 1 },
  },
  slideDown: {
    from: { transform: 'translateY(-16px)', opacity: 0 },
    to:   { transform: 'translateY(0)',     opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to:   { transform: 'scale(1)',    opacity: 1 },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%':      { opacity: 0.5 },
  },
} as const

export type KeyframeName = keyof typeof KEYFRAMES
