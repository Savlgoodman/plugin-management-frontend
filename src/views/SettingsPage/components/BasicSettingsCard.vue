<template>
    <el-card class="basic-settings-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><Setting /></el-icon>
                    <span class="header-title">基本设置</span>
                </div>
            </div>
        </template>

        <div class="settings-tabs">
            <el-tabs v-model="activeTab" class="settings-tabs-container">
                <!-- 系统设置 -->
                <el-tab-pane name="system" label="系统设置">
                    <div class="tab-content">
                        <el-form
                            :model="systemForm"
                            :rules="systemRules"
                            ref="systemFormRef"
                            label-width="100px"
                            class="settings-form"
                        >
                            <el-form-item label="系统名称" prop="systemName">
                                <el-input
                                    v-model="systemForm.systemName"
                                    placeholder="请输入系统名称"
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="系统描述" prop="systemDesc">
                                <el-input
                                    v-model="systemForm.systemDesc"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入系统描述"
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="系统版本">
                                <el-input
                                    v-model="systemForm.version"
                                    disabled
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="时区设置" prop="timezone">
                                <el-select
                                    v-model="systemForm.timezone"
                                    placeholder="请选择时区"
                                    class="setting-input"
                                >
                                    <el-option
                                        v-for="zone in timezoneOptions"
                                        :key="zone.value"
                                        :label="zone.label"
                                        :value="zone.value"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="handleSaveSystemSettings"
                                    class="save-button"
                                >
                                    保存设置
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 用户设置 -->
                <el-tab-pane name="user" label="用户设置">
                    <div class="tab-content">
                        <el-form
                            :model="userForm"
                            :rules="userRules"
                            ref="userFormRef"
                            label-width="100px"
                            class="settings-form"
                        >
                            <el-form-item label="用户名" prop="username">
                                <el-input
                                    v-model="userForm.username"
                                    disabled
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="姓名" prop="name">
                                <el-input
                                    v-model="userForm.name"
                                    placeholder="请输入姓名"
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="原始密码" prop="oldPassword">
                                <el-input
                                    v-model="passwordForm.oldPassword"
                                    type="password"
                                    placeholder="请输入原始密码"
                                    show-password
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item label="新密码" prop="newPassword">
                                <el-input
                                    v-model="passwordForm.newPassword"
                                    type="password"
                                    placeholder="请输入新密码"
                                    show-password
                                    class="setting-input"
                                />
                            </el-form-item>

                            <el-form-item
                                label="确认密码"
                                prop="confirmPassword"
                            >
                                <el-input
                                    v-model="passwordForm.confirmPassword"
                                    type="password"
                                    placeholder="请确认新密码"
                                    show-password
                                    class="setting-input"
                                />
                            </el-form-item>
                        </el-form>

                        <div class="form-footer">
                            <el-button
                                type="primary"
                                @click="handleSaveUserSettings"
                                class="save-button"
                            >
                                保存修改
                            </el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    getBasicSettings,
    saveSystemSettings,
    saveUserSettings,
} from "../api/settings";

export default {
    name: "BasicSettingsCard",
    setup() {
        const activeTab = ref("system");

        // 系统设置表单
        const systemForm = reactive({
            systemName: "",
            systemDesc: "",
            version: "v2.3.1",
            timezone: "Asia/Shanghai",
        });

        // 时区选项
        const timezoneOptions = [
            { value: "Asia/Shanghai", label: "中国标准时间 (GMT+8)" },
            { value: "Asia/Tokyo", label: "日本标准时间 (GMT+9)" },
            { value: "Asia/Seoul", label: "韩国标准时间 (GMT+9)" },
            { value: "Asia/Singapore", label: "新加坡时间 (GMT+8)" },
            { value: "Europe/London", label: "格林威治标准时间 (GMT+0)" },
            { value: "Europe/Paris", label: "中欧时间 (GMT+1)" },
            { value: "America/New_York", label: "东部标准时间 (GMT-5)" },
            { value: "America/Los_Angeles", label: "太平洋标准时间 (GMT-8)" },
        ];

        // 系统设置验证规则
        const systemRules = reactive({
            systemName: [
                { required: true, message: "请输入系统名称", trigger: "blur" },
                {
                    min: 2,
                    max: 50,
                    message: "长度在 2 到 50 个字符之间",
                    trigger: "blur",
                },
            ],
            systemDesc: [
                { required: true, message: "请输入系统描述", trigger: "blur" },
                {
                    min: 10,
                    max: 200,
                    message: "长度在 10 到 200 个字符之间",
                    trigger: "blur",
                },
            ],
            timezone: [
                { required: true, message: "请选择时区", trigger: "change" },
            ],
        });

        // 用户设置表单
        const userForm = reactive({
            username: "",
            name: "",
        });

        // 用户设置验证规则
        const userRules = reactive({
            name: [
                { required: true, message: "请输入姓名", trigger: "blur" },
                {
                    min: 2,
                    max: 20,
                    message: "长度在 2 到 20 个字符之间",
                    trigger: "blur",
                },
            ],
        });

        // 密码表单
        const passwordForm = reactive({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        // 密码验证规则
        const passwordRules = reactive({
            oldPassword: [
                { required: true, message: "请输入原始密码", trigger: "blur" },
            ],
            newPassword: [
                { required: true, message: "请输入新密码", trigger: "blur" },
                { min: 6, message: "密码长度至少6位", trigger: "blur" },
            ],
            confirmPassword: [
                { required: true, message: "请确认新密码", trigger: "blur" },
                {
                    validator: (rule, value, callback) => {
                        if (value !== passwordForm.newPassword) {
                            callback(new Error("两次输入的密码不一致"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur",
                },
            ],
        });

        // 从API获取基本设置
        const fetchBasicSettings = async () => {
            try {
                const response = await getBasicSettings();
                if (response.success) {
                    const data = response.data;
                    systemForm.systemName = data.systemName;
                    systemForm.systemDesc = data.systemDesc;
                    systemForm.timezone = data.timezone;
                    userForm.username = data.username;
                    userForm.name = data.name;
                }
            } catch (error) {
                console.error("获取基本设置失败:", error);
            }
        };

        // 保存系统设置
        const handleSaveSystemSettings = async () => {
            ElMessageBox.confirm(
                "确定要保存系统设置吗？此操作将应用新的系统配置。",
                "确认保存",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(async () => {
                    try {
                        const response = await saveSystemSettings({
                            systemName: systemForm.systemName,
                            systemDesc: systemForm.systemDesc,
                            timezone: systemForm.timezone,
                        });
                        if (response.success) {
                            ElMessage.success(response.message);
                        }
                    } catch (error) {
                        console.error("保存系统设置失败:", error);
                        ElMessage.error("保存设置失败");
                    }
                })
                .catch(() => {
                    ElMessage.info("已取消保存");
                });
        };

        // 保存用户设置
        const handleSaveUserSettings = async () => {
            ElMessageBox.confirm(
                "确定要保存用户设置吗？修改密码后需要重新登录。",
                "确认保存",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(async () => {
                    try {
                        const response = await saveUserSettings({
                            name: userForm.name,
                            oldPassword: passwordForm.oldPassword,
                            newPassword: passwordForm.newPassword,
                        });
                        if (response.success) {
                            ElMessage.success(response.message);
                            // 这里可以添加退出登录的逻辑
                        }
                    } catch (error) {
                        console.error("保存用户设置失败:", error);
                        ElMessage.error("保存设置失败");
                    }
                })
                .catch(() => {
                    ElMessage.info("已取消保存");
                });
        };

        onMounted(() => {
            // 初始化数据
            fetchBasicSettings();
        });

        return {
            activeTab,
            systemForm,
            systemRules,
            timezoneOptions,
            userForm,
            userRules,
            passwordForm,
            passwordRules,
            handleSaveSystemSettings,
            handleSaveUserSettings,
        };
    },
};
</script>

<style scoped>
.basic-settings-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 18px;
    color: #4285f4;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.settings-tabs {
    padding: 0 10px;
}

.settings-tabs-container :deep(.el-tabs__header) {
    margin-bottom: 0;
}

.tab-content {
    padding: 20px 0;
}

.settings-form {
    max-width: 500px;
}

.setting-input {
    width: 100%;
}

.form-footer {
    padding: 20px 0 0 0;
    display: flex;
    justify-content: flex-end;
}

.save-button {
    border-radius: 12px;
    padding: 10px 24px;
}

.change-password-btn {
    border-radius: 12px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .settings-form {
        max-width: 100%;
    }
}
</style>
