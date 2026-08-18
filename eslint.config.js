// PATH: eslint.config.js
// ESLint v9 Flat Config — Kiểm soát nghiêm ngặt kiến trúc tầng (Boundaries) và cấm sử dụng 'any'

import boundaries from 'eslint-plugin-boundaries'
import pluginQuery from '@tanstack/eslint-plugin-query'
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // ─── Global ignores ───────────────────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/routeTree.gen.ts',
    ],
  },

  // ─── Base configs ─────────────────────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],

  // ─── Scripts & Config files (Node Environment) ────────────────────────────
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // ─── Application Source Code ──────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries,
    },
    settings: {
      // ── Định nghĩa các tầng kiến trúc (Architecture Layers) ──────────────────
      'boundaries/elements': [
        { type: 'types', pattern: 'src/types/*' },
        { type: 'config', pattern: 'src/config/*' },
        { type: 'shared', pattern: 'src/shared/**/*' },
        { type: 'features', pattern: 'src/features/*/*', capture: ['feature'] },
        { type: 'features-index', pattern: 'src/features/*' },
        { type: 'layouts', pattern: 'src/layouts/**/*' },
        { type: 'app', pattern: 'src/app/**/*' },
        { type: 'routes', pattern: 'src/routes/**/*' },
        { type: 'styles', pattern: 'src/styles/**/*' },
        { type: 'assets', pattern: 'src/assets/**/*' },
      ],
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // ─── React Hooks Rules ────────────────────────────────────────────────
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ─── TypeScript Strict Rules (CẤM DÙNG ANY) ───────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // ─── Quy tắc phân tầng & Cấm tạo file / import sai chỗ (Boundaries) ────
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // types: Không được import từ bất kỳ tầng logic nào
            { from: 'types', allow: [] },

            // config: Chỉ được import types & shared
            { from: 'config', allow: ['types', 'shared'] },

            // shared (nền tảng chung): Không được phụ thuộc ngược lên features, routes, layouts
            { from: 'shared', allow: ['types', 'config', 'shared', 'assets', 'styles'] },

            // features: Chỉ được import từ shared, config, types, assets và chính nội bộ feature của mình
            {
              from: 'features',
              allow: [
                'config',
                'shared',
                'types',
                'assets',
                'styles',
                ['features', { feature: '${from.feature}' }],
              ],
            },

            // layouts: Có thể import từ shared, config, types, layouts nội bộ
            {
              from: 'layouts',
              allow: ['shared', 'config', 'types', 'assets', 'styles', 'layouts'],
            },

            // routes (định tuyến): Chỉ import feature pages/APIs, layouts, shared, config (Không viết UI trực tiếp trong router)
            {
              from: 'routes',
              allow: ['features', 'features-index', 'layouts', 'shared', 'config', 'types', 'assets', 'styles'],
            },

            // app / main: Entry point có thể import các layer
            {
              from: 'app',
              allow: ['features', 'features-index', 'layouts', 'shared', 'config', 'types', 'routes', 'styles', 'assets'],
            },
          ],
        },
      ],
    },
  },
)
