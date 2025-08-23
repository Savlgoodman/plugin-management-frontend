import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 13030,
        host: true,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "element-plus/theme-chalk/src/common/var.scss" as *;`,
            },
        },
    },
});
