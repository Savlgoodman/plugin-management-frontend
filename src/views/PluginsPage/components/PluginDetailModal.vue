<template>
    <el-dialog
        v-model="visible"
        title="插件详情"
        width="50%"
        :destroy-on-close="true"
        center
        append-to-body
        class="plugin-detail-modal"
    >
        <div class="detail-container">
            <!-- 插件基本信息 -->
            <div class="plugin-info-section">
                <div class="section-header">
                    <el-icon class="section-icon"><InfoFilled /></el-icon>
                    <h3>基本信息</h3>
                </div>
                <el-card class="info-card" shadow="never">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="插件ID" :span="1">
                            <el-tag type="primary">{{
                                pluginDetail.id
                            }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="插件名称" :span="1">
                            <span class="plugin-name">{{
                                pluginDetail.name
                            }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="采集URL" :span="2">
                            <el-link
                                :href="pluginDetail.url"
                                target="_blank"
                                type="primary"
                            >
                                {{ pluginDetail.url }}
                            </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item label="输出格式">
                            <el-tag
                                :type="
                                    getFormatTagType(pluginDetail.output_format)
                                "
                            >
                                {{ pluginDetail.output_format }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="保存名称">
                            <code class="save-name">{{
                                pluginDetail.save_name
                            }}</code>
                        </el-descriptions-item>
                        <el-descriptions-item label="去重设置">
                            <el-tag
                                :type="
                                    pluginDetail.remove_duplicate
                                        ? 'success'
                                        : 'info'
                                "
                            >
                                <el-icon>
                                    <Check
                                        v-if="pluginDetail.remove_duplicate"
                                    />
                                    <Close v-else />
                                </el-icon>
                                {{
                                    pluginDetail.remove_duplicate
                                        ? "启用"
                                        : "禁用"
                                }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间">
                            <div class="time-info">
                                <el-icon><Clock /></el-icon>
                                {{ formatTime(pluginDetail.create_time) }}
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item label="更新时间">
                            <div class="time-info">
                                <el-icon><Clock /></el-icon>
                                {{ formatTime(pluginDetail.update_time) }}
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
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
                        </div>
                        <div class="logs-list">
                            <div
                                v-for="(log, index) in logList"
                                :key="index"
                                class="log-item"
                                :class="getLogLevel(log)"
                            >
                                <div class="log-index">{{ index + 1 }}</div>
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
                    @click="handleRefreshLogs"
                    :loading="logLoading"
                >
                    <el-icon><Refresh /></el-icon>
                    刷新日志
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { computed } from "vue";

export default {
    name: "PluginDetailModal",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        pluginDetail: {
            type: Object,
            default: () => ({}),
        },
        logList: {
            type: Array,
            default: () => [],
        },
        logLoading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue", "refresh-logs"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const handleClose = () => {
            visible.value = false;
        };

        const handleRefreshLogs = () => {
            emit("refresh-logs");
        };

        const getFormatTagType = (format) => {
            const typeMap = {
                json: "success",
                xml: "warning",
                csv: "info",
                txt: "primary",
            };
            return typeMap[format?.toLowerCase()] || "primary";
        };

        const formatTime = (timeStr) => {
            if (!timeStr) return "-";
            try {
                return new Date(timeStr).toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            } catch {
                return timeStr;
            }
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

        return {
            visible,
            handleClose,
            handleRefreshLogs,
            getFormatTagType,
            formatTime,
            getLogLevel,
        };
    },
};
</script>

<style scoped>
.plugin-detail-modal :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
}

.plugin-detail-modal :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    margin: 0;
}

.plugin-detail-modal :deep(.el-dialog__title) {
    color: white;
    font-size: 18px;
    font-weight: 600;
}

.plugin-detail-modal :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
    font-size: 18px;
}

.detail-container {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
}

.plugin-info-section {
    margin-bottom: 24px;
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

.header-actions {
    margin-left: auto;
}

.info-card {
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    overflow: hidden;
}

.info-card :deep(.el-descriptions__cell) {
    padding: 12px 16px;
}

.plugin-name {
    font-weight: 600;
    color: #303133;
    font-size: 14px;
}

.save-name {
    background: #f5f7fa;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 12px;
    color: #606266;
}

.time-info {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #606266;
    font-size: 13px;
}

.logs-section {
    margin-top: 24px;
}

.logs-card {
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    overflow: hidden;
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
    max-height: 240px;
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
    padding: 12px 16px;
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
    width: 32px;
    height: 20px;
    background: #e4e7ed;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #606266;
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 2px;
}

.log-content {
    flex: 1;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 12px;
    line-height: 1.5;
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
.detail-container::-webkit-scrollbar,
.logs-container::-webkit-scrollbar {
    width: 6px;
}

.detail-container::-webkit-scrollbar-track,
.logs-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb,
.logs-container::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
}

.detail-container::-webkit-scrollbar-thumb:hover,
.logs-container::-webkit-scrollbar-thumb:hover {
    background: #a8abb2;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .plugin-detail-modal :deep(.el-dialog) {
        width: 95% !important;
        margin: 5px;
    }

    .detail-container {
        padding: 16px;
        max-height: 70vh;
    }

    .info-card :deep(.el-descriptions) {
        --el-descriptions-item-bordered-label-background: #fafafa;
    }

    .logs-container {
        max-height: 200px;
    }
}
</style>
