<template>
    <el-dialog
        v-model="visible"
        title="添加插件"
        :width="600"
        :before-close="handleClose"
        :append-to-body="true"
        :modal="true"
        :lock-scroll="true"
        class="plugin-upload-dialog"
    >
        <el-tabs v-model="activeTab" type="border-card">
            <!-- 文件上传方式 -->
            <el-tab-pane label="上传文件" name="file">
                <div class="upload-section">
                    <el-upload
                        ref="uploadRef"
                        class="upload-dragger"
                        drag
                        :auto-upload="false"
                        :limit="1"
                        accept=".json"
                        :on-change="handleFileChange"
                        :on-remove="handleFileRemove"
                        :file-list="fileList"
                    >
                        <el-icon class="el-icon--upload"
                            ><UploadFilled
                        /></el-icon>
                        <div class="el-upload__text">
                            将JSON文件拖到此处，或<em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                只支持JSON格式文件，文件大小不超过10MB
                            </div>
                        </template>
                    </el-upload>

                    <!-- 文件信息预览 -->
                    <div v-if="selectedFile" class="file-preview">
                        <el-card>
                            <template #header>
                                <div class="card-header">
                                    <span>文件信息</span>
                                </div>
                            </template>
                            <div class="file-info">
                                <p>
                                    <strong>文件名:</strong>
                                    {{ selectedFile.name }}
                                </p>
                                <p>
                                    <strong>文件大小:</strong>
                                    {{ formatFileSize(selectedFile.size) }}
                                </p>
                                <p>
                                    <strong>最后修改:</strong>
                                    {{ formatDate(selectedFile.lastModified) }}
                                </p>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-tab-pane>

            <!-- JSON输入方式 -->
            <el-tab-pane label="JSON配置" name="json">
                <div class="json-section">
                    <el-form
                        ref="jsonFormRef"
                        :model="jsonForm"
                        :rules="jsonRules"
                        label-width="80px"
                    >
                        <el-form-item label="插件名称" prop="name" required>
                            <el-input
                                v-model="jsonForm.name"
                                placeholder="请输入插件名称"
                                maxlength="255"
                                show-word-limit
                            />
                        </el-form-item>

                        <el-form-item label="插件URL" prop="url" required>
                            <el-input
                                v-model="jsonForm.url"
                                placeholder="请输入插件URL地址"
                                maxlength="512"
                                show-word-limit
                            />
                        </el-form-item>

                        <el-form-item label="保存名称" prop="saveName" required>
                            <el-input
                                v-model="jsonForm.saveName"
                                placeholder="请输入保存名称"
                                maxlength="255"
                                show-word-limit
                            />
                        </el-form-item>

                        <el-form-item label="插件描述" prop="description">
                            <el-input
                                v-model="jsonForm.description"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入插件描述（可选）"
                                maxlength="500"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button
                    type="primary"
                    :loading="uploading"
                    @click="handleSubmit"
                >
                    {{ uploading ? "导入中..." : "导入插件" }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { importPluginFile, importPluginJSON } from "../api/plugins.js";

export default {
    name: "PluginUploadModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue", "success"],
    setup(props, { emit }) {
        const uploadRef = ref(null);
        const jsonFormRef = ref(null);
        const activeTab = ref("file");
        const uploading = ref(false);
        const fileList = ref([]);
        const selectedFile = ref(null);

        // 响应式控制对话框显示
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        // JSON表单数据
        const jsonForm = reactive({
            name: "",
            url: "",
            saveName: "",
            description: "",
        });

        // JSON表单验证规则
        const jsonRules = {
            name: [
                { required: true, message: "请输入插件名称", trigger: "blur" },
                {
                    max: 255,
                    message: "插件名称不能超过255个字符",
                    trigger: "blur",
                },
            ],
            url: [
                { required: true, message: "请输入插件URL", trigger: "blur" },
                {
                    max: 512,
                    message: "URL长度不能超过512个字符",
                    trigger: "blur",
                },
                {
                    type: "url",
                    message: "请输入有效的URL地址",
                    trigger: "blur",
                },
            ],
            saveName: [
                { required: true, message: "请输入保存名称", trigger: "blur" },
                {
                    max: 255,
                    message: "保存名称不能超过255个字符",
                    trigger: "blur",
                },
                {
                    pattern: /^[a-zA-Z0-9_-]+$/,
                    message: "保存名称只能包含字母、数字、下划线和连字符",
                    trigger: "blur",
                },
            ],
            description: [
                { max: 500, message: "描述不能超过500个字符", trigger: "blur" },
            ],
        };

        // 监听对话框关闭，重置表单
        watch(visible, (newVal) => {
            if (!newVal) {
                resetForm();
            }
        });

        // 文件选择处理
        const handleFileChange = (file) => {
            // 验证文件类型
            if (!file.name.toLowerCase().endsWith(".json")) {
                ElMessage.error("只支持JSON格式文件");
                return false;
            }

            // 验证文件大小（10MB）
            if (file.size > 10 * 1024 * 1024) {
                ElMessage.error("文件大小不能超过10MB");
                return false;
            }

            selectedFile.value = file.raw;
            fileList.value = [file];
        };

        // 文件移除处理
        const handleFileRemove = () => {
            selectedFile.value = null;
            fileList.value = [];
        };

        // 格式化文件大小
        const formatFileSize = (bytes) => {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
                parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
            );
        };

        // 格式化日期
        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleString("zh-CN");
        };

        // 重置表单
        const resetForm = () => {
            activeTab.value = "file";
            uploading.value = false;
            selectedFile.value = null;
            fileList.value = [];

            // 重置JSON表单
            Object.assign(jsonForm, {
                name: "",
                url: "",
                saveName: "",
                description: "",
            });

            // 清除表单验证
            if (jsonFormRef.value) {
                jsonFormRef.value.clearValidate();
            }
        };

        // 提交处理
        const handleSubmit = async () => {
            if (uploading.value) return;

            uploading.value = true;

            try {
                let result;

                if (activeTab.value === "file") {
                    // 文件上传方式
                    if (!selectedFile.value) {
                        ElMessage.error("请选择要上传的JSON文件");
                        return;
                    }

                    result = await importPluginFile(selectedFile.value);
                } else {
                    // JSON数据方式
                    const isValid = await jsonFormRef.value
                        .validate()
                        .catch(() => false);
                    if (!isValid) {
                        return;
                    }

                    result = await importPluginJSON({
                        name: jsonForm.name,
                        url: jsonForm.url,
                        saveName: jsonForm.saveName,
                        description: jsonForm.description || undefined,
                    });
                }

                if (result.success) {
                    ElMessage.success(result.message);
                    emit("success", result.data);
                    handleClose();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("导入插件失败:", error);
                ElMessage.error("导入插件失败，请重试");
            } finally {
                uploading.value = false;
            }
        };

        // 关闭对话框
        const handleClose = () => {
            if (uploading.value) {
                ElMessage.warning("正在导入中，请稍候...");
                return;
            }
            visible.value = false;
        };

        return {
            uploadRef,
            jsonFormRef,
            visible,
            activeTab,
            uploading,
            fileList,
            selectedFile,
            jsonForm,
            jsonRules,
            handleFileChange,
            handleFileRemove,
            formatFileSize,
            formatDate,
            handleSubmit,
            handleClose,
        };
    },
};
</script>

<style scoped>
/* 确保模态框正确显示在最顶层 */
:deep(.el-dialog) {
    border-radius: 16px;
    margin-top: 5vh !important;
}

:deep(.el-overlay) {
    z-index: 3000 !important;
}

.plugin-upload-dialog {
    border-radius: 16px;
}

.upload-section {
    padding: 20px 0;
}

.upload-dragger {
    width: 100%;
}

.file-preview {
    margin-top: 20px;
}

.file-info p {
    margin: 8px 0;
    color: #606266;
}

.json-section {
    padding: 20px 0;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:deep(.el-tabs__content) {
    padding: 0;
}

:deep(.el-upload-dragger) {
    border-radius: 12px;
    transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
    border-color: #409eff;
}
</style>
