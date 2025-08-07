import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import PluginsPage from "../views/PluginsPage/index.vue";
import DocumentsPage from "../views/DocumentsPage/index.vue";
import SettingsPage from "../views/SettingsPage/index.vue";
import AnalyticsPage from "../views/AnalyticsPage/index.vue";

const routes = [
    {
        path: "/",
        component: Layout,
        redirect: "/plugins",
        children: [
            {
                path: "plugins",
                name: "plugins",
                component: PluginsPage,
                meta: { title: "采集插件" },
            },
            {
                path: "documents",
                name: "documents",
                component: DocumentsPage,
                meta: { title: "文档管理" },
            },
            {
                path: "settings",
                name: "settings",
                component: SettingsPage,
                meta: { title: "系统设置" },
            },
            {
                path: "analytics",
                name: "analytics",
                component: AnalyticsPage,
                meta: { title: "数据分析" },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
