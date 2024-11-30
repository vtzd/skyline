import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    clean: true,
    dts: true,
    sourcemap: true,
    minify: true,
    target: 'node20',
    outDir: 'dist',
    onSuccess: 'node dist/index.js'
})