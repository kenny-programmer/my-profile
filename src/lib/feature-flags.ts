/**
 * Simple feature flag system
 */
export type FlagName = 'ENABLE_CHAT' | 'ENABLE_ANALYTICS' | 'ENABLE_BLOG_SEARCH' | 'ENABLE_GAME' | 'ENABLE_DARK_MODE'

type FlagConfig = Record<FlagName, boolean>

const DEFAULT_FLAGS: FlagConfig = {
  ENABLE_CHAT: true, ENABLE_ANALYTICS: false,
  ENABLE_BLOG_SEARCH: true, ENABLE_GAME: true, ENABLE_DARK_MODE: true,
}

export function isEnabled(flag: FlagName, overrides: Partial<FlagConfig> = {}): boolean {
  return overrides[flag] ?? DEFAULT_FLAGS[flag]
}

export function getAllFlags(overrides: Partial<FlagConfig> = {}): FlagConfig {
  return { ...DEFAULT_FLAGS, ...overrides }
}
