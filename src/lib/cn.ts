/**
 * Class name merging utility (clsx + tailwind-merge)
 * Thin wrapper to keep import paths consistent
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Conditional class names without tailwind-merge (for non-Tailwind use) */
export function cx(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
