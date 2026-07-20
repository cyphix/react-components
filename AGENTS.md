# AGENTS.md

## Project overview

A shadcn-style React component collection plus a development/showcase app. Single
Node.js frontend project — no backend, database, or external services.

- Stack: Vite + React + TypeScript, Tailwind CSS v4, TanStack Router (file-based),
  TanStack Query, Zustand, Zod, MirageJS (in-browser mock API), Vitest.
- Package manager: `pnpm`.
- Scripts live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `preview`,
  `test`, `test:run`, `registry:build`).

## Cursor Cloud specific instructions

Dependencies are installed automatically by the startup update script (`pnpm install`).

- Run the app: `pnpm dev` (Vite dev server on `http://localhost:5173/`). Lint with
  `pnpm lint` (oxlint), build with `pnpm build` (`tsc -b && vite build`), type-check
  with `pnpm typecheck`, test with `pnpm test` or `pnpm test:run`.
- The component registry API is a **MirageJS mock that runs inside the browser**,
  started only in dev from `src/main.tsx` (guarded by `import.meta.env.DEV`).
  It intercepts `fetch('/api/...')` in the page only — `curl http://localhost:5173/api/components`
  will NOT return mock data. Verify data flows by loading the app in a real browser.
- Path alias `@/` maps to `src/` (configured in both `vite.config.ts` and
  `tsconfig.app.json`). `tsconfig` uses TypeScript 6 — avoid `baseUrl` (deprecated);
  `paths` works without it under `moduleResolution: bundler`.

## Architecture

This repo is a **GitHub source registry** for the shadcn CLI: consumers install
custom components with `pnpm dlx shadcn@latest add cyphix/react-components/<name>`.
The CLI reads the root `registry.json` (which `include`s
`src/registry/registry.json`) directly from GitHub — no build or hosting step.

- **Registry components** (`src/registry/<name>/`): custom (Cyphix) components
  published by this registry. Each is declared as an item in
  `src/registry/registry.json` with file paths relative to that manifest.
- **UI components** (`src/components/ui/`): vendored shadcn/ui primitives used by
  the app and custom components. These are **not** published by the registry.
  Custom components that need a shadcn primitive list it as a plain name in
  `registryDependencies` (e.g. `"button"`), which resolves to the official shadcn
  registry; dependencies on other custom components use the full address
  `cyphix/react-components/<name>`.
- **Dev/test pages** (`src/internal/`): internal showcase and integration pages.
  These are **not** included in the shadcn registry manifest.
- **Routes** (`src/routes/`): thin TanStack Router file routes that import page
  components from `src/pages/` or `src/internal/`. Route tree is auto-generated
  to `src/routeTree.gen.ts` by `@tanstack/router-plugin`.
- **Showcase states** (`src/internal/shadcn/<component>/` for shadcn primitives,
  `src/internal/cyphix/<component>/` for custom registry components): per-component
  state demos (e.g. `src/internal/shadcn/button/button-showcase.tsx`), registered
  in `src/internal/showcases.ts` for `/components/$componentId` pages.

## Adding a custom (registry) component

1. Create it under `src/registry/<name>/<name>.tsx`.
2. Add a registry item to `src/registry/registry.json` with npm `dependencies` and
   `registryDependencies` as needed (plain names for shadcn primitives,
   `cyphix/react-components/<name>` for other custom components).
3. Add its metadata to the seed list in `src/mocks/server.ts` with
   `source: 'cyphix'` (shadcn primitives use `source: 'shadcn'`).
4. Create a showcase in `src/internal/cyphix/<component>/<component>-showcase.tsx`
   (shadcn primitives live under `src/internal/shadcn/<component>/`) and register
   it in `src/internal/showcases.ts`.
5. Validate with `pnpm dlx shadcn@latest registry validate`.

## Adding a dev/test page

1. Create the page under `src/internal/<name>/`.
2. Add a file route in `src/routes/<name>/index.tsx` that imports from
   `@/internal/<name>/...`.
3. Add MirageJS endpoints in `src/mocks/server.ts` if the page needs mocked API calls.
4. Add Vitest tests alongside the page in `src/internal/<name>/` when appropriate.

## Setup test page

`/setup-test` demonstrates the full stack: shadcn Button → TanStack Query mutation →
MirageJS `POST /api/setup-test/button-press` → Sonner toast.
