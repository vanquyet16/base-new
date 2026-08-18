// PATH: src/types/common.types.ts
// Common utility TypeScript types — used across the entire codebase
// Rule: ZERO imports from any src layer

import type { ReactNode } from 'react'

// ─── ID ──────────────────────────────────────────────────────────────────────

/** Represents a database entity identifier. Use string for UUID. */
export type ID = string

// ─── Nullable / Optional Utilities ──────────────────────────────────────────

/** T | null — use when a value is optional from the server */
export type Nullable<T> = T | null

/** T | undefined — use for optional function parameters */
export type Optional<T> = T | undefined

/** T | null | undefined — use for values that may not exist at all */
export type Maybe<T> = T | null | undefined

// ─── Deep Partial ─────────────────────────────────────────────────────────────

/** Recursively makes all properties of T optional — useful for partial updates */
export type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>
    }
    : T

// ─── Component Props Utilities ────────────────────────────────────────────────

/** Adds optional className prop to component props */
export interface PropsWithClassName {
    className?: string
}

/** Component props that accept React children */
export interface PropsWithChildren {
    children: ReactNode
}

/** Combined: className + children */
export type PropsWithClassNameAndChildren = PropsWithClassName & PropsWithChildren

// ─── Record Utilities ─────────────────────────────────────────────────────────

/** Generic key-value record */
export type StringRecord = Record<string, string>

/** Generic object with unknown values */
export type AnyRecord = Record<string, unknown>

// ─── Function Utilities ───────────────────────────────────────────────────────

/** Async function that returns T */
export type AsyncFn<T = void> = () => Promise<T>

/** Void callback */
export type VoidFn = () => void

// ─── Status ───────────────────────────────────────────────────────────────────

/** Common async operation status */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
