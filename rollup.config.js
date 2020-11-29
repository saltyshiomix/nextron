import external from 'rollup-plugin-auto-external';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts'];

const coreConfig = {
  plugins: [
    external(),
    resolve({
      extensions,
    }),
    babel({
      extensions,
      babelHelpers: 'inline',
      exclude: /node_modules/,
    }),
    commonjs(),
    (process.env.NODE_ENV === 'production' && terser()),
  ],
};

const cliConfig = (src) => ({
  input: src,
  output: {
    dir: 'bin',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  ...coreConfig,
});

const config = (src, dist) => ({
  input: src,
  output: {
    file: dist,
    format: 'cjs',
  },
  ...coreConfig,
});

export default [
  cliConfig('lib/nextron.ts'),
  cliConfig('lib/nextron-init.ts'),
  cliConfig('lib/nextron-dev.ts'),
  cliConfig('lib/nextron-build.ts'),
  config('lib/webpack/build.production.ts', 'bin/webpack.config.js'),
];
