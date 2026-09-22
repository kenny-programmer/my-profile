import { joinUrl, getDomain, setQueryParam } from '@/lib/url'

describe('joinUrl', () => {
  it('joins parts with slash', () => {
    expect(joinUrl('https://example.com', 'blog', 'post-1')).toBe('https://example.com/blog/post-1')
  })
  it('handles trailing and leading slashes', () => {
    expect(joinUrl('https://example.com/', '/blog/')).toBe('https://example.com/blog')
  })
})

describe('getDomain', () => {
  it('extracts hostname', () => expect(getDomain('https://github.com/user')).toBe('github.com'))
})

describe('setQueryParam', () => {
  it('adds a query parameter', () => {
    expect(setQueryParam('https://example.com', 'q', 'hello')).toContain('q=hello')
  })
})
