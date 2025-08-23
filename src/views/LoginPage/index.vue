<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2 class="login-title">系统登录</h2>
            <el-form
                :model="loginForm"
                :rules="rules"
                ref="loginFormRef"
                @keyup.enter="submitForm"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input
                                v-model="loginForm.captcha"
                                placeholder="请输入验证码"
                                prefix-icon="el-icon-key"
                            ></el-input>
                        </el-col>
                        <el-col :span="8">
                            <img
                                :src="captchaImage"
                                @click="getCaptcha"
                                class="captcha-img"
                                alt="验证码"
                            />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm"
                        class="login-button"
                        >登录</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../../utils/request.js";
import { useRouter } from "vue-router";

const router = useRouter();
const loginForm = ref({
    username: "",
    password: "",
    captcha: "",
    uuid: "",
});
const captchaImage = ref("");
const loginFormRef = ref(null);

const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const getCaptcha = async () => {
    try {
        const response = await request.get("/auth/captcha");
        captchaImage.value = response.data.image;
        loginForm.value.uuid = response.data.uuid;
    } catch (error) {
        ElMessage.error("获取验证码失败");
    }
};

const submitForm = () => {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const response = await request.post(
                    "/auth/login",
                    loginForm.value
                );
                localStorage.setItem(
                    "access-token",
                    response.data["access-token"]
                );
                ElMessage.success("登录成功");
                router.push("/");
            } catch (error) {
                ElMessage.error("登录失败");
                getCaptcha();
            }
        }
    });
};

onMounted(() => {
    getCaptcha();
});
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
}

.login-card {
    width: 400px;
}

.login-title {
    text-align: center;
    margin-bottom: 20px;
}

.captcha-img {
    width: 100%;
    height: 40px;
    cursor: pointer;
}

.login-button {
    width: 100%;
}
</style>
