/**
 * Shared test utilities and custom render helpers
 */
import type { ReactElement } from 'react'

/** Flush all pending promises in tests */
export async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

/** Wait for a condition to be true */
export async function waitFor(
  condition: () => boolean,
  timeout = 2000,
  interval = 50
): Promise<void> {
  const deadline = Date.now() + timeout
  while (!condition()) {
    if (Date.now() > deadline) throw new Error('waitFor timed out')
    await new Promise((r) => setTimeout(r, interval))
  }
}

/** Generate a random string for test IDs */
export function randomId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}
