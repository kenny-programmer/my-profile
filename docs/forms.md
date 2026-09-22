# Forms Guide

## Validation
Chain validators from `src/lib/validate.ts`:

```ts
const emailResult = isEmail(values.email)
if (!emailResult.valid) setError('email', emailResult.message)
```

## Form State
```tsx
const { values, errors, setValue, touch, hasErrors } = useForm({
  name: '', email: '', message: ''
})
```

## Persistence
Wrap `useForm` with `useFormPersist` to survive page refreshes:
```tsx
const persist = useFormPersist('contact-form', values, setValue)
```

## Debounced Search
```tsx
const { query, debouncedQuery, setQuery } = useDebouncedSearch(300)
```
