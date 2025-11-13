# Critical Thinking Platform Frontend

React frontend for the intelligent learning platform that powers student/teacher RAG experiences, class management, and invitations. The project is built on Create React App with React Router and TanStack Query for data fetching.

## Getting Started

Install dependencies and launch the dev server:

```bash
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000). Configure the backend URL via `.env` (`REACT_APP_API_BASE_URL`).

## Scripts

- `npm start` – run the development server.
- `npm test` – execute Jest + React Testing Library suites one-off (`--watchAll=false`).
- `npm run build` – produce an optimized production bundle.

## Testing & Quality

React Testing Library exercises key user flows (class creation, profile editing). To add new tests, use the helpers in `src/test-utils/renderWithProviders.js` for consistent QueryClient/Router setup.

```bash
npm test -- --watch
```

Linting is handled by the CRA ESLint preset; IDE integrations surface issues automatically. For now, run `npm test` before commits to ensure UI regressions are caught.

## Project Structure Highlights

- `src/api/` – typed API clients for auth, classes, students, invitations, and RAG endpoints.
- `src/state/` – authentication context and token persistence helpers.
- `src/pages/` – route-level screens grouped by domain (auth, teacher, student, profile).
- `src/features/` – feature-specific UI and data hooks (teacher class management, student RAG flows).
- `src/components/` – shared layout and UI primitives.

## Further Reading

- [React](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [React Router](https://reactrouter.com/en/main)
