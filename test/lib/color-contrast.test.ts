import { contrastRatio, isWcagAA } from '@/lib/color-contrast'

describe('contrastRatio', () => {
  it('returns ~21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })
  it('returns 1 for same color', () => {
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1)
  })
})

describe('isWcagAA', () => {
  it('passes black on white', () => expect(isWcagAA('#000000', '#ffffff')).toBe(true))
  it('fails low-contrast grey on white', () => expect(isWcagAA('#aaaaaa', '#ffffff')).toBe(false))
})
