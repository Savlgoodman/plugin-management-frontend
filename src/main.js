import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./style.css";
import { checkFontLoad } from "./utils/fontUtils.js";

const app = createApp(App);

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router);
app.use(ElementPlus);

// 字体加载检测
document.addEventListener("DOMContentLoaded", () => {
    checkFontLoad();
});

app.mount("#app");
