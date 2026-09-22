/**
 * Theme utilities for dark/light mode management
 */
export type Theme = 'light' | 'dark' | 'system'

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  const resolved = resolveTheme(theme)
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
}

export function getPersistedTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) ?? 'system'
}

export function persistTheme(theme: Theme): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem('theme', theme)
}
