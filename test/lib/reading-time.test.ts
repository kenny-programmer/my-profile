import { readingTime } from '@/lib/reading-time'

describe('readingTime', () => {
  it('returns singular for short text', () => {
    expect(readingTime('Hello world this is short')).toBe('1 min read')
  })
  it('returns plural minutes for long text', () => {
    expect(readingTime(Array(500).fill('word').join(' '))).toBe('3 min read')
  })
})
