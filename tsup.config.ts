import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    platform: 'node',
    format: ['esm'],
    clean: true,
    dts: true,
    sourcemap: true,
    minify: true,
    target: 'node22',
    outDir: 'dist',
    onSuccess: 'node dist/index.js',
    external: ['dotenv', /^node:/],
})