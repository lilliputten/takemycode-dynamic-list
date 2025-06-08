import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const VERCEL_URL = process.env.VERCEL_URL;

console.log('[vite.config] VERCEL_URL:', VERCEL_URL);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_VERCEL_URL': JSON.stringify(VERCEL_URL),
  },
});
