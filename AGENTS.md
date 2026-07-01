# AGENTS.md

## Project overview

A shadcn-style React component collection plus a development/showcase app. Single
Node.js frontend project — no backend, database, or external services.

- Stack: Vite + React + TypeScript, Tailwind CSS v4, TanStack Router, TanStack
  Query, Zustand, Zod, MirageJS (in-browser mock API).
- Package manager: `pnpm`.
- Scripts live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `preview`).

## Cursor Cloud specific instructions

Dependencies are installed automatically by the startup update script (`pnpm install`).

- Run the app: `pnpm dev` (Vite dev server on `http://localhost:5173/`). Lint with
  `pnpm lint` (oxlint), build with `pnpm build` (`tsc -b && vite build`), type-check
  with `pnpm typecheck`.
- The component registry API is a **MirageJS mock that runs inside the browser**,
  started only in dev from `src/main.tsx` (guarded by `import.meta.env.DEV`).
  It intercepts `fetch('/api/...')` in the page only — `curl http://localhost:5173/api/components`
  will NOT return mock data. Verify data flows by loading the app in a real browser.
- Path alias `@/` maps to `src/` (configured in both `vite.config.ts` and
  `tsconfig.app.json`). `tsconfig` uses TypeScript 6 — avoid `baseUrl` (deprecated);
  `paths` works without it under `moduleResolution: bundler`.
- The `Button` component does not support shadcn's `asChild` prop (Radix Slot is not
  installed). To style a link/anchor like a button, apply `buttonVariants({ ... })`
  to the element's `className` instead.
- Adding a component: create it under `src/components/ui/`, add its metadata to the
  seed list in `src/mocks/server.ts`, and register a states showcase in
  `src/pages/showcases.tsx` (keyed by component id) so it appears on the home grid
  and gets a `/components/$componentId` dev page.
