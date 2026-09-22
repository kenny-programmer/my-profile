/**
 * UI component TypeScript types
 */
import type { ReactNode } from 'react'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive'
export type Orientation = 'horizontal' | 'vertical'
export type Position = 'top' | 'right' | 'bottom' | 'left'

export interface WithChildren { children: ReactNode }
export interface WithClassName { className?: string }
export interface BaseComponentProps extends WithChildren, WithClassName {}
