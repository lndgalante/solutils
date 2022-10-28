import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  platform: 'browser',
  entry: ['./index.ts'],
});
