# react-components

A [shadcn](https://ui.shadcn.com/) **GitHub source registry** for custom Cyphix React components, plus a Storybook gallery for developing and previewing them.

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
| `side-panel` | Viewport-stable side panel (fixed rail + in-flow gap) that pushes main content beside it when open (provider, inset, trigger, icon tab) |
| `chat-panel` | Presentational chat shell composed on the Side Panel viewport-stable layout primitive |
| `collection-view` | Data collection that flips between a TanStack Table v9 data table and a card grid — centered top/bottom pagination with customizable page-size options, column visibility toggles (table), optional toolbar search, client or server-driven sorting/pagination, and grid-only infinite scroll (local or async). Type columns with the exported `CollectionViewColumnDef<T>` |
| `creatable-combobox` | Searchable combobox with grouped options, free-form custom values, and a create-new action |
| `time-input` | Validated 12-hour AM/PM or 24-hour `HH:mm`/`HH:mm:ss` time entry (`TimeInput`) with an optional popup picker, plus `DateTimeInput`, a native date picker paired with it that shares one canonical `YYYY-MM-DDTHH:mm(:ss)` value — for places where native `type="time"`/`datetime-local` pickers show the OS locale's 12-hour clock |
| `sortable` | Drag-and-drop reorderable list built on dnd-kit (pointer + keyboard): `SortableList` owns sensors and calls `onReorder` with the reordered items, `SortableItem` wraps each item, and `SortableHandle` is a `Button` grip that drags its enclosing item. Pass any `@dnd-kit/sortable` strategy (default `rectSortingStrategy`) |
| `file-dropzone` | Keyboard-accessible file picker and drop target with type, byte, and per-selection count limits |
| `upload-progress` | Separate green upload and blue server-processing bars with optional cancel and retry actions |
| `attachment-list` | Attachment rows with optional thumbnails, download links, and remove callbacks |

Vendored shadcn/ui primitives in `src/components/ui/` are used by this app and by custom components during development. They are **not** published by this registry. When a custom component depends on a shadcn primitive, it lists a plain name in `registryDependencies` (e.g. `"button"`), which resolves to the official shadcn registry for consumers.

`CreatableCombobox` accepts an optional `clearable` boolean (default `false`).
When enabled, a **Clear search** button appears for non-empty search text. It
clears only the query, restores the option list, and keeps the popover open with
focus on the search input; the selected value is unchanged.

`CreatableCombobox` also accepts `createOnEnter` (default `false`), an opt-in
Enter-to-create mode with no `Use "..."` row: pressing Enter selects the
highlighted option or an exact (trimmed, case-sensitive) match, and otherwise
commits the trimmed query as a new value without submitting an enclosing form.
Typing, pasting, blur, Tab, Escape, and IME composition never create a value.

Search filters the supplied options locally by default. Pass `onSearchChange`
to use server search: it receives the raw query and `options` is displayed
without local filtering. Optionally pass `searchValue` to control the search
input, and set `loading` to show a loading status instead of the empty message.
Pass `selectedOptions` for labels of selected values that may not be in the
current result set.

Pass `multiple` to use a `string[]` for `value` and receive a `string[]` from
`onValueChange`. Selected options appear as removable chips, and the popup
stays open while selecting. Both modes support `onCreateNew(query)`: the host
can open its create dialog and update the controlled selection after creation.

### Media UI

Use `FileDropzone` with `onFilesSelected` to start an upload in your app and
`onFilesRejected` to explain which files were rejected and why. `accept` uses
the native file input syntax (extensions, MIME types, and MIME wildcards).
Single-file selection is the default. Set `multiple` to accept batches and
optionally limit each batch with `maxFiles`. `maxBytes` applies to each file.

Pass transfer progress as `uploadPercent` to the green bar while `uploading`.
Once all bytes have been sent, switch to `processing`: the green bar stays at
100% and the blue bar displays `processingPercent` when the backend reports it.
Omit either percentage if it is unknown; the active bar is then indeterminate.
Set `state="complete"` on success or `state="error"` with an optional
`errorMessage` and `onRetry` on failure. The app supplies progress and owns
any polling or event subscription; the component does not contact the backend.

`AttachmentList` displays files by stable ID. Pass `thumbnailUrl` and
`downloadUrl` where available and `onRemove` when the app allows removal.
These components do not upload or delete files themselves. The app owns
transport, authorization, and server-side file validation.

## Local development

```bash
pnpm install
pnpm exec playwright install chromium  # once, for Storybook browser tests
pnpm dev          # Storybook at http://localhost:6006/
```

Useful scripts:

| Script | Purpose |
| --- | --- |
| `pnpm dev` / `pnpm storybook` | Storybook dev server on port 6006 |
| `pnpm build` | Typecheck + production Storybook build |
| `pnpm build-storybook` | Production Storybook build only |
| `pnpm typecheck` | TypeScript project references check |
| `pnpm lint` | oxlint |
| `pnpm test` / `pnpm test:run` | Vitest unit tests plus Storybook browser tests (watch / once) |

Stories live next to the published components under `src/registry/**/*.stories.tsx`, grouped as `Cyphix/...`. They render the registry components directly with args/controls, `play` interactions, and a11y checks; shadcn primitives and internal wrappers are not shown. The preview forces dark mode and provides TanStack Query, a memory TanStack Router, Sonner, and the MirageJS mock API.

The in-browser MirageJS mock (`/api/...`) runs in Storybook by default; set `VITE_MOCK_API=false` at build time to disable it. The Docker image leaves it enabled. It will not respond to `curl` against the server URL.

## Docker image

`docker-compose.yml` builds Storybook from this repo and serves the static gallery with the mock API enabled (`VITE_MOCK_API=true`).

The Compose stack requires an existing Docker network named `nginx_bridge` by default. Set `PROXY_NETWORK` to use a different existing network. When Nginx Proxy Manager is attached to the same network, forward to `http://react-components:80`.

```bash
docker compose up -d --build
```

Then open `http://localhost:5173/`. Set `SHOWCASE_PORT` to change the host port. Prebuilt images are also published to `ghcr.io/cyphix/react-components` by `.github/workflows/docker.yml` on `v*` tags.

## Project layout

```text
registry.json                 # Root registry (includes src/registry/registry.json)
.storybook/                   # Storybook config, theme, and test providers
src/
  registry/                   # Published custom components
    registry.json
    <name>/<name>.tsx
    <name>/<name>.stories.tsx  # Direct component stories
  components/ui/              # Vendored shadcn primitives (not published)
  storybook/                  # Shared story fixtures
  mocks/server.ts             # MirageJS mock auth API
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, Storybook, TanStack Router, TanStack Query, TanStack Table, TanStack Form, Zod, MirageJS, Vitest.

## Add a custom component

1. Create `src/registry/<name>/<name>.tsx`.
2. Declare it in `src/registry/registry.json` (paths relative to that file). Use plain names in `registryDependencies` for shadcn primitives, and `cyphix/react-components/<name>` for other custom components.
3. Add a Storybook story at `src/registry/<name>/<name>.stories.tsx` with `component`, args/argTypes controls, and `play` interactions where useful.
4. Validate:

```bash
pnpm dlx shadcn@latest registry validate
```

After pushing to GitHub, the item is available as `cyphix/react-components/<name>`.

## License

See [LICENSE](./LICENSE).
