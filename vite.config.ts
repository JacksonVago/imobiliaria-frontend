import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert"

// https://vitejs.dev/config/
export default defineConfig({
  //plugins: [react(), mkcert()],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port:90
  }
});