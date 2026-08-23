# SprintDesk

SprintDesk is a responsive sprint-management application built for the GrubPac frontend assignment. It includes DummyJSON authentication, protected routes, a persistent drag-and-drop Kanban board, live board-derived analytics, notification polling, light/dark themes, and focused unit tests.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Use the DummyJSON demo account:

- Username: `emilys`
- Password: `emilyspass`

No environment variables or private credentials are required.

## Quality commands

```bash
npm run build
npm run test
npm run lint
```

## Key decisions

- TanStack Query owns mock/API server state and caching.
- Zustand owns persisted board state, notifications, authentication state, and toast state.
- UI code reads mock data only through `services.ts`; the source can be replaced without changing pages.
- Route modules are lazy-loaded with `React.lazy` and `Suspense`.
- DnD Kit supports pointer and keyboard sensors. Board state persists through refresh and the last move can be undone.
- Analytics are derived from live store data, so task edits and moves update charts immediately.
- Access tokens stay in memory. Refresh tokens use local storage only for the assignment's persistence simulation.

## Current limitations

- Notification polling uses JSONPlaceholder's five-post feed; it is intentionally simulated and may be blocked by an offline browser.
- The optional Storybook, axe-core, date-range analytics filtering, and PNG export bonuses are not included.
- Lighthouse targets should be verified against the final production URL on the evaluator's network and device.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [API.md](./API.md) for implementation details.

