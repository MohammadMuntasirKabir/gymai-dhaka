import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    // The `neon-auth` vendor chunk (Neon Auth SDK) legitimately exceeds
    // Vite's 500 kB default. It is an isolated, long-cacheable third-party
    // chunk (the SDK embeds its own sync engine + pg + zod + prettier); it
    // cannot be shrunk from the app side. Initial load stays small because this
    // chunk is lazy-fetched only with the auth UI. We raise the threshold to
    // match the real, optimally-split chunk rather than suppress the build.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("neon") || id.includes("@neondatabase")) return "neon-auth";
          if (id.includes("lucide-react")) return "icons";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) {
            return "react-vendor";
          }
          return "vendor";
        },
      },
    },
  },
});
