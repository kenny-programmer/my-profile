# Performance Guide

## Debouncing
Use `debounce()` for search inputs and resize handlers.
Delay recommendation: 300ms for search, 150ms for resize.

## Throttling
Use `throttle()` for scroll event listeners.
Interval recommendation: 16ms (≈60fps).

## Memoization
Use `memoize()` for expensive computations that run with the same inputs.
⚠️ Do NOT use for functions with side effects.
