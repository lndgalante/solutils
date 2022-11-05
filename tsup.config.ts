import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: false,
  platform: 'browser',
  entry: ['./index.ts'],
});
