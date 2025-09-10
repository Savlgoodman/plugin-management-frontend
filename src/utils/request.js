import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 axios 实例
const service = axios.create({
    baseURL: "/api", // api 的 base_url
    timeout: 50000, // 请求超时时间
});

// request 拦截器
service.interceptors.request.use(
    (config) => {
        // 排除登录和验证码接口
        if (
            !config.url.includes("/auth/login") &&
            !config.url.includes("/auth/captcha")
        ) {
            const token = localStorage.getItem("access-token");
            if (token) {
                config.headers["access-token"] = token;
            }
        }
        return config;
    },
    (error) => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    (response) => {
        // 如果是blob类型响应（文件下载），直接返回原始响应
        if (response.config.responseType === "blob") {
            return response;
        }

        const res = response.data;
        if (res.code !== 200) {
            ElMessage({
                message: res.message || "Error",
                type: "error",
                duration: 5 * 1000,
            });
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    },
    (error) => {
        console.log("err" + error); // for debug
        // 403 未授权，token失效
        if (error.response && error.response.status === 403) {
            ElMessage({
                message: "登录已过期，请重新登录",
                type: "error",
                duration: 5 * 1000,
            });
            // 清除本地存储的token
            localStorage.removeItem("access-token");
            // 跳转到登录页
            window.location.href = "/login";
        } else {
            ElMessage({
                message: error.message,
                type: "error",
                duration: 5 * 1000,
            });
        }
        return Promise.reject(error);
    }
);

export default service;
