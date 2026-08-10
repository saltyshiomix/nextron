# Changelog

## [10.2.0](https://github.com/saltyshiomix/nextron/compare/v10.1.0..v10.2.0) - 2026-08-10

### What's New

- Bump `nextron` from v10.0.0 to 10.2.0

## [10.1.0](https://github.com/saltyshiomix/nextron/compare/v10.0.0..v10.1.0) - 2026-08-10

### What's New

- TypeScript v7 support
- Use ts-loader instead of babel-loader

### Bug Fixes

- https://github.com/saltyshiomix/nextron/issues/534

## [10.0.0](https://github.com/saltyshiomix/nextron/compare/v9.6.0..v10.0.0) - 2023-03-29

### Breaking Changes (Migration Guide)

- Upgrade `nextron` from v9 to v10
- Rename `main/background.ts` to `main/main.ts`
- Rename `package.json#main` field to `app/main.js`

### What's New

- Next.js v16 support
- ESM support
  - `package.json`
    - Set `package.json#type` to `module`
  - `next.config.js`
    - Use `export default` instead of `module.exports`
  - Codebase
    - Replace `__dirname` to `import.meta.dirname`

### Others

- Performance improvements
- Rewrite whole examples
