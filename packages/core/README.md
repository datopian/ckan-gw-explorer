# @datopian/ckan-gw-explorer

A React component for exploring and visualizing [CKAN](https://ckan.org) datasets
with [Graphic Walker](https://github.com/Kanaries/graphic-walker). Point it at a
CKAN instance and a resource, and it renders an interactive data table + drag-and-drop
chart builder backed by the resource's data.

## Installation

```bash
npm install @datopian/ckan-gw-explorer
```

This package declares **peer dependencies** — install them in your app if you
haven't already:

```bash
npm install react@^19 react-dom@^19 @kanaries/graphic-walker@0.5.0-alpha.4
```

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

The component calls two CKAN action API endpoints on `ckanUrl`:

- `GET  /api/3/action/show_dsl_metadata?resourceID=<id>&sort=true` — field schema
- `POST /api/3/action/dsl_query_data` — paged/aggregated data queries

These are provided by the DSL query extension on the CKAN backend. Your CKAN
instance must expose them and allow CORS from your app's origin.

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

## License

MIT © OKNP / Datopian
