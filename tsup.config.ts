import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['hooks/index.ts', 'core/index.ts', 'common/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
