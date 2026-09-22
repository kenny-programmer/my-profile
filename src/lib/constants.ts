/**
 * App-wide constants — single source of truth
 */
export const SITE = {
  name: 'Kenny — Software Engineer',
  description: 'Portfolio of Kenny, a passionate software engineer.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kenny-programmer.vercel.app',
  author: 'Kenny',
  github: 'kenny-programmer',
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
] as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
