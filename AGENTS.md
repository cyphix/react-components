# AGENTS.md

## Project overview

A shadcn-style React component collection plus a Storybook gallery. Single
Node.js frontend project — no backend, database, or external services.

- Stack: Vite + React + TypeScript, Tailwind CSS v4, Storybook 10,
  TanStack Router, TanStack Query, TanStack Table, TanStack Form, Zod,
  MirageJS (in-browser mock API), Vitest.
- Package manager: `pnpm`.
- Scripts live in `package.json` (`dev`, `storybook`, `build`,
  `build-storybook`, `lint`, `typecheck`, `test`, `test:run`,
  `registry:build`).

## Conventions

- Forms: use TanStack Form when it makes sense; don't use it where it would cause more harm than good.
- Stories are CSF files next to registry components under
  `src/registry/**/*.stories.tsx`; they render the published components directly
  with args/controls, `play` interactions, and a11y checks. Shadcn primitives and
  internal showcase wrappers are not part of the Storybook gallery.
- Storybook is dark-mode only: `.storybook/manager.ts` themes the manager and
  `.storybook/preview-providers.tsx` forces the `.dark` theme for components.

## Cursor Cloud specific instructions

Dependencies are installed automatically by the startup update script (`pnpm install`).

- Run Storybook: `pnpm dev` (or `pnpm storybook`) at `http://localhost:6006/`.
- One-time browser-test setup: `pnpm exec playwright install chromium`.
- Lint with `pnpm lint` (oxlint), build with `pnpm build` (`tsc -b && storybook build`), type-check with `pnpm typecheck`, test with `pnpm test` or `pnpm test:run`.
- `pnpm test:run` runs the existing jsdom unit tests and the Storybook browser project from `vitest.config.ts`.
- The component registry API is a **MirageJS mock that runs inside the browser**,
  started by `.storybook/preview.tsx` unless `VITE_MOCK_API=false` at build time.
  It intercepts `fetch('/api/...')` in the page only — `curl` will NOT return mock
  data. Verify data flows by loading Storybook in a real browser.
- Path alias `@/` maps to `src/` (configured in `vite.config.ts`,
  `.storybook/main.ts`, and `tsconfig.app.json`). `tsconfig` uses TypeScript 6
  — avoid `baseUrl` (deprecated); `paths` works without it under
  `moduleResolution: bundler`.

## Architecture

This repo is a **GitHub source registry** for the shadcn CLI: consumers install
custom components with `pnpm dlx shadcn@latest add cyphix/react-components/<name>`.
The CLI reads the root `registry.json` (which `include`s
`src/registry/registry.json`) directly from GitHub — no build or hosting step.

- **Registry components** (`src/registry/<name>/`): custom (Cyphix) components
  published by this registry. Each is declared as an item in
  `src/registry/registry.json` with file paths relative to that manifest.
- **UI components** (`src/components/ui/`): vendored shadcn/ui primitives used by
  custom components and stories. These are **not** published by the registry.
  Custom components that need a shadcn primitive list it as a plain name in
  `registryDependencies` (e.g. `"button"`), which resolves to the official shadcn
  registry; dependencies on other custom components use the full address
  `cyphix/react-components/<name>`.
- **Registry stories** (`src/registry/<name>/<name>.stories.tsx`): direct
  component stories with controls, interactions, and a11y coverage. They are
  **not** included in the shadcn registry manifest.
- **Storybook config** (`.storybook/`): `main.ts` wires Vite/Tailwind/alias,
  `preview.tsx` loads global CSS and starts Mirage, and
  `preview-providers.tsx` supplies QueryClient, memory router, dark theme, and
  Sonner.

## Adding a custom (registry) component

1. Create it under `src/registry/<name>/<name>.tsx`.
2. Add a registry item to `src/registry/registry.json` with npm `dependencies` and
   `registryDependencies` as needed (plain names for shadcn primitives,
   `cyphix/react-components/<name>` for other custom components).
3. Add a Storybook story at `src/registry/<name>/<name>.stories.tsx` with
   `component`, args/argTypes controls, and `play` interactions where useful.
4. Validate with `pnpm dlx shadcn@latest registry validate`.

## Storybook coverage

- Keep stories under `src/registry/**` so Storybook only shows published Cyphix
  components; do not add shadcn primitive or internal wrapper stories.
- Use `storybook/test` (`userEvent`, `expect`, `within`, `fn`, `waitFor`) for
  interactions; `@storybook/addon-a11y` runs axe checks with `a11y.test: 'error'`.
- Shared non-story fixtures belong outside `*.stories.tsx` (for example
  `src/storybook/`).
