/**
 * Custom assertion helpers for tests
 */

/** Assert a value is defined (not null/undefined) */
export function assertDefined<T>(value: T | null | undefined, msg?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(msg ?? `Expected value to be defined, got ${value}`)
  }
}

/** Assert a value is a string */
export function assertString(value: unknown, msg?: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(msg ?? `Expected string, got ${typeof value}`)
  }
}

/** Assert two values are deeply equal (JSON comparison) */
export function assertDeepEqual<T>(actual: T, expected: T, msg?: string): void {
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) {
    throw new Error(msg ?? `Expected:\n${b}\nActual:\n${a}`)
  }
}
