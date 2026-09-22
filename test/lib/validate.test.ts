import { required, minLength, isEmail, isUrl } from '@/lib/validate'

describe('required', () => {
  it('fails on empty string', () => expect(required('').valid).toBe(false))
  it('passes on non-empty string', () => expect(required('hello').valid).toBe(true))
  it('fails on null', () => expect(required(null).valid).toBe(false))
})

describe('isEmail', () => {
  it('validates correct email', () => expect(isEmail('user@example.com').valid).toBe(true))
  it('rejects invalid email', () => expect(isEmail('not-an-email').valid).toBe(false))
})

describe('minLength', () => {
  it('passes when length meets minimum', () => expect(minLength(3)('hello').valid).toBe(true))
  it('fails when length is below minimum', () => expect(minLength(10)('hi').valid).toBe(false))
})
