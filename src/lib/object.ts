/**
 * Object utility helpers
 */

/** Pick specific keys from an object */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K>
}

/** Omit specific keys from an object */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const set = new Set<string>(keys as string[])
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !set.has(k))
  ) as Omit<T, K>
}

/** Deep clone an object (JSON-safe values only) */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

/** Check if an object is empty */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

/** Merge objects deeply (last write wins) */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  const result = { ...target }
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const k = key as keyof T
      result[k] =
        value && typeof value === 'object' && !Array.isArray(value)
          ? deepMerge(result[k] as object ?? {}, value as object) as T[keyof T]
          : value as T[keyof T]
    }
  }
  return result
}
