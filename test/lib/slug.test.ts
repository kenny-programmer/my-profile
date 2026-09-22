import { toSlug, isValidSlug } from '@/lib/slug'

describe('toSlug', () => {
  it('converts spaces to hyphens', () => expect(toSlug('Hello World')).toBe('hello-world'))
  it('removes special characters', () => expect(toSlug('Hello, World!')).toBe('hello-world'))
  it('collapses multiple spaces', () => expect(toSlug('Hello   World')).toBe('hello-world'))
})

describe('isValidSlug', () => {
  it('accepts valid slug', () => expect(isValidSlug('hello-world')).toBe(true))
  it('rejects uppercase', () => expect(isValidSlug('Hello-World')).toBe(false))
  it('rejects trailing hyphen', () => expect(isValidSlug('hello-')).toBe(false))
})
