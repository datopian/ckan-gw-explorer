#!/usr/bin/env node
/*
 * Installs the library into example/ the same way a real consumer would: as a
 * packed tarball (a real copy), not a symlink.
 *
 * Why not "file:.." or a symlink? The library lives at the repo root, which is
 * an *ancestor* of example/, so npm can't install it as a file: dependency
 * (cycle). And a bare symlink breaks peer resolution — webpack resolves the
 * symlinked package to its realpath (the repo root, which has no react), so
 * `import "react"` from inside the library fails or loads a second React copy.
 *
 * A packed tarball sidesteps both: the lib is copied into
 * example/node_modules and resolves react / graphic-walker from the example's
 * own node_modules — one React instance, exactly like a published install.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const run = (cmd, opts = {}) =>
  execSync(cmd, { cwd: root, stdio: "inherit", ...opts });

// `npm pack` runs the `prepare` script (rollup build) and prints the tarball
// name to stdout; notices go to stderr.
console.log("Packing @datopian/ckan-gw-explorer ...");
const tarball = execSync("npm pack", { cwd: root, encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean)
  .pop();
const tarballPath = path.join(root, tarball);

try {
  console.log(`Installing ${tarball} into example/ ...`);
  run(`npm --prefix example install "${tarballPath}" --no-save --no-audit --no-fund`);
} finally {
  fs.rmSync(tarballPath, { force: true });
}
console.log("example/ is synced with the current library build.");
