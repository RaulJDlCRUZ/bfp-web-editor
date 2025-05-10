import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "./"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../../dist/public",
    emptyOutDir: true, // Clean the output directory before building
  },
  server: {
    watch: {
      ignored: ['../../src/server/**'],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss({config: path.resolve(__dirname, "./tailwind.config.js")})],
      // plugins: [tailwindcss()],
    },
  },
});
