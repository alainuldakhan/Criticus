# Criticus

Critical thinking platform with RAG technology.

## Getting Started

```bash
npm install
npm start
```

App will open at [http://localhost:3000](http://localhost:3000)

## Configuration

Create `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Commands

```bash
npm start   # Dev server
npm test    # Run tests
npm build   # Production build
```

## Tech Stack

- React 19
- React Router 6
- TanStack Query 5
- Axios

## Architecture

```
src/
├── api/          # API clients
├── components/   # UI components
├── features/     # Feature modules
├── hooks/        # React hooks
├── lib/          # Utilities
├── services/     # Business logic
└── pages/        # Pages
```
