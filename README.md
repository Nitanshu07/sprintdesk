# SprintDesk

SprintDesk is a production-oriented sprint-management dashboard built for the GrubPac Frontend Engineer assignment. It provides authenticated access to a persistent Kanban board, task management, live analytics, notifications, responsive layouts, and light/dark themes.

## Submission links

- **Live application:** [Open SprintDesk](https://sprintdesk-nitanshu.singhnikku004.chatgpt.site/board)
- **GitHub repository:** [Nitanshu07/sprintdesk](https://github.com/Nitanshu07/sprintdesk)
- **Architecture document:** [System architecture and data flow](./docs/ARCHITECTURE.md)
- **API documentation:** [Endpoints and request/response details](./docs/API.md)

> [!IMPORTANT]
> ## SCREEN RECORDING - ACTION REQUIRED
> Add the public Loom, Google Drive, or YouTube recording URL below before submitting the assignment.
>
> **Screen recording:** [Watch the SprintDesk demo](https://drive.google.com/file/d/1hWzQXqlqDYSaJk-bpsiY1h2mTNO4cy4T/view?usp=sharing)

### Recording checklist

Demonstrate these items in the recording:

1. Login, protected routes, session persistence, and logout.
2. Kanban drag-and-drop, task creation, editing, deletion, search, and filters.
3. Dashboard metrics and analytics updating from board data.
4. Notification polling and unread/read behavior.
5. Light/dark themes and responsive behavior.
6. API/service architecture, state-management decisions, tests, and known limitations.

## Features

- DummyJSON authentication with protected routes, refresh-token simulation, and logout.
- Four-column Kanban board with pointer and keyboard drag-and-drop.
- Persistent task creation, editing, deletion, movement, undo, comments, search, and filters.
- Dashboard and Recharts analytics derived from live task state.
- Mock notifications merged with JSONPlaceholder polling and unread-state management.
- Responsive desktop/mobile layouts with persistent light and dark themes.
- Lazy-loaded routes, loading states, error handling, and focused unit tests.

## Technology stack

| Area | Technology |
| --- | --- |
| Framework | React 19 + TypeScript strict mode |
| Build tooling | Vite 8 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Styling | Tailwind CSS 4 + custom CSS |
| Charts | Recharts 3 |
| Drag and drop | DnD Kit |
| Testing | Vitest + React Testing Library |
| Hosting adapter | Cloudflare Worker |

## Repository structure

```text
sprintdesk/
|-- frontend/            # React source, tests, mock data, and static assets
|-- backend/             # Cloudflare Worker SPA hosting adapter
|-- docs/                # Architecture and API documentation
|-- scripts/             # Build/deployment helpers
|-- index.html           # Vite application entry
|-- package.json         # Dependencies and project commands
|-- vite.config.ts       # Vite and Cloudflare configuration
`-- README.md            # Setup and submission hub
```

The assignment uses mock data and external APIs rather than a custom application backend. The worker in `backend/` only serves the deployed single-page application.

## Run locally

### Prerequisites

- Node.js 22.13 or newer
- npm 10 or newer
- Git

### Installation

```bash
git clone https://github.com/Nitanshu07/sprintdesk.git
cd sprintdesk
npm install
npm run dev
```

Open the local URL printed by Vite.

### Demo login

- Username: `emilys`
- Password: `emilyspass`

These are public DummyJSON demonstration credentials, not private application secrets.

### Environment variables

No environment variables or private API credentials are required to run the project locally.

## Validation commands

```bash
npm run lint
npm run test
npm run build
npm run preview
```

The committed version passes lint, 8 unit tests, and the production build.

## Data sources

- `frontend/public/mock-data.json` is the primary source for users, sprints, tasks, comments, notifications, and analytics inputs.
- DummyJSON provides authentication and token-refresh simulation.
- JSONPlaceholder is used only for simulated notification polling.
- UI components access data through the centralized service/query layer instead of fetching mock data directly.

## Key engineering decisions

- TanStack Query owns API/mock server state, caching, polling, and request lifecycle.
- Zustand owns authentication, persistent board state, notifications, and shared application state.
- Route modules are code-split with `React.lazy` and `Suspense`.
- DnD Kit provides pointer and keyboard sensors; board state persists and the latest move can be undone.
- Analytics are derived from live store data, so task edits and moves update charts automatically.
- Access tokens remain in memory. Local storage is used only for the assignment's refresh-token and persistence simulations.

For deeper implementation details, read the [architecture document](./docs/ARCHITECTURE.md) and [API documentation](./docs/API.md).

## Security

- No private API keys, production passwords, or sensitive credentials are committed.
- Authentication credentials shown above belong to DummyJSON's public demo environment.
- Access tokens are not persisted to browser storage.
- Logout clears the simulated authentication session.

## Current limitations

- Notification polling depends on JSONPlaceholder availability and may be unavailable offline.
- Storybook, axe-core automation, date-range analytics filtering, and PNG chart export are optional bonuses and are not included.
- Lighthouse results vary by evaluator network and device and should be measured against the live deployment.

