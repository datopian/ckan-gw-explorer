# CKAN Graphic Walker Explorer - Monorepo

A React component library for visualizing CKAN datasets using Graphic Walker, organized as a monorepo.

## 📁 Project Structure

```
ckan-gw-explorer/
├── packages/
│   ├── core/           # Main library package
│   │   ├── src/        # Source code
│   │   ├── dist/       # Built files
│   │   └── package.json
│   └── example/        # Example React app
│       ├── src/        # Example app source
│       └── package.json
├── package.json        # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Development
```bash
# Install all dependencies
npm install

# Build the library
npm run build

# Start the example app
npm run example

# Development with auto-rebuild
npm run example:dev
```

### Individual Package Commands
```bash
# Core library
npm run build --workspace=packages/core
npm run dev --workspace=packages/core

# Example app
npm run start --workspace=packages/example
```

## 📦 Available Scripts

### Root Level
- `npm run build` - Build the core library
- `npm run dev` - Watch mode for core library
- `npm run example` - Start example app
- `npm run example:dev` - Start example with auto-rebuild
- `npm run build:all` - Build all packages
- `npm run clean` - Clean all node_modules and dist
- `npm run install:all` - Install dependencies for all packages

### Core Package
- `npm run build --workspace=packages/core` - Build library
- `npm run dev --workspace=packages/core` - Watch mode

### Example Package
- `npm run start --workspace=packages/example` - Start example app
- `npm run dev-sync --workspace=packages/example` - Rebuild library

## 🔄 Development Workflow

1. **Make changes** to `packages/core/src/CkanGraphicWalker.tsx`
2. **Build library**: `npm run build`
3. **Example app** automatically uses the updated library


## Example of using the library

```tsx
import { CkanGraphicWalker } from "ckan-gw-explorer";

function DataExplorer() {
  return (
    <CkanGraphicWalker
      ckanUrl="http://ckan.com"
      datasetId="012474d1-7506-469d-926f-0e7a3d9aa41a"
      appearance="light"
      initialSegment="data"
    />
  );
}

export default DataExplorer;
```
