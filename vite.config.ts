import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
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
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
