import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }

          if (
            id.includes('lucide-react') ||
            id.includes('react-icons') ||
            id.includes('react-wrap-balancer') ||
            id.includes('embla-carousel-react')
          ) {
            return 'vendor-ui';
          }

          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@/api', replacement: path.resolve(__dirname, './src/shared/api') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/shared/ui') },
      { find: '@/content', replacement: path.resolve(__dirname, './src/shared/data') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/shared/lib/hooks') },
      { find: '@/lib', replacement: path.resolve(__dirname, './src/shared/lib/utils') },
      { find: '@/types', replacement: path.resolve(__dirname, './src/shared/types') },
      { find: '@/seo', replacement: path.resolve(__dirname, './src/shared/config/seo') },
      { find: '@/sections', replacement: path.resolve(__dirname, './src/widgets') },
      { find: '@/router', replacement: path.resolve(__dirname, './src/app/router') },
      { find: '@/layout', replacement: path.resolve(__dirname, './src/app/layout') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
});
