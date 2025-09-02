<template>
    <el-dialog
        v-model="visible"
        title="下载任务管理"
        width="900px"
        :before-close="handleClose"
        class="task-modal"
    >
        <div class="modal-content">
            <!-- 任务列表 -->
            <div class="task-list-section">
                <div class="section-header">
                    <h3 class="section-title">
                        <el-icon><Download /></el-icon>
                        下载任务列表
                    </h3>
                    <el-button
                        @click="refreshTasks"
                        :loading="refreshing"
                        class="refresh-btn"
                    >
                        <el-icon><Refresh /></el-icon>
                        刷新
                    </el-button>
                </div>

                <el-table
                    :data="downloadablePlugins"
                    v-loading="loading"
                    class="task-table"
                    @current-change="handlePluginSelect"
                    highlight-current-row
                >
                    <el-table-column
                        label="插件ID"
                        prop="plugin_id"
                        width="80"
                    />
                    <el-table-column
                        label="插件名称"
                        prop="plugin_name"
                        min-width="150"
                    />
                    <el-table-column
                        label="文件数量"
                        width="100"
                        align="center"
                    >
                        <template #default="{ row }">
                            <span class="record-count">{{
                                row.record_count || 0
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="下载状态"
                        width="120"
                        align="center"
                    >
                        <template #default="{ row }">
                            <el-tag
                                :type="getStatusType(row.is_downloading)"
                                size="small"
                            >
                                {{ getStatusText(row.is_downloading) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="配置状态"
                        width="120"
                        align="center"
                    >
                        <template #default="{ row }">
                            <el-tag
                                :type="
                                    row.has_download_config
                                        ? 'success'
                                        : 'warning'
                                "
                                size="small"
                            >
                                {{
                                    row.has_download_config
                                        ? "已配置"
                                        : "未配置"
                                }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <template #default="{ row }">
                            <el-button-group>
                                <el-button
                                    v-if="
                                        row.has_download_config &&
                                        row.is_downloading !== 1
                                    "
                                    type="primary"
                                    size="small"
                                    @click="handleStartDownload(row)"
                                    :loading="
                                        operatingPlugins.has(row.plugin_id)
                                    "
                                >
                                    <el-icon><VideoPlay /></el-icon>
                                    启动
                                </el-button>
                                <el-button
                                    v-if="row.is_downloading === 1"
                                    type="danger"
                                    size="small"
                                    @click="handleStopDownload(row)"
                                    :loading="
                                        operatingPlugins.has(row.plugin_id)
                                    "
                                >
                                    <el-icon><VideoPause /></el-icon>
                                    停止
                                </el-button>
                                <el-button
                                    size="small"
                                    @click="handleViewDetails(row)"
                                >
                                    <el-icon><View /></el-icon>
                                    详情
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 任务详情 -->
            <div v-if="selectedTaskPlugin" class="task-details-section">
                <div class="section-header">
                    <h3 class="section-title">
                        <el-icon><InfoFilled /></el-icon>
                        {{ selectedTaskPlugin.plugin_name }} - 任务详情
                    </h3>
                </div>

                <el-tabs v-model="activeTab" class="task-tabs">
                    <!-- 状态监控 -->
                    <el-tab-pane label="状态监控" name="status">
                        <div class="status-content">
                            <el-row :gutter="16">
                                <el-col :span="8">
                                    <el-card class="status-card">
                                        <div class="status-item">
                                            <div class="status-label">
                                                运行状态
                                            </div>
                                            <div class="status-value">
                                                <el-tag
                                                    :type="
                                                        getStatusType(
                                                            taskStatus.status
                                                        )
                                                    "
                                                    size="large"
                                                >
                                                    {{
                                                        taskStatus.status ||
                                                        "unknown"
                                                    }}
                                                </el-tag>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card class="status-card">
                                        <div class="status-item">
                                            <div class="status-label">
                                                线程状态
                                            </div>
                                            <div class="status-value">
                                                <el-tag
                                                    :type="
                                                        taskStatus.thread_alive
                                                            ? 'success'
                                                            : 'danger'
                                                    "
                                                    size="large"
                                                >
                                                    {{
                                                        taskStatus.thread_alive
                                                            ? "活跃"
                                                            : "停止"
                                                    }}
                                                </el-tag>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card class="status-card">
                                        <div class="status-item">
                                            <div class="status-label">
                                                线程名称
                                            </div>
                                            <div
                                                class="status-value thread-name"
                                            >
                                                {{
                                                    taskStatus.thread_name ||
                                                    "-"
                                                }}
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>

                    <!-- 下载进度 -->
                    <el-tab-pane label="下载进度" name="progress">
                        <div class="progress-content">
                            <el-card class="progress-card">
                                <div class="progress-header">
                                    <h4>下载进度概览</h4>
                                    <el-tag type="primary"
                                        >{{
                                            taskProgress.progress_percent || 0
                                        }}%</el-tag
                                    >
                                </div>
                                <el-progress
                                    :percentage="
                                        taskProgress.progress_percent || 0
                                    "
                                    :stroke-width="12"
                                    class="main-progress"
                                />
                                <div class="progress-stats">
                                    <el-row :gutter="16">
                                        <el-col :span="6">
                                            <div class="stat-item">
                                                <div class="stat-value">
                                                    {{
                                                        taskProgress.total_files ||
                                                        0
                                                    }}
                                                </div>
                                                <div class="stat-label">
                                                    总文件数
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="stat-item">
                                                <div class="stat-value success">
                                                    {{
                                                        taskProgress.downloaded_files ||
                                                        0
                                                    }}
                                                </div>
                                                <div class="stat-label">
                                                    已下载
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="stat-item">
                                                <div class="stat-value warning">
                                                    {{
                                                        taskProgress.pending_files ||
                                                        0
                                                    }}
                                                </div>
                                                <div class="stat-label">
                                                    待下载
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div class="stat-item">
                                                <div class="stat-value danger">
                                                    {{
                                                        taskProgress.failed_files ||
                                                        0
                                                    }}
                                                </div>
                                                <div class="stat-label">
                                                    下载失败
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="size-info">
                                    <span
                                        >已下载大小:
                                        {{
                                            formatFileSize(
                                                taskProgress.total_downloaded_size
                                            )
                                        }}</span
                                    >
                                </div>
                            </el-card>
                        </div>
                    </el-tab-pane>

                    <!-- 下载日志 -->
                    <el-tab-pane label="下载日志" name="logs">
                        <div class="logs-content">
                            <div class="logs-header">
                                <el-button
                                    @click="refreshLogs"
                                    :loading="loadingLogs"
                                    size="small"
                                >
                                    <el-icon><Refresh /></el-icon>
                                    刷新日志
                                </el-button>
                                <el-select
                                    v-model="logLines"
                                    @change="refreshLogs"
                                    size="small"
                                    style="width: 120px"
                                >
                                    <el-option label="100行" :value="100" />
                                    <el-option label="200行" :value="200" />
                                    <el-option label="500行" :value="500" />
                                    <el-option label="1000行" :value="1000" />
                                </el-select>
                            </div>
                            <div class="logs-container">
                                <pre class="logs-text">{{ logsText }}</pre>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    getDownloadablePlugins,
    startDownload,
    stopDownload,
    getDownloadStatus,
    // getDownloadProgress, // 暂时禁用，功能需重新设计
    getDownloadLogs,
} from "../api/files";

export default {
    name: "DownloadTaskModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const loading = ref(false);
        const refreshing = ref(false);
        const loadingLogs = ref(false);
        const operatingPlugins = ref(new Set());

        const downloadablePlugins = ref([]);
        const selectedTaskPlugin = ref(null);
        const activeTab = ref("status");
        const logLines = ref(100);

        const taskStatus = ref({});
        const taskProgress = ref({});
        const logsText = ref("");

        // 加载可下载插件列表
        const loadDownloadablePlugins = async () => {
            loading.value = true;
            try {
                const result = await getDownloadablePlugins();
                if (result.success) {
                    downloadablePlugins.value = result.data.plugins || [];
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("加载插件列表失败:", error);
                ElMessage.error("加载插件列表失败");
            } finally {
                loading.value = false;
            }
        };

        // 刷新任务列表
        const refreshTasks = async () => {
            refreshing.value = true;
            await loadDownloadablePlugins();
            if (selectedTaskPlugin.value) {
                await loadTaskDetails(selectedTaskPlugin.value.plugin_id);
            }
            refreshing.value = false;
        };

        // 选择插件查看详情
        const handlePluginSelect = (plugin) => {
            selectedTaskPlugin.value = plugin;
            if (plugin) {
                loadTaskDetails(plugin.plugin_id);
            }
        };

        // 查看详情
        const handleViewDetails = (plugin) => {
            handlePluginSelect(plugin);
        };

        // 加载任务详情
        const loadTaskDetails = async (pluginId) => {
            try {
                // 暂时只加载状态和日志，进度功能需重新设计
                const [statusResult, logsResult] = await Promise.all([
                        getDownloadStatus(pluginId),
                        getDownloadLogs(pluginId, logLines.value),
                    ]);

                if (statusResult.success) {
                    taskStatus.value = statusResult.data;
                }
                // 暂时禁用进度功能
                // if (progressResult.success) {
                //     taskProgress.value = progressResult.data;
                // }
                if (logsResult.success) {
                    logsText.value = (logsResult.data.logs || []).join("\n");
                }
            } catch (error) {
                console.error("加载任务详情失败:", error);
            }
        };

        // 启动下载任务
        const handleStartDownload = async (plugin) => {
            try {
                await ElMessageBox.confirm(
                    `确定要启动插件"${plugin.plugin_name}"的下载任务吗？`,
                    "启动下载任务",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }
                );

                operatingPlugins.value.add(plugin.plugin_id);
                const result = await startDownload(plugin.plugin_id);

                if (result.success) {
                    ElMessage.success("下载任务启动成功");
                    await refreshTasks();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    console.error("启动下载任务失败:", error);
                    ElMessage.error("启动下载任务失败");
                }
            } finally {
                operatingPlugins.value.delete(plugin.plugin_id);
            }
        };

        // 停止下载任务
        const handleStopDownload = async (plugin) => {
            try {
                await ElMessageBox.confirm(
                    `确定要停止插件"${plugin.plugin_name}"的下载任务吗？`,
                    "停止下载任务",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                operatingPlugins.value.add(plugin.plugin_id);
                const result = await stopDownload(plugin.plugin_id);

                if (result.success) {
                    ElMessage.success("下载任务停止成功");
                    await refreshTasks();
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    console.error("停止下载任务失败:", error);
                    ElMessage.error("停止下载任务失败");
                }
            } finally {
                operatingPlugins.value.delete(plugin.plugin_id);
            }
        };

        // 刷新日志
        const refreshLogs = async () => {
            if (!selectedTaskPlugin.value) return;

            loadingLogs.value = true;
            try {
                const result = await getDownloadLogs(
                    selectedTaskPlugin.value.plugin_id,
                    logLines.value
                );
                if (result.success) {
                    logsText.value = (result.data.logs || []).join("\n");
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("刷新日志失败:", error);
                ElMessage.error("刷新日志失败");
            } finally {
                loadingLogs.value = false;
            }
        };

        // 获取状态类型
        const getStatusType = (isDownloading) => {
            return isDownloading === 1 ? "primary" : "info";
        };

        // 获取状态文本
        const getStatusText = (isDownloading) => {
            return isDownloading === 1 ? "下载中" : "已停止";
        };

        // 格式化文件大小
        const formatFileSize = (bytes) => {
            if (!bytes) return "0 B";
            if (bytes < 1024) return bytes + " B";
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
            if (bytes < 1024 * 1024 * 1024)
                return (bytes / (1024 * 1024)).toFixed(1) + " MB";
            return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
        };

        // 关闭对话框
        const handleClose = () => {
            visible.value = false;
            selectedTaskPlugin.value = null;
            activeTab.value = "status";
        };

        // 监听对话框打开
        watch(visible, (newVal) => {
            if (newVal) {
                loadDownloadablePlugins();
            }
        });

        // 自动刷新任务状态
        let refreshInterval = null;
        watch(visible, (newVal) => {
            if (newVal) {
                refreshInterval = setInterval(() => {
                    if (selectedTaskPlugin.value) {
                        loadTaskDetails(selectedTaskPlugin.value.plugin_id);
                    }
                }, 5000); // 每5秒刷新一次
            } else {
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
            }
        });

        return {
            visible,
            loading,
            refreshing,
            loadingLogs,
            operatingPlugins,
            downloadablePlugins,
            selectedTaskPlugin,
            activeTab,
            logLines,
            taskStatus,
            taskProgress,
            logsText,
            refreshTasks,
            handlePluginSelect,
            handleViewDetails,
            handleStartDownload,
            handleStopDownload,
            refreshLogs,
            getStatusType,
            getStatusText,
            formatFileSize,
            handleClose,
        };
    },
};
</script>

<style scoped>
.task-modal {
    border-radius: 12px;
}

.modal-content {
    padding: 20px 0;
}

.task-list-section {
    margin-bottom: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
    gap: 8px;
}

.refresh-btn {
    border-radius: 6px;
}

.task-table {
    border-radius: 8px;
    overflow: hidden;
}

.record-count {
    font-weight: 600;
    color: #409eff;
}

.task-details-section {
    border-top: 1px solid #e4e7ed;
    padding-top: 20px;
}

.task-tabs {
    margin-top: 16px;
}

.status-content {
    padding: 16px 0;
}

.status-card {
    text-align: center;
    border-radius: 8px;
}

.status-item {
    padding: 16px;
}

.status-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
}

.status-value {
    font-size: 16px;
    font-weight: 600;
}

.thread-name {
    font-family: "Courier New", monospace;
    color: #606266;
}

.progress-content {
    padding: 16px 0;
}

.progress-card {
    border-radius: 8px;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.main-progress {
    margin-bottom: 20px;
}

.progress-stats {
    margin-bottom: 16px;
}

.stat-item {
    text-align: center;
    padding: 12px;
    background: #fafafa;
    border-radius: 8px;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
}

.stat-value.success {
    color: #67c23a;
}

.stat-value.warning {
    color: #e6a23c;
}

.stat-value.danger {
    color: #f56c6c;
}

.stat-label {
    font-size: 12px;
    color: #909399;
}

.size-info {
    text-align: center;
    color: #606266;
    font-size: 14px;
}

.logs-content {
    padding: 16px 0;
}

.logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.logs-container {
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
}

.logs-text {
    font-family: "Courier New", monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #303133;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
