import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  //TODO for dev only
  server: {
    https: {
      key: "../certs/privkey.pem",
      cert: "../certs/fullchain.pem",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Auto-updates the service worker when new content is available
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "My Progressive Web App",
        short_name: "MyPWA",
        description: "An awesome PWA!",
        display: "standalone",
        start_url: ".",
        theme_color: "#000000",
        background_color: "#ffffff",

        icons: [
          {
            src: "/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
