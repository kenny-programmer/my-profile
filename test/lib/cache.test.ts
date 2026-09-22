import { TtlCache } from '@/lib/cache'

describe('TtlCache', () => {
  it('stores and retrieves values', () => {
    const c = new TtlCache<number>(1000)
    c.set('k', 42)
    expect(c.get('k')).toBe(42)
  })
  it('returns undefined for missing keys', () => {
    expect(new TtlCache().get('nope')).toBeUndefined()
  })
  it('expires entries after TTL', async () => {
    const c = new TtlCache<number>(50)
    c.set('k', 1)
    await new Promise(r => setTimeout(r, 60))
    expect(c.get('k')).toBeUndefined()
  })
  it('clears all entries', () => {
    const c = new TtlCache<number>()
    c.set('a', 1); c.set('b', 2)
    c.clear()
    expect(c.has('a')).toBe(false)
  })
})
