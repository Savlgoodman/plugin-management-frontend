import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
        host: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "element-plus/theme-chalk/src/common/var.scss" as *;`,
            },
        },
    },
});
