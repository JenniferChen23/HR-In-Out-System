import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://34.80.60.228:8080", // 你要打的後端 API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 把 /api 拿掉
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
  },
});
