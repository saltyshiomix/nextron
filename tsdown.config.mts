import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: 'lib/nextron.ts',
    outDir: 'bin',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    dts: false,
    minify: process.env.NODE_ENV === 'production',
  },
  {
    entry: {
      'webpack.config': 'lib/webpack/production/webpack.config.ts',
    },
    outDir: 'bin',
    format: 'cjs',
    dts: false,
    minify: process.env.NODE_ENV === 'production',
  },
])
