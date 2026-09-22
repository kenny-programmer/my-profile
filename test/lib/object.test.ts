import { pick, omit, deepClone, isEmpty } from '@/lib/object'

describe('pick', () => {
  it('returns only specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('omit', () => {
  it('removes specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })
})

describe('deepClone', () => {
  it('creates a deep copy', () => {
    const obj = { a: { b: 1 } }
    const clone = deepClone(obj)
    clone.a.b = 99
    expect(obj.a.b).toBe(1)
  })
})

describe('isEmpty', () => {
  it('returns true for empty object', () => expect(isEmpty({})).toBe(true))
  it('returns false for non-empty object', () => expect(isEmpty({ a: 1 })).toBe(false))
})
