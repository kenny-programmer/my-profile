# React Hooks Reference

## UI State
| Hook | Purpose |
|------|---------|
| `useToggle()` | Boolean flip with direct setter |
| `useCounter(opts)` | Numeric counter with min/max/step |
| `usePrevious(value)` | Track previous prop/state value |

## Browser APIs
| Hook | Purpose |
|------|---------|
| `useCopy()` | Clipboard copy with feedback |
| `useLocalStorage(key, init)` | Persistent state via localStorage |
| `useMediaQuery(query)` | Reactive media query |
| `useIsMobile()` | < 768px breakpoint |
| `useIsDesktop()` | ≥ 1024px breakpoint |
| `useOutsideClick(ref, fn)` | Click-outside detection |

## Animation
| Hook | Purpose |
|------|---------|
| `useIntersection(opts)` | Scroll-triggered visibility |
| `useReducedMotion()` | Respects OS motion preference |

## Form
| Hook | Purpose |
|------|---------|
| `useForm(initial)` | Form values + errors + touched |
| `useDebouncedSearch(delay)` | Search input with debounce |
| `useFormPersist(key, ...)` | sessionStorage persistence |
