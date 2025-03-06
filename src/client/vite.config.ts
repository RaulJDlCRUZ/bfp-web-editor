import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // outDir: "../../src/server/public", // Sirviendo el frontend desde el backend
    outDir: "../../dist/public"
  },
});