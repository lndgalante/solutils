import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  entry: ['./index.ts'],
});
