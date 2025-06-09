import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// @see https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Plugins...
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Place all assets (JS, CSS, images) in the `static` folder
    assetsDir: 'static',

    rollupOptions: {
      output: {
        // Ensure index.html is at root (default behavior)
        // No need to change entryFileNames or chunkFileNames for index.html
        // Customize chunk and asset file names inside static folder
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) {
            return 'static/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/.test(name ?? '')) {
            return 'static/img/[name]-[hash][extname]';
          }
          // default static folder for other assets
          return 'static/assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
