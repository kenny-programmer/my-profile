/**
 * Typed event bus for cross-component communication
 */
type Listener<T> = (payload: T) => void

export class EventBus<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>()

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(listener as Listener<unknown>)
    return () => this.off(event, listener)
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>)
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach((l) => l(payload))
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const unsub = this.on(event, (p) => { listener(p); unsub() })
  }

  clear(): void { this.listeners.clear() }
}
