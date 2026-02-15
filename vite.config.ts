import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const REPO_NAME = "ultraprogymandfitness";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? `/${REPO_NAME}/` : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
