# @datopian/ckan-gw-explorer

A React component for exploring and visualizing [CKAN](https://ckan.org) datasets
with [Graphic Walker](https://github.com/Kanaries/graphic-walker). Point it at a
CKAN instance and a resource, and it renders an interactive data table + drag-and-drop
chart builder backed by the resource's data.

## Installation

From npm:

```bash
npm install @datopian/ckan-gw-explorer
```

Or directly from GitHub (the repo root **is** the package):

```bash
npm install github:datopian/ckan-gw-explorer
```

Either way, import it by its package name:

```tsx
import { CkanGraphicWalker } from "@datopian/ckan-gw-explorer";
```

This package declares **peer dependencies** — install them in your app if you
haven't already:

```bash
npm install react@^19 react-dom@^19 styled-components@^6 @kanaries/graphic-walker@0.5.0-alpha.4 --legacy-peer-deps
```

> **Why `--legacy-peer-deps`?** Some of Graphic Walker's transitive dependencies
> (e.g. `@headlessui/react`, `react-beautiful-dnd`, `mobx-react-lite`) still
> declare React 16–18 as a peer, so npm refuses to install them alongside
> React 19 under strict peer resolution. The flag tells npm to proceed — React 19
> works fine at runtime. (Yarn/pnpm users generally don't need it.)

> **🛢️ Backend requirement.** Your CKAN instance must have the
> [`ckanext-gwexplorer`](https://github.com/datopian/ckanext-gwexplorer) extension
> installed — it provides the DSL query API this component depends on. See
> [CKAN requirements](#ckan-requirements) below.

> **⚠️ Graphic Walker version matters.** Use `@kanaries/graphic-walker@0.5.0-alpha.4`
> (or newer) with React 19. The "stable" `0.5.0` release has a React-19 regression:
> it bundles a vendored `react-dom/server` with a baked-in version check (throws
> *"Incompatible React versions"*) and imports the removed `findDOMNode`. The
> `0.5.0-alpha.4` build — published as the npm `latest` tag — fixes both.

## Usage

```tsx
import { CkanGraphicWalker } from "@datopian/ckan-gw-explorer";

function DataExplorer() {
  return (
    <div style={{ height: "100vh" }}>
      <CkanGraphicWalker
        ckanUrl="https://your-ckan-instance.org"
        resourceID="012474d1-7506-469d-926f-0e7a3d9aa41a"
        initialSegment="data"
        appearance="light"
      />
    </div>
  );
}

export default DataExplorer;
```

> **Tip:** Graphic Walker fills its parent container. Give an ancestor an explicit
> height (e.g. `height: 100vh`) or the explorer can collapse to zero height and
> appear blank.

### CKAN requirements

This component requires the **DSL query API** on the CKAN backend, provided by
the [`ckanext-gwexplorer`](https://github.com/datopian/ckanext-gwexplorer)
extension. Install and enable it on your CKAN instance before using this
component.

It calls two action API endpoints on `ckanUrl`:

- `GET  /api/3/action/show_dsl_metadata?resourceID=<id>&sort=true` — field schema
- `POST /api/3/action/dsl_query_data` — paged/aggregated data queries

Your CKAN instance must expose these endpoints (via `ckanext-gwexplorer`) and
allow CORS from your app's origin.

## Props

| Prop             | Type                                  | Default      | Description                                              |
| ---------------- | ------------------------------------- | ------------ | -------------------------------------------------------- |
| `ckanUrl`        | `string` (required)                   | —            | Base URL of the CKAN instance.                           |
| `resourceID`     | `string` (required)                   | —            | CKAN resource ID to load.                                |
| `initialSegment` | `"vis" \| "data" \| "chat"`           | `"data"`     | Tab shown on first render.                               |
| `timeout`        | `number`                              | `1000000`    | Computation timeout (ms) passed to Graphic Walker.       |
| `appearance`     | `"light" \| "dark"`                   | `"light"`    | Color scheme.                                            |
| `className`      | `string`                              | `"ckan-gw-explorer"` | Wrapper CSS class.                              |
| `keepAlive`      | `boolean`                             | `true`       | Keep the Graphic Walker store alive across re-renders.   |
| `uiTheme`        | `{ light: {...}, dark: {...} }`       | built-in     | Custom color tokens (background, foreground, primary, …).|
| `defaultConfig`  | `{ config?, layout? }`                | sensible     | Default Graphic Walker config (limit, geoms, size, …).   |
| `onFieldsLoaded` | `(fields: any[]) => void`             | —            | Called once the field schema is fetched.                 |
| `onDataFetched`  | `(data: any[]) => void`               | —            | Called after each data query resolves.                   |
| `onError`        | `(error: Error) => void`              | —            | Called when a metadata/data request fails.               |

## Development

The library lives at the repo root (`src/` → built to `dist/`). A runnable demo
app lives in [`example/`](example/) and consumes the library via `file:..`.

```bash
# install build tooling and build the library
npm install
npm run build            # rollup -> dist/ (also runs automatically via `prepare`)

# run the demo app (builds the library first, then starts CRA)
npm run example:install  # one-time: install the example's deps
npm run example:dev      # rebuild lib + start the example on http://localhost:3000
```

Repo layout:

```
.
├── src/            # library source (entry: src/index.tsx)
├── dist/           # built output (committed; what consumers import)
├── rollup.config.js
├── tsconfig.json
└── example/        # CRA demo app (depends on the library via file:..)
```

## License

MIT © OKNP / Datopian
