# Animation Guide

## Easing
Import easing constants from `src/lib/easing.ts`. Use `spring` for interactive
elements and `easeOut` for page transitions.

## Scroll Reveals
Use `useIntersection()` hook:

```tsx
const [ref, visible] = useIntersection({ threshold: 0.1, once: true })
return <div ref={ref} className={visible ? 'opacity-100' : 'opacity-0'} />
```

## Staggered Lists
```tsx
{items.map((item, i) => (
  <div key={item.id} style={{ animationDelay: staggerDelay(i) }}>
    {item.title}
  </div>
))}
```

## Accessibility
Always check `useReducedMotion()` before triggering animations.
