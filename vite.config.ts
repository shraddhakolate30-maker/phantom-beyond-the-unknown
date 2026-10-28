import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    // Transformers.js ships a WASM-backed ONNX runtime that Vite's dep
    // pre-bundling mangles. Exclude it so the runtime loads correctly at runtime.
    include: ['@huggingface/transformers'],
  },
  worker: {
    format: 'es',
  },
});
