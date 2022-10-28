import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  format: 'esm',
  sourcemap: true,
  splitting: false,
  entry: ['./index.ts'],
});
