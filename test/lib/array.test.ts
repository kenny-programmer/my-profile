import { unique, groupBy, chunk } from '@/lib/array'

describe('unique', () => {
  it('removes duplicates from primitives', () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3])
  })
  it('deduplicates objects by key', () => {
    const items = [{ id: 1, x: 'a' }, { id: 1, x: 'b' }, { id: 2, x: 'c' }]
    expect(unique(items, 'id')).toHaveLength(2)
  })
})

describe('chunk', () => {
  it('splits array into groups of N', () => {
    expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]])
  })
})

describe('groupBy', () => {
  it('groups items by key', () => {
    const items = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }]
    expect(groupBy(items, 'type').a).toHaveLength(2)
    expect(groupBy(items, 'type').b).toHaveLength(1)
  })
})
