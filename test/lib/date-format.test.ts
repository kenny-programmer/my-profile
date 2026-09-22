import { formatDate, formatDateShort, isoDate } from '@/lib/date-format'

describe('formatDate', () => {
  it('formats to long date', () => {
    expect(formatDate('2026-09-22')).toBe('September 22, 2026')
  })
})

describe('formatDateShort', () => {
  it('formats to short month and year', () => {
    expect(formatDateShort('2026-09-22')).toBe('Sep 2026')
  })
})

describe('isoDate', () => {
  it('returns ISO date string', () => {
    expect(isoDate(new Date('2026-09-22T00:00:00Z'))).toBe('2026-09-22')
  })
})
