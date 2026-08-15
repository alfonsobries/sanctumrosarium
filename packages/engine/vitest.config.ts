import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@rosario/content': new URL('../content/src/index.ts', import.meta.url).pathname,
    },
  },
});
