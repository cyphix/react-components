# react-components

A [shadcn](https://ui.shadcn.com/) **GitHub source registry** for custom Cyphix React components, plus a local showcase app for developing and previewing them.

Consumers install components with the shadcn CLI directly from this public repo — no build step or hosted registry server required.

## Install a component (consumers)

Prerequisites: a project already set up with shadcn (`components.json`, Tailwind, path aliases).

```bash
# List available items
pnpm dlx shadcn@latest list cyphix/react-components

# Inspect an item before installing
pnpm dlx shadcn@latest view cyphix/react-components/callout

# Add a component
pnpm dlx shadcn@latest add cyphix/react-components/callout

# Preview without writing files
pnpm dlx shadcn@latest add cyphix/react-components/callout --dry-run
```

Pin a branch, tag, or commit with `#ref`:

```bash
pnpm dlx shadcn@latest add cyphix/react-components/callout#main
```

### Published components

| Name | Description |
| --- | --- |
| `callout` | Attention callout with info, success, warning, and destructive variants |
| `infobox` | Fandom-style infobox rendered from a JSON data object: titled sections, label/value rows, tabbed images with contain/cover fit, tabbed section groups, and an optional accent color |
| `side-panel` | In-flow side panel layout primitive that pushes main content beside it when open (provider, inset, trigger, icon tab) |
| `chat-panel` | Presentational chat shell composed on the Side Panel push-layout primitive |

Vendored shadcn/ui primitives in `src/components/ui/` are used by this app and by custom components during development. They are **not** published by this registry. When a custom component depends on a shadcn primitive, it lists a plain name in `registryDependencies` (e.g. `"button"`), which resolves to the official shadcn registry for consumers.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173/
```

Useful scripts:

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Vite dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm typecheck` | TypeScript project references check |
| `pnpm lint` | oxlint |
| `pnpm test` / `pnpm test:run` | Vitest (watch / once) |
| `pnpm preview` | Serve the production build |

The home page lists **Cyphix** components (this registry) and **shadcn** primitives (showcase only). Open `/components/<id>` for per-component state demos.

The in-browser MirageJS mock (`/api/...`) runs only in the page during `pnpm dev`. It will not respond to `curl` against the Vite URL.

## Project layout

```text
registry.json                 # Root registry (includes src/registry/registry.json)
src/
  registry/                   # Published custom components
    registry.json
    <name>/<name>.tsx
  components/ui/              # Vendored shadcn primitives (not published)
  internal/
    cyphix/<name>/            # Showcases for custom components
    shadcn/<name>/            # Showcases for vendored primitives
    showcases.ts              # Registry of showcase pages
  pages/                      # App pages (home, component detail)
  routes/                     # TanStack Router file routes
  mocks/server.ts             # MirageJS seed data for the showcase catalog
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, TanStack Router, TanStack Query, Zustand, Zod, MirageJS, Vitest.

## Add a custom component

1. Create `src/registry/<name>/<name>.tsx`.
2. Declare it in `src/registry/registry.json` (paths relative to that file). Use plain names in `registryDependencies` for shadcn primitives, and `cyphix/react-components/<name>` for other custom components.
3. Add catalog metadata in `src/mocks/server.ts` with `source: 'cyphix'`.
4. Add a showcase at `src/internal/cyphix/<name>/<name>-showcase.tsx` and register it in `src/internal/showcases.ts`.
5. Validate:

```bash
pnpm dlx shadcn@latest registry validate
```

After pushing to GitHub, the item is available as `cyphix/react-components/<name>`.

## License

See [LICENSE](./LICENSE).
