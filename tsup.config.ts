import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: false,
  platform: 'browser',
  entry: ['./index.ts'],
});
