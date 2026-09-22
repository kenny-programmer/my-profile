# Accessibility Guide

## WCAG 2.1 AA Checklist
- [ ] Colour contrast ≥ 4.5:1 (use `contrastRatio()` from `src/lib/color-contrast.ts`)
- [ ] All interactive elements reachable by keyboard
- [ ] Focus order is logical
- [ ] Focus trap active inside modals (use `trapFocus()`)
- [ ] Skip-to-content link present (use `injectSkipLink()`)
- [ ] Animations respect `prefers-reduced-motion` (use `useReducedMotion()`)

## Testing Tools
- axe DevTools (browser extension)
- VoiceOver (macOS: Cmd+F5)
- Keyboard-only navigation test
