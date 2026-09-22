/**
 * Unified storage abstraction (localStorage, sessionStorage, memory)
 */
export interface IStorage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

function makeWebStorage(backend: globalThis.Storage): IStorage {
  return {
    get<T>(key: string): T | null {
      try { const item = backend.getItem(key); return item ? (JSON.parse(item) as T) : null } catch { return null }
    },
    set<T>(key: string, value: T): void { try { backend.setItem(key, JSON.stringify(value)) } catch {} },
    remove(key: string): void { try { backend.removeItem(key) } catch {} },
    clear(): void { try { backend.clear() } catch {} },
  }
}

function makeMemoryStorage(): IStorage {
  const store = new Map<string, string>()
  return {
    get<T>(key: string): T | null { const v = store.get(key); return v ? JSON.parse(v) as T : null },
    set<T>(key: string, value: T): void { store.set(key, JSON.stringify(value)) },
    remove(key: string): void { store.delete(key) },
    clear(): void { store.clear() },
  }
}

export const local: IStorage = typeof window !== 'undefined' ? makeWebStorage(window.localStorage) : makeMemoryStorage()
export const session: IStorage = typeof window !== 'undefined' ? makeWebStorage(window.sessionStorage) : makeMemoryStorage()
export const memory: IStorage = makeMemoryStorage()
