import { withTimeout, sleep, sequential } from '@/lib/promise'

describe('sleep', () => {
  it('resolves after specified delay', async () => {
    const start = Date.now()
    await sleep(50)
    expect(Date.now() - start).toBeGreaterThanOrEqual(45)
  })
})

describe('withTimeout', () => {
  it('resolves fast promises normally', async () => {
    expect(await withTimeout(Promise.resolve(42), 100)).toBe(42)
  })
  it('rejects slow promises with timeout error', async () => {
    await expect(withTimeout(sleep(200), 50)).rejects.toThrow('Timed out')
  })
})

describe('sequential', () => {
  it('executes tasks in order', async () => {
    const order: number[] = []
    await sequential([1,2,3].map(n => async () => { order.push(n); return n }))
    expect(order).toEqual([1,2,3])
  })
})
