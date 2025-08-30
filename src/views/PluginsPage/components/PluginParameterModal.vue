<template>
    <el-dialog
        v-model="visible"
        title="插件参数编辑"
        width="75%"
        :modal="true"
        :append-to-body="true"
        :destroy-on-close="true"
        class="plugin-parameter-modal"
    >
        <!-- 插件完整内容模态框 -->
        <PluginContentModal
            v-model="contentModalVisible"
            :plugin-data="pluginContent"
        />

        <!-- 修改名称对话框 -->
        <el-dialog
            v-model="nameEditDialog"
            title="修改插件信息"
            width="500px"
            :modal="true"
            :append-to-body="true"
            :destroy-on-close="true"
            class="name-edit-dialog"
        >
            <div class="name-edit-content" v-loading="documentLoading">
                <div class="current-info-section">
                    <div class="current-name">
                        <label>当前插件名称：</label>
                        <span class="name-text">{{ pluginInfo.name }}</span>
                    </div>
                    <div class="current-document" v-if="currentDocumentName">
                        <label>当前文档名称：</label>
                        <span class="name-text">{{ currentDocumentName }}</span>
                    </div>
                </div>

                <el-divider />

                <div class="edit-section">
                    <div class="new-name-input">
                        <label>新插件名称：</label>
                        <el-input
                            v-model="newPluginName"
                            placeholder="请输入新的插件名称"
                            maxlength="100"
                            show-word-limit
                            clearable
                        />
                    </div>
                    <div class="new-document-input">
                        <label>新文档名称：</label>
                        <el-input
                            v-model="newDocumentName"
                            placeholder="留空则使用插件名称"
                            maxlength="100"
                            show-word-limit
                            clearable
                        />
                        <div class="input-tip">
                            <el-icon><InfoFilled /></el-icon>
                            <span
                                >如果不填写，文档名称将与插件名称保持一致</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="nameEditDialog = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="handleSaveName"
                        :loading="nameSaving"
                        :disabled="!hasNameChanges"
                    >
                        <el-icon><Check /></el-icon>
                        保存
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <div class="parameter-container" v-loading="loading">
            <!-- 头部信息 -->
            <div class="header-section">
                <div class="header-left">
                    <el-icon class="header-icon"><Setting /></el-icon>
                    <div class="header-info">
                        <h3 class="plugin-name">
                            {{ pluginInfo.name || "插件参数" }}
                        </h3>
                        <p class="plugin-url">{{ pluginInfo.url || "" }}</p>
                    </div>
                </div>
                <div class="header-right">
                    <el-button
                        type="warning"
                        plain
                        @click="handleEditName"
                        class="edit-name-btn"
                    >
                        <el-icon><Edit /></el-icon>
                        修改信息
                    </el-button>
                    <el-button
                        type="info"
                        plain
                        @click="handleViewContent"
                        :loading="contentLoading"
                    >
                        <el-icon><Document /></el-icon>
                        查看完整参数
                    </el-button>
                </div>
            </div>

            <!-- 参数编辑区域 -->
            <div class="parameters-section">
                <!-- 输入参数 -->
                <div class="parameter-group">
                    <div class="group-header">
                        <el-icon class="group-icon"><Download /></el-icon>
                        <h4 class="group-title">输入参数 (可编辑)</h4>
                        <span class="parameter-count">{{
                            inputParameters.length
                        }}</span>
                    </div>

                    <div
                        class="parameter-list"
                        v-if="inputParameters.length > 0"
                    >
                        <div
                            v-for="param in inputParameters"
                            :key="param.id"
                            class="parameter-item"
                        >
                            <div class="parameter-header">
                                <div class="parameter-name-section">
                                    <span class="parameter-name">{{
                                        param.name
                                    }}</span>
                                    <el-tag size="small" type="primary">{{
                                        param.type
                                    }}</el-tag>
                                </div>
                                <div class="parameter-node-info">
                                    <span class="node-name">{{
                                        param.nodeName
                                    }}</span>
                                    <el-tag size="small" type="info"
                                        >节点 {{ param.nodeId }}</el-tag
                                    >
                                </div>
                            </div>

                            <div
                                class="parameter-description"
                                v-if="param.desc"
                            >
                                <el-icon><InfoFilled /></el-icon>
                                <span>{{ param.desc }}</span>
                            </div>

                            <div class="parameter-input">
                                <el-input
                                    v-if="param.type === 'text'"
                                    v-model="editableParams[param.name]"
                                    :placeholder="param.exampleValue"
                                    type="textarea"
                                    :rows="2"
                                    class="parameter-textarea"
                                />
                                <el-input-number
                                    v-else-if="param.type === 'int'"
                                    v-model="editableParams[param.name]"
                                    :placeholder="param.exampleValue"
                                    class="parameter-number"
                                    :min="0"
                                />
                                <el-input
                                    v-else
                                    v-model="editableParams[param.name]"
                                    :placeholder="param.exampleValue"
                                    class="parameter-input-default"
                                />
                            </div>
                        </div>
                    </div>
                    <el-empty
                        v-else
                        description="暂无输入参数"
                        :image-size="80"
                    />
                </div>

                <!-- 输出参数 -->
                <div class="parameter-group">
                    <div class="group-header">
                        <el-icon class="group-icon"><Upload /></el-icon>
                        <h4 class="group-title">输出参数 (只读)</h4>
                        <span class="parameter-count">{{
                            outputParameters.length
                        }}</span>
                    </div>

                    <div
                        class="parameter-list"
                        v-if="outputParameters.length > 0"
                    >
                        <div
                            v-for="param in outputParameters"
                            :key="param.id"
                            class="parameter-item readonly"
                        >
                            <div class="parameter-header">
                                <div class="parameter-name-section">
                                    <span class="parameter-name">{{
                                        param.name
                                    }}</span>
                                    <el-tag size="small" type="success">{{
                                        param.type
                                    }}</el-tag>
                                </div>
                                <div class="parameter-field-info">
                                    <el-tag
                                        size="small"
                                        type="warning"
                                        v-if="param.recordASField"
                                    >
                                        记录字段
                                    </el-tag>
                                </div>
                            </div>

                            <div
                                class="parameter-description"
                                v-if="param.desc"
                            >
                                <el-icon><InfoFilled /></el-icon>
                                <span>{{ param.desc }}</span>
                            </div>

                            <div class="parameter-input">
                                <el-input
                                    :value="param.exampleValue"
                                    disabled
                                    class="readonly-input"
                                    placeholder="示例值"
                                />
                            </div>
                        </div>
                    </div>
                    <el-empty
                        v-else
                        description="暂无输出参数"
                        :image-size="80"
                    />
                </div>
            </div>
        </div>

        <!-- 底部操作按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button @click="handleReset" :disabled="!hasChanges">
                    <el-icon><RefreshLeft /></el-icon>
                    重置
                </el-button>
                <el-button
                    type="primary"
                    @click="handleSave"
                    :loading="saving"
                    :disabled="!hasChanges"
                >
                    <el-icon><Check /></el-icon>
                    保存修改
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref, computed, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    fetchPluginParameters,
    updatePluginParameters,
    fetchPluginContent,
    updatePluginName,
    fetchPluginDocument,
} from "../api/plugins.js";
import PluginContentModal from "./PluginContentModal.vue";

export default {
    name: "PluginParameterModal",
    components: {
        PluginContentModal,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        pluginInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ["update:modelValue", "save-success", "name-updated"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        // 数据状态
        const loading = ref(false);
        const saving = ref(false);
        const contentLoading = ref(false);
        const inputParameters = ref([]);
        const outputParameters = ref([]);
        const editableParams = ref({});
        const originalParams = ref({});
        const contentModalVisible = ref(false);
        const pluginContent = ref({});

        // 修改名称相关状态
        const nameEditDialog = ref(false);
        const newPluginName = ref("");
        const newDocumentName = ref("");
        const currentDocumentName = ref("");
        const nameSaving = ref(false);
        const documentLoading = ref(false);

        // 计算是否有修改
        const hasChanges = computed(() => {
            for (const key in editableParams.value) {
                if (editableParams.value[key] !== originalParams.value[key]) {
                    return true;
                }
            }
            return false;
        });

        // 计算名称是否有修改
        const hasNameChanges = computed(() => {
            const pluginNameChanged =
                newPluginName.value.trim() &&
                newPluginName.value.trim() !== props.pluginInfo.name;
            const documentNameChanged =
                newDocumentName.value.trim() !== currentDocumentName.value;
            return pluginNameChanged || documentNameChanged;
        });

        // 加载插件参数
        const loadParameters = async () => {
            if (!props.pluginInfo.id) return;

            loading.value = true;
            try {
                const response = await fetchPluginParameters(
                    props.pluginInfo.id
                );
                if (response.success) {
                    inputParameters.value = response.data.inputParameters || [];
                    outputParameters.value =
                        response.data.outputParameters || [];

                    // 初始化可编辑参数
                    const params = {};
                    const original = {};
                    inputParameters.value.forEach((param) => {
                        params[param.name] = param.value;
                        original[param.name] = param.value;
                    });

                    editableParams.value = params;
                    originalParams.value = original;
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("加载插件参数失败");
                console.error("加载插件参数失败:", error);
            } finally {
                loading.value = false;
            }
        };

        // 查看完整内容
        const handleViewContent = async () => {
            if (!props.pluginInfo.id) return;

            contentLoading.value = true;
            try {
                const response = await fetchPluginContent(props.pluginInfo.id);
                if (response.success) {
                    pluginContent.value = response.data;
                    contentModalVisible.value = true;
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("获取插件内容失败");
                console.error("获取插件内容失败:", error);
            } finally {
                contentLoading.value = false;
            }
        };

        // 修改名称
        const handleEditName = async () => {
            // 重置输入值
            newPluginName.value = props.pluginInfo.name || "";
            newDocumentName.value = "";
            currentDocumentName.value = "";

            // 获取当前文档信息
            documentLoading.value = true;
            try {
                const response = await fetchPluginDocument(props.pluginInfo.id);
                if (response.success) {
                    currentDocumentName.value =
                        response.data.document_name || "";
                    newDocumentName.value = response.data.document_name || "";
                } else {
                    console.warn("获取文档信息失败:", response.message);
                }
            } catch (error) {
                console.error("获取文档信息失败:", error);
            } finally {
                documentLoading.value = false;
            }

            nameEditDialog.value = true;
        };

        // 保存新名称
        const handleSaveName = async () => {
            if (!hasNameChanges.value) {
                return;
            }

            const pluginName = newPluginName.value.trim();
            const documentName = newDocumentName.value.trim();

            // 基本验证
            if (!pluginName) {
                ElMessage.error("插件名称不能为空");
                return;
            }

            nameSaving.value = true;
            try {
                const response = await updatePluginName(
                    props.pluginInfo.id,
                    pluginName,
                    documentName || null // 如果为空则传null，让后端使用插件名称
                );

                if (response.success) {
                    ElMessage.success(response.message);

                    // 更新本地插件信息
                    emit("update:pluginInfo", {
                        ...props.pluginInfo,
                        name: pluginName,
                    });

                    // 关闭对话框
                    nameEditDialog.value = false;

                    // 通知父组件名称已更新
                    emit("name-updated", {
                        id: props.pluginInfo.id,
                        oldName: props.pluginInfo.name,
                        newName: pluginName,
                        oldDocumentName: currentDocumentName.value,
                        newDocumentName: documentName || pluginName,
                    });
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("修改失败");
                console.error("修改失败:", error);
            } finally {
                nameSaving.value = false;
            }
        };

        // 保存修改
        const handleSave = async () => {
            if (!hasChanges.value) {
                ElMessage.info("没有需要保存的修改");
                return;
            }

            // 构建只包含修改内容的参数对象
            const updates = {};
            for (const key in editableParams.value) {
                if (editableParams.value[key] !== originalParams.value[key]) {
                    updates[key] = editableParams.value[key];
                }
            }

            if (Object.keys(updates).length === 0) {
                ElMessage.info("没有需要保存的修改");
                return;
            }

            saving.value = true;
            try {
                const response = await updatePluginParameters(
                    props.pluginInfo.id,
                    updates
                );
                if (response.success) {
                    ElMessage.success(response.message);

                    // 更新原始参数
                    Object.assign(originalParams.value, updates);

                    emit("save-success", response.data);
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("保存参数失败");
                console.error("保存参数失败:", error);
            } finally {
                saving.value = false;
            }
        };

        // 重置修改
        const handleReset = async () => {
            try {
                await ElMessageBox.confirm(
                    "确定要重置所有修改吗？这将丢失当前的修改内容。",
                    "确认重置",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                // 重置为原始值
                editableParams.value = { ...originalParams.value };
                ElMessage.success("已重置所有修改");
            } catch {
                // 用户取消
            }
        };

        // 取消/关闭
        const handleCancel = async () => {
            if (hasChanges.value) {
                try {
                    await ElMessageBox.confirm(
                        "有未保存的修改，确定要关闭吗？",
                        "确认关闭",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }
                    );
                } catch {
                    return; // 用户取消
                }
            }

            visible.value = false;
        };

        // 监听模态框显示状态
        watch(
            () => props.modelValue,
            (newVal) => {
                if (newVal && props.pluginInfo.id) {
                    nextTick(() => {
                        loadParameters();
                    });
                }
            }
        );

        return {
            visible,
            loading,
            saving,
            contentLoading,
            inputParameters,
            outputParameters,
            editableParams,
            hasChanges,
            contentModalVisible,
            pluginContent,
            // 修改名称相关
            nameEditDialog,
            newPluginName,
            newDocumentName,
            currentDocumentName,
            nameSaving,
            documentLoading,
            hasNameChanges,
            handleEditName,
            handleSaveName,
            handleViewContent,
            handleSave,
            handleReset,
            handleCancel,
        };
    },
};
</script>

<style scoped>
.plugin-parameter-modal {
    --primary-color: #409eff;
    --success-color: #67c23a;
    --warning-color: #e6a23c;
    --danger-color: #f56c6c;
    --info-color: #909399;
}

.parameter-container {
    max-height: 65vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
}

.header-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.header-right {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.edit-name-btn {
    margin-right: 4px;
}

.header-icon {
    color: var(--primary-color);
    font-size: 24px;
    margin-top: 4px;
}

.header-info h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

.header-info p {
    margin: 0;
    font-size: 14px;
    color: #909399;
}

.parameters-section {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.parameter-group {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e4e7ed;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.group-icon {
    color: var(--primary-color);
    font-size: 18px;
}

.group-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    flex: 1;
}

.parameter-count {
    background: var(--primary-color);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.parameter-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.parameter-item {
    background: white;
    border-radius: 6px;
    padding: 12px;
    border: 1px solid #e4e7ed;
    transition: all 0.3s ease;
}

.parameter-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.parameter-item.readonly {
    background: #fafafa;
    border-color: #f0f0f0;
}

.parameter-item.readonly:hover {
    border-color: #d9d9d9;
    box-shadow: none;
}

.parameter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.parameter-name-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.parameter-name {
    font-weight: 600;
    color: #303133;
    font-size: 14px;
}

.parameter-node-info,
.parameter-field-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.node-name {
    font-size: 12px;
    color: #606266;
}

.parameter-description {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 6px;
    border-left: 3px solid var(--primary-color);
}

.parameter-description .el-icon {
    color: var(--primary-color);
    font-size: 14px;
}

.parameter-description span {
    font-size: 13px;
    color: #606266;
    line-height: 1.4;
}

.parameter-input {
    margin-top: 8px;
}

.parameter-textarea {
    --el-input-bg-color: #fff;
}

.parameter-number {
    width: 100%;
}

.parameter-input-default {
    --el-input-bg-color: #fff;
}

.readonly-input {
    --el-input-bg-color: #f5f7fa;
    --el-input-text-color: #606266;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;
}

/* 修改名称对话框样式 */
.name-edit-dialog {
    --el-dialog-padding-primary: 20px;
}

.name-edit-content {
    padding: 16px 0;
}

.current-info-section {
    margin-bottom: 16px;
}

.current-name,
.current-document {
    margin-bottom: 12px;
}

.edit-section {
    margin-top: 16px;
}

.new-name-input,
.new-document-input {
    margin-bottom: 16px;
}

.current-name label,
.current-document label,
.new-name-input label,
.new-document-input label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #303133;
    font-size: 14px;
}

.name-text {
    display: inline-block;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 4px;
    color: #606266;
    font-size: 14px;
    border: 1px solid #e4e7ed;
    max-width: 100%;
    word-break: break-all;
}

.new-name-input .el-input,
.new-document-input .el-input {
    width: 100%;
}

.input-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 8px;
    background: #f0f9ff;
    border-radius: 4px;
    border-left: 3px solid #409eff;
}

.input-tip .el-icon {
    color: #409eff;
    font-size: 14px;
}

.input-tip span {
    font-size: 12px;
    color: #606266;
    line-height: 1.4;
}

/* 滚动条样式 */
.parameters-section::-webkit-scrollbar {
    width: 8px;
}

.parameters-section::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.parameters-section::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.parameters-section::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 响应式处理 */
@media (max-width: 768px) {
    .plugin-parameter-modal :deep(.el-dialog) {
        width: 95% !important;
        margin: 5vh auto;
    }

    .parameter-container {
        max-height: 70vh;
    }

    .header-section {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }

    .parameter-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .group-header {
        flex-wrap: wrap;
        gap: 8px;
    }
}

@media (min-width: 1200px) {
    .plugin-parameter-modal :deep(.el-dialog) {
        width: 60% !important;
    }
}
</style>
