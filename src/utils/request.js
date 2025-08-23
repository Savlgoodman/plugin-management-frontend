import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 axios 实例
const service = axios.create({
    baseURL: "/api", // api 的 base_url
    timeout: 5000, // 请求超时时间
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
        ElMessage({
            message: error.message,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
