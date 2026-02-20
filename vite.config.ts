import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        flors: path.resolve(__dirname, "flors/index.html"),
        schedule: path.resolve(__dirname, "schedule/index.html"),
        trainers: path.resolve(__dirname, "trainers/index.html"),
        subscriptions: path.resolve(__dirname, "subscriptions/index.html"),
        tryfree: path.resolve(__dirname, "tryfree/index.html"),
        faq: path.resolve(__dirname, "faq/index.html"),
        contacts: path.resolve(__dirname, "contacts/index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
