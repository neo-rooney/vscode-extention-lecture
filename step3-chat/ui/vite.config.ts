import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../webview", // webview 폴더로 출력
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`, // 해시 없는 파일명
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});
