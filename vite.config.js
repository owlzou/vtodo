import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VitePWA } from "vite-plugin-pwa";

export default {
  base: "./",
  server:{
    https:true,
  },
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "VTodo",
        short_name: "VTodo",
        description: "Task manager, todo.txt Web UI",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
        theme_color: "#fad645",
        background_color: "#ffffff",
        display: "standalone",
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|ts)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          }]
      }
    }),
  ],
};
