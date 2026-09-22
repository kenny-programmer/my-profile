# Testing Guide

## Unit Tests
Run: `pnpm test`

### Utilities
- `mockProject()` / `mockBlogPost()` — generate test fixtures
- `assertDefined()` — type-safe non-null assertion
- `assertDeepEqual()` — JSON deep equality check
- `createSpy()` — lightweight function spy without Jest

## Integration Tests
Use `renderHelpers.ts` utilities for DOM assertions.

## Fixtures
Place JSON fixtures in `test/fixtures/`.
Load with `loadFixture('my-fixture')` (`.json` extension optional).
