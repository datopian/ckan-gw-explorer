const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const css = require('rollup-plugin-css-only');

const packageJson = require('./package.json');

module.exports = [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      css({ output: 'bundle.css' }),
      typescript({ 
        tsconfig: './tsconfig.json',
        exclude: ['**/__tests__/**'],
        declaration: true,
        declarationDir: './dist'
      }),
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime', '@kanaries/graphic-walker'],
  },
]; 