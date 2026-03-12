import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/easyadder/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        name: "EasyAdder",
        short_name: "EasyAdder",
        description: "Receipt-style calculator — add rows, toggle signs, get a total",
        theme_color: "#1a1a1a",
        background_color: "#f5f0e8",
        display: "standalone",
        orientation: "portrait",
        scope: "/easyadder/",
        start_url: "/easyadder/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
