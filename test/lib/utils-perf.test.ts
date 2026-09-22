import { debounce, memoize } from '@/lib/utils-perf'

describe('debounce', () => {
  it('delays execution and collapses multiple calls', async () => {
    let calls = 0
    const fn = debounce(() => { calls++ }, 50)
    fn(); fn(); fn()
    expect(calls).toBe(0)
    await new Promise(r => setTimeout(r, 60))
    expect(calls).toBe(1)
  })
})

describe('memoize', () => {
  it('caches return values for same args', () => {
    let callCount = 0
    const fn = memoize((n: number) => { callCount++; return n * 2 })
    expect(fn(5)).toBe(10)
    expect(fn(5)).toBe(10)
    expect(callCount).toBe(1)
  })
})
