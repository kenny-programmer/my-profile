import { formatNumber, formatCompact, clamp, lerp, roundTo } from '@/lib/number'

describe('formatNumber', () => {
  it('adds thousand separators', () => expect(formatNumber(1234567)).toBe('1,234,567'))
})
describe('formatCompact', () => {
  it('formats 1500 as 1.5K', () => expect(formatCompact(1500)).toBe('1.5K'))
  it('formats 2M correctly', () => expect(formatCompact(2_000_000)).toBe('2M'))
})
describe('clamp', () => {
  it('clamps below min', () => expect(clamp(-5, 0, 10)).toBe(0))
  it('clamps above max', () => expect(clamp(15, 0, 10)).toBe(10))
  it('returns in-range value', () => expect(clamp(5, 0, 10)).toBe(5))
})
describe('lerp', () => {
  it('interpolates midpoint', () => expect(lerp(0, 100, 0.5)).toBe(50))
  it('returns start at t=0', () => expect(lerp(10, 20, 0)).toBe(10))
  it('returns end at t=1', () => expect(lerp(10, 20, 1)).toBe(20))
})
