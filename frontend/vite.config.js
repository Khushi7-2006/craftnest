import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev server proxies /api requests to the backend so the frontend
// can call fetch("/api/...") without hardcoding a host.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
