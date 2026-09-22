import { filterItems } from '@/lib/search'

const items = [
  { title: 'Next.js Tips', description: 'Tips for Next.js', tags: ['nextjs'] },
  { title: 'TypeScript Guide', description: 'A TypeScript guide', tags: ['typescript'] },
  { title: 'CSS Tricks', description: 'Modern CSS', tags: ['css'] },
]

describe('filterItems', () => {
  it('filters by title', () => expect(filterItems(items, 'next')).toHaveLength(1))
  it('filters by description', () => expect(filterItems(items, 'guide')).toHaveLength(2))
  it('filters by tag', () => expect(filterItems(items, 'typescript')).toHaveLength(1))
  it('returns all items on empty query', () => expect(filterItems(items, '')).toHaveLength(3))
  it('is case-insensitive', () => expect(filterItems(items, 'CSS')).toHaveLength(1))
})
