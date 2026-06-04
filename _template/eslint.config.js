import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    // Calibrated for a high-fidelity animation prototype template. Correctness
    // rules (rules-of-hooks, no-undef, etc.) stay at `error`. The rules below are
    // demoted to `warn` because they fire intentionally in this codebase:
    //   - exhaustive-deps: animation effects deliberately omit deps to run once.
    //   - set-state-in-effect / static-components / refs: react-hooks@7's new
    //     rules false-positive on the measure-in-effect and inline-motion-component
    //     patterns pervasive in the vendored motion-primitives (src/components/ui).
    //   - only-export-components: components and their helpers/tokens are
    //     intentionally co-located here (HMR state-loss is acceptable for sketches).
    // They remain visible as warnings so `npm run lint` surfaces real breakage.
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/refs': 'warn',
      'react-refresh/only-export-components': 'warn',
      // Treat a leading underscore (and rest-sibling omissions like
      // `const { exit: _, ...rest } = x`) as intentional throwaways.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  // Demo and system pages co-locate sample data with the leaf route component;
  // Fast Refresh state-preservation is irrelevant for them.
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Vendored motion-primitives use `any` in their internals. Keep the rule strict
  // for first-party app/lib code; tolerate it in the copy-paste component layer.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
