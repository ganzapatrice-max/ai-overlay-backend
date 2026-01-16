import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: __dirname,

  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,
    open: false, // prevent browser popup (Electron only)
    host: "localhost"
  },

  build: {
    outDir: "dist",
    emptyOutDir: true
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
