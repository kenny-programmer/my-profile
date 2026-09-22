import { isEnabled, getAllFlags } from '@/lib/feature-flags'

describe('isEnabled', () => {
  it('returns default flag value', () => {
    expect(isEnabled('ENABLE_CHAT')).toBe(true)
    expect(isEnabled('ENABLE_ANALYTICS')).toBe(false)
  })
  it('respects overrides', () => {
    expect(isEnabled('ENABLE_ANALYTICS', { ENABLE_ANALYTICS: true })).toBe(true)
    expect(isEnabled('ENABLE_CHAT', { ENABLE_CHAT: false })).toBe(false)
  })
})

describe('getAllFlags', () => {
  it('merges overrides with defaults', () => {
    const flags = getAllFlags({ ENABLE_ANALYTICS: true })
    expect(flags.ENABLE_ANALYTICS).toBe(true)
    expect(flags.ENABLE_CHAT).toBe(true)
  })
})
