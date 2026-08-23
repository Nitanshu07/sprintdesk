# Architecture

## Data flow

```text
Pages and components
        ↓
TanStack queries / Zustand actions
        ↓
Central service layer (`src/services.ts`)
        ↓
mock-data.json / DummyJSON / JSONPlaceholder
```

`mock-data.json` is immutable source data. On first authenticated load, the first 30 tasks initialize the persisted board store. All subsequent task mutations happen through store actions rather than modifying the file.

## State ownership

- Server state: TanStack Query caches mock data and coordinates request lifecycle.
- Shared client state: Zustand stores board records, notifications, authentication session state, and toast messages.
- Local state: filters, open dialogs, forms, theme panel visibility, and comments being composed stay near their owning UI.

## Routes

- `/login`: public authentication route; authenticated users are redirected.
- `/dashboard`: protected sprint summary.
- `/board`: protected Kanban workspace.
- `/analytics`: protected, live-derived charts.

## Authentication

Login uses DummyJSON. The access token exists only in module memory. The refresh token is persisted using the assignment's local-storage simulation. `authFetch` attaches the bearer token, refreshes once after a 401, and retries the original request. Initial route rendering waits for refresh-token validation.

## Accessibility and performance

Interactive controls have labels, drawers and notifications announce their purpose, forms use explicit labels, and DnD Kit includes a keyboard sensor. Analytics and board pages are split into lazy route chunks. Expensive derived chart/filter datasets use `useMemo`.
