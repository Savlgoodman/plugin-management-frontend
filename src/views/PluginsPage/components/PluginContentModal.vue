<template>
    <el-dialog
        v-model="visible"
        title="插件完整内容"
        width="70%"
        :modal="true"
        :append-to-body="true"
        :destroy-on-close="true"
        class="plugin-content-modal"
    >
        <div class="content-container">
            <div class="header-section">
                <el-icon class="header-icon"><Document /></el-icon>
                <span class="header-title">{{
                    pluginData.name || "插件内容"
                }}</span>
                <div class="header-actions">
                    <el-button
                        v-if="!isEditMode"
                        type="primary"
                        size="small"
                        @click="enterEditMode"
                        :disabled="!pluginId"
                    >
                        <el-icon><Edit /></el-icon>
                        编辑配置
                    </el-button>
                    <template v-else>
                        <el-button
                            type="success"
                            size="small"
                            @click="saveEditedConfig"
                            :loading="editing"
                        >
                            <el-icon><Check /></el-icon>
                            保存
                        </el-button>
                        <el-button
                            type="info"
                            size="small"
                            @click="exitEditMode"
                            :disabled="editing"
                        >
                            <el-icon><Close /></el-icon>
                            取消
                        </el-button>
                    </template>
                </div>
            </div>

            <div class="json-viewer-container">
                <div
                    v-if="!isEditMode"
                    class="json-content"
                    v-html="formatJson(pluginData)"
                ></div>
                <div v-else class="json-editor-container">
                    <el-input
                        v-model="jsonString"
                        type="textarea"
                        :rows="20"
                        placeholder="请输入JSON配置"
                        class="json-editor"
                    />
                    <div class="editor-tip">
                        <el-icon><InfoFilled /></el-icon>
                        <span>直接编辑JSON配置，保存后将更新插件配置</span>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
                <el-button type="primary" @click="copyToClipboard">
                    <el-icon><CopyDocument /></el-icon>
                    复制内容
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { Edit, Check, Close, InfoFilled } from "@element-plus/icons-vue";
import { updatePluginJSON } from "../api/plugins.js";

export default {
    name: "PluginContentModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        pluginData: {
            type: Object,
            default: () => ({}),
        },
        pluginId: {
            type: String,
            default: "",
        },
    },
    emits: ["update:modelValue", "config-updated"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        // 编辑模式相关状态
        const isEditMode = ref(false);
        const editedData = ref({});
        const editing = ref(false);

        // JSON字符串的计算属性
        const jsonString = computed({
            get: () => JSON.stringify(editedData.value, null, 2),
            set: (value) => {
                try {
                    if (validateJSON(value)) {
                        editedData.value = JSON.parse(value);
                    }
                } catch (error) {
                    console.error("解析JSON失败:", error);
                }
            },
        });

        // 格式化JSON并添加语法高亮
        const formatJson = (data) => {
            if (!data || Object.keys(data).length === 0) {
                return '<span class="json-null">暂无数据</span>';
            }

            try {
                const jsonString = JSON.stringify(data, null, 2);
                return syntaxHighlight(jsonString);
            } catch (error) {
                return '<span class="json-error">JSON格式错误</span>';
            }
        };

        // 进入编辑模式
        const enterEditMode = () => {
            editedData.value = JSON.parse(JSON.stringify(props.pluginData));
            isEditMode.value = true;
        };

        // 退出编辑模式
        const exitEditMode = () => {
            isEditMode.value = false;
            editedData.value = {};
        };

        // 保存编辑的配置
        const saveEditedConfig = async () => {
            if (!props.pluginId) {
                ElMessage.error("插件ID不能为空");
                return;
            }

            editing.value = true;
            try {
                const response = await updatePluginJSON(
                    props.pluginId,
                    editedData.value
                );

                if (response.success) {
                    ElMessage.success(response.message);
                    exitEditMode();
                    // 通知父组件配置已更新
                    emit("config-updated", editedData.value);
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("保存配置失败");
                console.error("保存配置失败:", error);
            } finally {
                editing.value = false;
            }
        };

        // 验证JSON格式
        const validateJSON = (jsonString) => {
            try {
                JSON.parse(jsonString);
                return true;
            } catch (error) {
                return false;
            }
        };

        // JSON语法高亮
        const syntaxHighlight = (json) => {
            json = json
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            return json.replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                function (match) {
                    let cls = "json-number";
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = "json-key";
                        } else {
                            cls = "json-string";
                        }
                    } else if (/true|false/.test(match)) {
                        cls = "json-boolean";
                    } else if (/null/.test(match)) {
                        cls = "json-null";
                    }
                    return '<span class="' + cls + '">' + match + "</span>";
                }
            );
        };

        // 复制到剪贴板
        const copyToClipboard = async () => {
            try {
                const jsonString = JSON.stringify(props.pluginData, null, 2);
                await navigator.clipboard.writeText(jsonString);
                ElMessage.success("内容已复制到剪贴板");
            } catch (error) {
                ElMessage.error("复制失败");
                console.error("复制失败:", error);
            }
        };

        const handleClose = () => {
            visible.value = false;
        };

        return {
            visible,
            formatJson,
            copyToClipboard,
            handleClose,
            // 编辑模式相关
            isEditMode,
            editedData,
            editing,
            enterEditMode,
            exitEditMode,
            saveEditedConfig,
            jsonString,
        };
    },
};
</script>

<style scoped>
.plugin-content-modal {
    --json-key-color: #881391;
    --json-string-color: #c41a16;
    --json-number-color: #1c00cf;
    --json-boolean-color: #5c2699;
    --json-null-color: #808080;
    --json-error-color: #ff0000;
}

.content-container {
    max-height: 60vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.header-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

.header-icon {
    color: #409eff;
    font-size: 20px;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.header-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
}

.json-viewer-container {
    flex: 1;
    overflow: auto;
    background: #f8f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 12px;
}

.json-content {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    background: transparent;
    border: none;
    padding: 0;
}

.json-editor-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.json-editor {
    flex: 1;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 13px;
    line-height: 1.6;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #fdfdfd;
    color: #303133;
    resize: none;
    overflow-y: auto;
}

.editor-tip {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #909399;
    font-size: 12px;
}

:deep(.json-key) {
    color: var(--json-key-color);
    font-weight: 600;
}

:deep(.json-string) {
    color: var(--json-string-color);
}

:deep(.json-number) {
    color: var(--json-number-color);
}

:deep(.json-boolean) {
    color: var(--json-boolean-color);
    font-weight: 600;
}

:deep(.json-null) {
    color: var(--json-null-color);
    font-style: italic;
}

:deep(.json-error) {
    color: var(--json-error-color);
    font-weight: 600;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

/* 滚动条样式 */
.json-viewer-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.json-viewer-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.json-viewer-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.json-viewer-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 响应式处理 */
@media (max-width: 768px) {
    .plugin-content-modal :deep(.el-dialog) {
        width: 95% !important;
        margin: 5vh auto;
    }

    .content-container {
        max-height: 65vh;
    }

    .json-content {
        font-size: 12px;
    }
}

@media (min-width: 1200px) {
    .plugin-content-modal :deep(.el-dialog) {
        width: 55% !important;
    }
}

@media (min-width: 1600px) {
    .plugin-content-modal :deep(.el-dialog) {
        width: 50% !important;
    }
}
</style>
