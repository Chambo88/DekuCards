import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  //TODO for dev only
  server: {
    https: {
      key: "C:/Certbot/live/benchamberlainlocal.homes/privkey.pem",
      cert: "C:/Certbot/live/benchamberlainlocal.homes/fullchain.pem",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Auto-updates the service worker when new content is available
      manifest: {
        name: "My Progressive Web App",
        short_name: "MyPWA",
        description: "An awesome PWA!",
        display: "standalone",
        start_url: "/",
        // icons: [
        //   {
        //     src: 'icon-192x192.png',
        //     sizes: '192x192',
        //     type: 'image/png',
        //   },
        //   {
        //     src: 'icon-512x512.png',
        //     sizes: '512x512',
        //     type: 'image/png',
        //   },
        // ],
      },
    }),
  ],
});
