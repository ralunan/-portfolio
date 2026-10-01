import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset path relative, so the built site works at
// ralunan.github.io/-portfolio/ (and anywhere else) without hard-coding the
// repo name. Routing is hash-based for the same reason (see src/main.jsx).
export default defineConfig({
    base: './',
    plugins: [react()],
});
