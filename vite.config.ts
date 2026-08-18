// PATH: vite.config.ts
// Vite configuration for enterprise React base project
// Includes: TanStack Router plugin (file-based routing), path aliases, env validation

import path from 'path'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router: must be BEFORE react plugin to generate routeTree.gen.ts
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    // React plugin WITHOUT React Compiler — disabled for compatibility with TanStack + shadcn
    react(),
  ],

  resolve: {
    alias: {
      // @/* → src/* (matches tsconfig.app.json paths)
      '@': path.resolve(__dirname, './src'),
      // shadcn CLI output uses src/ paths
      src: path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  build: {
    // Target modern browsers — safe for enterprise internal tools
    target: 'es2022',
    sourcemap: true,
  },
})
