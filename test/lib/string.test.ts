import { capitalize, truncate, wordCount, pluralise } from '@/lib/string'

describe('capitalize', () => {
  it('uppercases the first letter', () => expect(capitalize('hello world')).toBe('Hello world'))
})

describe('truncate', () => {
  it('truncates long strings with ellipsis', () => {
    expect(truncate('Hello, World!', 8)).toBe('Hello, …')
  })
  it('leaves short strings intact', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })
})

describe('wordCount', () => {
  it('counts words correctly', () => expect(wordCount('hello world foo')).toBe(3))
})

describe('pluralise', () => {
  it('returns singular for 1', () => expect(pluralise(1, 'item')).toBe('item'))
  it('returns plural for >1', () => expect(pluralise(5, 'item')).toBe('items'))
})
