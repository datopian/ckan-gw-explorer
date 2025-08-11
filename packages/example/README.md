# CKAN Graphic Walker Explorer - Example App

This is an example React app that demonstrates how to use the `ckan-gw-explorer` library.

## Quick Start

```bash
# From the root directory
npm run example:dev

# Or from this directory
npm start
```

## Development Workflow

1. **Make changes** to the library in `/src` (root directory)
2. **Build the library**: `npm run build:lib` (from root)
3. **The example app will automatically reload** with your changes

## Available Scripts

- `npm start` - Start the example app
- `npm run update-lib` - Build the library from the root directory

## How it Works

This example app is linked to the main library using npm link. When you make changes to the library source code and rebuild it, the example app will automatically pick up those changes.

## Port

The example app runs on **port 3000** by default (http://localhost:3000).

## Troubleshooting

If the example app doesn't pick up changes:
1. Make sure the library is built: `npm run build:lib` (from root)
2. Check that the npm link is working: `npm ls ckan-gw-explorer`
3. Restart the example app if needed
