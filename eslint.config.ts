import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig(
  {
    ignores: [
      '.vscode',
      '**/bin/*',
      '**/examples/*',
      '**/workspace/*',
      '**/*.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig
)
