// PATH: vitest.config.ts
// Vitest configuration for unit + integration tests

import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react() as never],

    test: {
        // Use jsdom for browser-like environment (React Testing Library requirement)
        environment: 'jsdom',

        // Global setup — runs before all tests (adds jest-dom matchers)
        setupFiles: ['./src/test/setup.ts'],

        // Allow describe/it/expect globally without explicit imports
        globals: true,

        // Coverage configuration (optional, used by test:coverage script)
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'src/test/**',
                // Don't count auto-generated files in coverage
                'src/routeTree.gen.ts',
                'src/components/ui/**', // shadcn/ui generated
            ],
        },
    },

    resolve: {
        alias: {
            // Must match vite.config.ts and tsconfig.app.json
            '@': path.resolve(__dirname, './src'),
        },
    },
})
