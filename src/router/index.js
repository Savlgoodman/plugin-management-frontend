import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import PluginsPage from "../views/PluginsPage/index.vue";
import DocumentsPage from "../views/DocumentsPage/index.vue";
import FilePage from "../views/FilePage/index.vue";
import SettingsPage from "../views/SettingsPage/index.vue";
import AnalyticsPage from "../views/AnalyticsPage/index.vue";
import LoginPage from "../views/LoginPage/index.vue";

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
                meta: { title: "公文管理" },
            },
            {
                path: "files",
                name: "files",
                component: FilePage,
                meta: { title: "规范管理" },
            },
            // {
            //     path: "settings",
            //     name: "settings",
            //     component: SettingsPage,
            //     meta: { title: "系统设置" },
            // },
            // {
            //     path: "analytics",
            //     name: "analytics",
            //     component: AnalyticsPage,
            //     meta: { title: "数据分析" },
            // },
        ],
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage,
        meta: { title: "登录" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("access-token");
    if (to.name !== "login" && !token) {
        next({ name: "login" });
    } else {
        next();
    }
});

export default router;
