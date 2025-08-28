<template>
    <el-dialog
        v-model="visible"
        title="插件设置"
        width="45%"
        :destroy-on-close="true"
        center
        append-to-body
        class="plugin-setting-modal"
    >
        <div class="setting-container">
            <!-- 任务信息 -->
            <div class="task-info-section">
                <div class="section-header">
                    <el-icon class="section-icon"><Setting /></el-icon>
                    <h3>任务信息</h3>
                    <div class="header-status">
                        <div
                            class="status-indicator"
                            :class="getStatusClass(currentStatus)"
                        >
                            <div class="status-dot"></div>
                            <span>{{ getStatusText(currentStatus) }}</span>
                        </div>
                    </div>
                </div>
                <el-card class="info-card" shadow="never">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="任务ID">
                            <el-tag type="primary">{{ currentTask.id }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="任务名称">
                            <span class="task-name">{{
                                currentTask.name
                            }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="运行状态">
                            <el-tag
                                :type="getStatusTagType(currentStatus)"
                                effect="dark"
                                size="large"
                            >
                                <el-icon class="status-icon">
                                    <Loading
                                        v-if="currentStatus === 'running'"
                                    />
                                    <Check
                                        v-else-if="currentStatus === 'finished'"
                                    />
                                    <Warning
                                        v-else-if="currentStatus === 'error'"
                                    />
                                    <Clock v-else />
                                </el-icon>
                                {{ getStatusText(currentStatus) }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="运行ID">
                            <code v-if="executionId" class="execution-id">{{
                                executionId
                            }}</code>
                            <span v-else class="no-execution">-</span>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-card>
            </div>

            <!-- 操作控制区域 -->
            <div class="control-section">
                <div class="section-header">
                    <el-icon class="section-icon"><Operation /></el-icon>
                    <h3>操作控制</h3>
                </div>
                <el-card class="control-card" shadow="never">
                    <div class="control-buttons">
                        <el-button
                            type="success"
                            size="large"
                            @click="handleStartTask"
                            :disabled="currentStatus === 'running'"
                            :loading="operationLoading"
                            class="control-btn start-btn"
                        >
                            <el-icon><VideoPlay /></el-icon>
                            启动任务
                        </el-button>
                        <el-button
                            type="danger"
                            size="large"
                            @click="handleStopTask"
                            :disabled="currentStatus !== 'running'"
                            :loading="operationLoading"
                            class="control-btn stop-btn"
                        >
                            <el-icon><VideoPause /></el-icon>
                            停止任务
                        </el-button>
                        <el-button
                            type="warning"
                            size="large"
                            @click="handleRefreshStatus"
                            :loading="statusLoading"
                            class="control-btn refresh-btn"
                        >
                            <el-icon><Refresh /></el-icon>
                            刷新状态
                        </el-button>
                    </div>
                </el-card>
            </div>

            <!-- 运行日志区域 -->
            <div class="logs-section">
                <div class="section-header">
                    <el-icon class="section-icon"><Document /></el-icon>
                    <h3>运行日志</h3>
                    <div class="header-actions">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleRefreshLogs"
                            :loading="logLoading"
                            circle
                        >
                            <el-icon><Refresh /></el-icon>
                        </el-button>
                    </div>
                </div>
                <el-card class="logs-card" shadow="never">
                    <div v-if="logLoading" class="loading-container">
                        <el-skeleton :rows="5" animated />
                    </div>
                    <div v-else-if="logList.length === 0" class="no-logs">
                        <el-empty description="暂无日志信息" :image-size="80">
                            <template #image>
                                <el-icon class="empty-icon"
                                    ><Document
                                /></el-icon>
                            </template>
                        </el-empty>
                    </div>
                    <div v-else class="logs-container">
                        <div class="logs-header-info">
                            <span class="log-count"
                                >共 {{ logList.length }} 条日志</span
                            >
                            <el-button size="small" text @click="clearLogs">
                                <el-icon><Delete /></el-icon>
                                清空日志
                            </el-button>
                        </div>
                        <div class="logs-list">
                            <div
                                v-for="(log, index) in logList"
                                :key="index"
                                class="log-item"
                                :class="getLogLevel(log)"
                            >
                                <div class="log-index">{{ index + 1 }}</div>
                                <div class="log-timestamp">
                                    {{ formatLogTime() }}
                                </div>
                                <div class="log-content">{{ log }}</div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
                <el-button
                    type="primary"
                    @click="handleRefreshAll"
                    :loading="statusLoading || logLoading"
                >
                    <el-icon><Refresh /></el-icon>
                    刷新全部
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { computed, ref } from "vue";

export default {
    name: "PluginSettingModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        currentTask: {
            type: Object,
            default: () => ({}),
        },
        executionId: {
            type: String,
            default: "",
        },
        currentStatus: {
            type: String,
            default: "pending",
        },
        logList: {
            type: Array,
            default: () => [],
        },
        statusLoading: {
            type: Boolean,
            default: false,
        },
        logLoading: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        "update:modelValue",
        "start-task",
        "stop-task",
        "refresh-status",
        "refresh-logs",
    ],
    setup(props, { emit }) {
        const operationLoading = ref(false);

        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const handleClose = () => {
            visible.value = false;
        };

        const handleStartTask = async () => {
            operationLoading.value = true;
            try {
                await emit("start-task", props.currentTask);
            } finally {
                operationLoading.value = false;
            }
        };

        const handleStopTask = async () => {
            operationLoading.value = true;
            try {
                await emit("stop-task");
            } finally {
                operationLoading.value = false;
            }
        };

        const handleRefreshStatus = () => {
            emit("refresh-status");
        };

        const handleRefreshLogs = () => {
            emit("refresh-logs");
        };

        const handleRefreshAll = () => {
            emit("refresh-status");
            emit("refresh-logs");
        };

        const clearLogs = () => {
            // 这里可以添加清空日志的逻辑
            console.log("清空日志");
        };

        const getStatusClass = (status) => {
            const statusMap = {
                pending: "status-pending",
                running: "status-running",
                finished: "status-finished",
                stopped: "status-stopped",
                error: "status-error",
            };
            return statusMap[status] || "status-pending";
        };

        const getStatusTagType = (status) => {
            const statusMap = {
                pending: "info",
                running: "success",
                finished: "warning",
                stopped: "info",
                error: "danger",
            };
            return statusMap[status] || "info";
        };

        const getStatusText = (status) => {
            const statusMap = {
                pending: "等待中",
                running: "运行中",
                finished: "已完成",
                stopped: "已停止",
                error: "错误",
            };
            return statusMap[status] || "未知";
        };

        const getLogLevel = (log) => {
            const logStr = log.toLowerCase();
            if (logStr.includes("error") || logStr.includes("错误"))
                return "log-error";
            if (logStr.includes("warn") || logStr.includes("警告"))
                return "log-warning";
            if (logStr.includes("info") || logStr.includes("信息"))
                return "log-info";
            return "log-default";
        };

        const formatLogTime = () => {
            return new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        };

        return {
            visible,
            operationLoading,
            handleClose,
            handleStartTask,
            handleStopTask,
            handleRefreshStatus,
            handleRefreshLogs,
            handleRefreshAll,
            clearLogs,
            getStatusClass,
            getStatusTagType,
            getStatusText,
            getLogLevel,
            formatLogTime,
        };
    },
};
</script>

<style scoped>
.plugin-setting-modal :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
}

.plugin-setting-modal :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    color: #333;
    padding: 20px 24px;
    margin: 0;
}

.plugin-setting-modal :deep(.el-dialog__title) {
    color: #333;
    font-size: 18px;
    font-weight: 600;
}

.plugin-setting-modal :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #333;
    font-size: 18px;
}

.setting-container {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
}

.task-info-section,
.control-section,
.logs-section {
    margin-bottom: 24px;
}

.logs-section {
    margin-bottom: 0;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    position: relative;
}

.section-icon {
    color: #409eff;
    font-size: 20px;
}

.section-header h3 {
    margin: 0;
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    flex: 1;
}

.header-status {
    display: flex;
    align-items: center;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    min-width: 80px;
    justify-content: center;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-pending {
    background: #e6f7ff;
    color: #1890ff;
}

.status-pending .status-dot {
    background: #1890ff;
}

.status-running {
    background: #f6ffed;
    color: #52c41a;
}

.status-running .status-dot {
    background: #52c41a;
    animation: pulse 2s infinite;
}

.status-finished {
    background: #fff7e6;
    color: #fa8c16;
}

.status-finished .status-dot {
    background: #fa8c16;
}

.status-stopped {
    background: #f6f6f6;
    color: #666666;
}

.status-stopped .status-dot {
    background: #666666;
}

.status-error {
    background: #fff2f0;
    color: #ff4d4f;
}

.status-error .status-dot {
    background: #ff4d4f;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}

.info-card,
.control-card,
.logs-card {
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    overflow: hidden;
}

.info-card :deep(.el-descriptions__cell) {
    padding: 12px 16px;
}

.task-name {
    font-weight: 600;
    color: #303133;
    font-size: 14px;
}

.execution-id {
    background: #f5f7fa;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 12px;
    color: #606266;
}

.no-execution {
    color: #c0c4cc;
    font-style: italic;
}

.status-icon {
    margin-right: 4px;
}

.control-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    padding: 20px;
}

.control-btn {
    min-width: 120px;
    height: 48px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(103, 194, 58, 0.3);
}

.stop-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 108, 108, 0.3);
}

.refresh-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(230, 162, 60, 0.3);
}

.header-actions {
    margin-left: auto;
}

.loading-container {
    padding: 20px;
}

.no-logs {
    padding: 40px 20px;
    text-align: center;
}

.empty-icon {
    font-size: 64px;
    color: #c0c4cc;
}

.logs-container {
    max-height: 200px;
    overflow-y: auto;
}

.logs-header-info {
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.log-count {
    font-size: 12px;
    color: #909399;
}

.logs-list {
    padding: 0;
}

.log-item {
    display: flex;
    align-items: flex-start;
    padding: 8px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
}

.log-item:hover {
    background: #f8f9fa;
}

.log-item:last-child {
    border-bottom: none;
}

.log-index {
    width: 28px;
    height: 18px;
    background: #e4e7ed;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #606266;
    margin-right: 8px;
    flex-shrink: 0;
    margin-top: 1px;
}

.log-timestamp {
    width: 60px;
    font-size: 10px;
    color: #909399;
    margin-right: 8px;
    flex-shrink: 0;
    margin-top: 1px;
}

.log-content {
    flex: 1;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 11px;
    line-height: 1.4;
    color: #303133;
    word-break: break-all;
}

.log-error .log-index {
    background: #f56c6c;
    color: white;
}

.log-error .log-content {
    color: #f56c6c;
}

.log-warning .log-index {
    background: #e6a23c;
    color: white;
}

.log-warning .log-content {
    color: #e6a23c;
}

.log-info .log-index {
    background: #409eff;
    color: white;
}

.log-info .log-content {
    color: #409eff;
}

.dialog-footer {
    padding: 16px 24px;
    background: #f8f9fa;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

/* 滚动条样式 */
.setting-container::-webkit-scrollbar,
.logs-container::-webkit-scrollbar {
    width: 6px;
}

.setting-container::-webkit-scrollbar-track,
.logs-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.setting-container::-webkit-scrollbar-thumb,
.logs-container::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
}

.setting-container::-webkit-scrollbar-thumb:hover,
.logs-container::-webkit-scrollbar-thumb:hover {
    background: #a8abb2;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .plugin-setting-modal :deep(.el-dialog) {
        width: 95% !important;
        margin: 5px;
    }

    .setting-container {
        padding: 16px;
        max-height: 70vh;
    }

    .control-buttons {
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .control-btn {
        width: 100%;
        max-width: 200px;
    }

    .section-header {
        flex-wrap: wrap;
        gap: 8px;
    }

    .header-status {
        width: 100%;
        justify-content: flex-start;
        margin-top: 8px;
    }

    .logs-container {
        max-height: 160px;
    }
}
</style>
