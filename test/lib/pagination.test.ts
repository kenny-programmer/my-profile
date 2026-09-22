import { buildPagination, paginateArray } from '@/lib/pagination'

describe('buildPagination', () => {
  it('calculates total pages', () => expect(buildPagination(1, 10, 25).totalPages).toBe(3))
  it('sets hasPrev false on first page', () => expect(buildPagination(1, 10, 25).hasPrev).toBe(false))
  it('sets hasNext false on last page', () => expect(buildPagination(3, 10, 25).hasNext).toBe(false))
})

describe('paginateArray', () => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1)
  it('returns correct first page', () => expect(paginateArray(items, 1, 3)).toEqual([1, 2, 3]))
  it('returns partial last page', () => expect(paginateArray(items, 4, 3)).toEqual([10]))
})
