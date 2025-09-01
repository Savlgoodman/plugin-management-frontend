<template>
    <el-dialog
        v-model="visible"
        title="插件转换配置"
        width="600px"
        :before-close="handleClose"
        class="convert-modal"
    >
        <div class="modal-content">
            <!-- 步骤指示器 -->
            <el-steps
                :active="currentStep"
                finish-status="success"
                class="steps"
            >
                <el-step title="选择插件" description="选择要转换的插件" />
                <el-step title="转换表结构" description="转换数据表结构" />
                <el-step title="配置下载" description="配置下载字段" />
            </el-steps>

            <!-- 步骤1: 选择插件 -->
            <div v-if="currentStep === 0" class="step-content">
                <h3 class="step-title">选择要转换的插件</h3>
                <div class="plugin-selection">
                    <el-table
                        :data="availablePlugins"
                        @current-change="handlePluginSelect"
                        highlight-current-row
                        v-loading="loadingPlugins"
                        class="plugin-table"
                    >
                        <el-table-column label="插件ID" prop="id" width="80" />
                        <el-table-column label="插件名称" prop="name" />
                        <el-table-column label="表名" prop="saveName" />
                        <el-table-column label="状态" width="100">
                            <template #default="{ row }">
                                <el-tag
                                    :type="
                                        row.is_file_download === 1
                                            ? 'success'
                                            : 'info'
                                    "
                                    size="small"
                                >
                                    {{
                                        row.is_file_download === 1
                                            ? "已转换"
                                            : "未转换"
                                    }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!-- 步骤2: 转换表结构 -->
            <div v-if="currentStep === 1" class="step-content">
                <h3 class="step-title">转换表结构</h3>
                <div class="convert-info">
                    <el-alert
                        title="转换说明"
                        type="info"
                        :closable="false"
                        show-icon
                        class="convert-alert"
                    >
                        <p>将为数据表添加以下字段：</p>
                        <ul>
                            <li><code>file_path</code> - 文件存储路径</li>
                            <li><code>is_download</code> - 是否已下载</li>
                            <li><code>size</code> - 文件大小</li>
                        </ul>
                    </el-alert>

                    <div class="selected-plugin-info" v-if="selectedPlugin">
                        <el-descriptions
                            title="选中的插件信息"
                            :column="2"
                            border
                        >
                            <el-descriptions-item label="插件ID">{{
                                selectedPlugin.id
                            }}</el-descriptions-item>
                            <el-descriptions-item label="插件名称">{{
                                selectedPlugin.name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="表名">{{
                                selectedPlugin.saveName
                            }}</el-descriptions-item>
                            <el-descriptions-item label="当前状态">
                                <el-tag
                                    :type="
                                        selectedPlugin.is_file_download === 1
                                            ? 'success'
                                            : 'info'
                                    "
                                    size="small"
                                >
                                    {{
                                        selectedPlugin.is_file_download === 1
                                            ? "已转换"
                                            : "未转换"
                                    }}
                                </el-tag>
                            </el-descriptions-item>
                        </el-descriptions>
                    </div>
                </div>
            </div>

            <!-- 步骤3: 配置下载 -->
            <div v-if="currentStep === 2" class="step-content">
                <h3 class="step-title">配置下载字段</h3>

                <!-- 调试信息 -->
                <div
                    v-if="tableColumns.length === 0 && !loadingColumns"
                    class="debug-info"
                >
                    <el-alert
                        title="未能加载到表字段"
                        type="warning"
                        :closable="false"
                        show-icon
                    >
                        <p>表名: {{ selectedPlugin?.saveName }}</p>
                        <p>请检查表是否存在或联系管理员</p>
                    </el-alert>
                </div>

                <div class="config-form">
                    <el-form
                        :model="configForm"
                        :rules="configRules"
                        ref="configFormRef"
                        label-width="120px"
                    >
                        <el-form-item label="插件名称" prop="plugin_name">
                            <el-input
                                v-model="configForm.plugin_name"
                                placeholder="请输入插件名称"
                            />
                        </el-form-item>

                        <el-form-item label="文件名字段" prop="filename_field">
                            <el-select
                                v-model="configForm.filename_field"
                                placeholder="选择文件名字段"
                                class="full-width"
                                :loading="loadingColumns"
                                :disabled="tableColumns.length === 0"
                            >
                                <el-option
                                    v-for="column in tableColumns"
                                    :key="column"
                                    :label="column"
                                    :value="column"
                                />
                            </el-select>
                            <div
                                v-if="tableColumns.length > 0"
                                class="field-hint"
                            >
                                已加载 {{ tableColumns.length }} 个字段
                            </div>
                        </el-form-item>

                        <el-form-item
                            label="下载链接字段"
                            prop="download_url_field"
                        >
                            <el-select
                                v-model="configForm.download_url_field"
                                placeholder="选择下载链接字段"
                                class="full-width"
                                :loading="loadingColumns"
                                :disabled="tableColumns.length === 0"
                            >
                                <el-option
                                    v-for="column in tableColumns"
                                    :key="column"
                                    :label="column"
                                    :value="column"
                                />
                            </el-select>
                        </el-form-item>

                        <!-- 重新加载按钮 -->
                        <el-form-item v-if="tableColumns.length === 0">
                            <el-button
                                type="primary"
                                @click="loadTableColumns"
                                :loading="loadingColumns"
                                size="small"
                            >
                                重新加载字段
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button
                    v-if="currentStep > 0"
                    @click="handlePrevStep"
                    :disabled="processing"
                >
                    上一步
                </el-button>
                <el-button
                    v-if="currentStep < 2"
                    type="primary"
                    @click="handleNextStep"
                    :disabled="!canProceed || processing"
                    :loading="processing"
                >
                    {{ currentStep === 1 ? "转换表结构" : "下一步" }}
                </el-button>
                <el-button
                    v-if="currentStep === 2"
                    type="primary"
                    @click="handleFinish"
                    :disabled="!canFinish || processing"
                    :loading="processing"
                >
                    完成配置
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import {
    fetchPluginsList,
    convertTable,
    createDownloadConfig,
    getTableColumns,
} from "../api/files";

export default {
    name: "PluginConvertModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue", "success"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const currentStep = ref(0);
        const processing = ref(false);
        const loadingPlugins = ref(false);
        const loadingColumns = ref(false);

        const availablePlugins = ref([]);
        const selectedPlugin = ref(null);
        const tableColumns = ref([]);

        const configForm = ref({
            plugin_name: "",
            filename_field: "",
            download_url_field: "",
        });

        const configFormRef = ref(null);

        const configRules = {
            plugin_name: [
                { required: true, message: "请输入插件名称", trigger: "blur" },
            ],
            filename_field: [
                {
                    required: true,
                    message: "请选择文件名字段",
                    trigger: "change",
                },
            ],
            download_url_field: [
                {
                    required: true,
                    message: "请选择下载链接字段",
                    trigger: "change",
                },
            ],
        };

        // 加载可转换的插件列表
        const loadAvailablePlugins = async () => {
            loadingPlugins.value = true;
            try {
                const result = await fetchPluginsList();
                if (result.success) {
                    availablePlugins.value = result.data || [];
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("加载插件列表失败:", error);
                ElMessage.error("加载插件列表失败");
            } finally {
                loadingPlugins.value = false;
            }
        };

        // 加载表字段
        const loadTableColumns = async () => {
            if (!selectedPlugin.value) {
                console.warn("没有选中的插件");
                return;
            }

            // 检查表名是否存在 - 使用 saveName 字段
            const tableName = selectedPlugin.value.saveName;
            if (!tableName || tableName.trim() === "") {
                console.error("插件信息:", selectedPlugin.value);
                ElMessage.error(
                    "所选插件没有表名信息，请选择其他插件或联系管理员"
                );
                return;
            }

            loadingColumns.value = true;
            try {
                console.log("开始加载表字段，插件信息:", selectedPlugin.value);
                console.log("表名:", tableName);

                const columns = await getTableColumns(tableName);
                console.log("获取到的字段:", columns);

                if (Array.isArray(columns) && columns.length > 0) {
                    tableColumns.value = columns;
                    ElMessage.success(`成功加载 ${columns.length} 个字段`);
                } else {
                    tableColumns.value = [];
                    ElMessage.warning("表中没有找到字段，请检查表是否存在数据");
                }
            } catch (error) {
                console.error("加载表字段失败:", error);
                tableColumns.value = [];
                ElMessage.error(`加载表字段失败: ${error.message}`);
            } finally {
                loadingColumns.value = false;
            }
        };

        // 处理插件选择
        const handlePluginSelect = (plugin) => {
            selectedPlugin.value = plugin;
            if (plugin) {
                configForm.value.plugin_name = plugin.name;
            }
        };

        // 判断是否可以进行下一步
        const canProceed = computed(() => {
            if (currentStep.value === 0) {
                return selectedPlugin.value !== null;
            }
            return true;
        });

        // 判断是否可以完成
        const canFinish = computed(() => {
            return (
                configForm.value.plugin_name &&
                configForm.value.filename_field &&
                configForm.value.download_url_field
            );
        });

        // 下一步
        const handleNextStep = async () => {
            if (currentStep.value === 0) {
                currentStep.value = 1;
            } else if (currentStep.value === 1) {
                // 转换表结构
                await handleConvertTable();
            }
        };

        // 上一步
        const handlePrevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
            }
        };

        // 转换表结构
        const handleConvertTable = async () => {
            if (!selectedPlugin.value) return;

            processing.value = true;
            try {
                const result = await convertTable(selectedPlugin.value.id);
                if (result.success) {
                    ElMessage.success("表结构转换成功");
                    currentStep.value = 2;
                    // 加载表字段用于配置
                    await loadTableColumns();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("转换表结构失败:", error);
                ElMessage.error("转换表结构失败");
            } finally {
                processing.value = false;
            }
        };

        // 完成配置
        const handleFinish = async () => {
            if (!configFormRef.value) return;

            try {
                await configFormRef.value.validate();

                processing.value = true;
                const config = {
                    plugin_id: selectedPlugin.value.id,
                    plugin_name: configForm.value.plugin_name,
                    filename_field: configForm.value.filename_field,
                    download_url_field: configForm.value.download_url_field,
                };

                const result = await createDownloadConfig(config);
                if (result.success) {
                    ElMessage.success("下载配置创建成功");
                    emit("success");
                    handleClose();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("创建下载配置失败:", error);
            } finally {
                processing.value = false;
            }
        };

        // 关闭对话框
        const handleClose = () => {
            visible.value = false;
            // 重置状态
            currentStep.value = 0;
            selectedPlugin.value = null;
            configForm.value = {
                plugin_name: "",
                filename_field: "",
                download_url_field: "",
            };
            tableColumns.value = [];
        };

        // 监听对话框打开
        watch(visible, (newVal) => {
            if (newVal) {
                loadAvailablePlugins();
            }
        });

        return {
            visible,
            currentStep,
            processing,
            loadingPlugins,
            loadingColumns,
            availablePlugins,
            selectedPlugin,
            tableColumns,
            configForm,
            configFormRef,
            configRules,
            canProceed,
            canFinish,
            handlePluginSelect,
            handleNextStep,
            handlePrevStep,
            handleFinish,
            handleClose,
        };
    },
};
</script>

<style scoped>
.convert-modal {
    border-radius: 12px;
}

.modal-content {
    padding: 20px 0;
}

.steps {
    margin-bottom: 30px;
}

.step-content {
    min-height: 300px;
}

.step-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;
}

.plugin-selection {
    margin-top: 20px;
}

.plugin-table {
    border-radius: 8px;
    overflow: hidden;
}

.convert-info {
    margin-top: 20px;
}

.convert-alert {
    margin-bottom: 20px;
}

.convert-alert ul {
    margin: 10px 0 0 20px;
    padding: 0;
}

.convert-alert li {
    margin: 5px 0;
}

.convert-alert code {
    background: #f5f7fa;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
}

.selected-plugin-info {
    margin-top: 20px;
}

.config-form {
    margin-top: 20px;
}

.debug-info {
    margin-bottom: 20px;
}

.field-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
}

.full-width {
    width: 100%;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
