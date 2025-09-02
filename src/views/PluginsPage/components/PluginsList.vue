<template>
    <el-card class="plugins-list-card">
        <!-- 插件详情模态框 -->
        <PluginDetailModal
            v-model="pluginDetailDialog"
            :plugin-detail="pluginDetail"
            :log-list="logList"
            :log-loading="logLoading"
            @refresh-logs="refreshDetailLogs"
        />

        <!-- 插件设置模态框 -->
        <PluginSettingModal
            v-model="settingDialog"
            :current-task="currentTask"
            :execution-id="executionId"
            :current-status="currentStatus"
            :log-list="logList"
            :status-loading="statusLoading"
            :log-loading="logLoading"
            @start-task="handleStartTask"
            @stop-task="handleStopTask"
            @refresh-status="refreshStatus"
            @refresh-logs="refreshSettingLogs"
        />

        <!-- 插件上传模态框 -->
        <PluginUploadModal
            v-model="uploadDialog"
            @success="handleUploadSuccess"
        />

        <!-- 插件参数编辑模态框 -->
        <PluginParameterModal
            v-model="parameterDialog"
            :plugin-info="currentEditPlugin"
            @save-success="handleParameterSaveSuccess"
            @name-updated="handlePluginNameUpdated"
        />

        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><List /></el-icon>
                    <span class="header-title">插件列表</span>
                </div>
                <div class="header-right">
                    <el-button
                        type="primary"
                        class="rounded-button"
                        @click="handleAddPlugin"
                    >
                        <el-icon><Plus /></el-icon>
                        添加插件
                    </el-button>
                </div>
            </div>
        </template>

        <!-- 搜索和筛选 -->
        <div class="search-section">
            <el-row :gutter="16">
                <el-col :span="16">
                    <el-input
                        v-model="searchText"
                        placeholder="搜索插件名称"
                        clearable
                        class="search-input"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-select
                        v-model="statusFilter"
                        placeholder="状态筛选"
                        clearable
                        class="status-select"
                    >
                        <el-option label="全部状态" value="" />
                        <el-option label="运行中" value="running" />
                        <el-option label="已停止" value="stopped" />
                        <el-option label="异常" value="error" />
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button @click="handleRefresh" class="rounded-button">
                        <el-icon><Refresh /></el-icon>
                        刷新
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 插件表格 -->
        <el-table
            :data="paginatedPlugins"
            stripe
            class="plugins-table"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column
                label="插件名称"
                prop="name"
                min-width="200"
                header-align="center"
            >
                <template #default="{ row }">
                    <div class="plugin-name-cell">
                        <el-avatar :size="32" class="plugin-avatar">
                            <el-icon><Grid /></el-icon>
                        </el-avatar>
                        <div class="plugin-info">
                            <div class="plugin-name">{{ row.name }}</div>
                            <div class="plugin-description">
                                {{ row.url }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="更新时间"
                prop="update_time"
                width="180"
                header-align="center"
            >
                <template #default="{ row }">
                    <div class="time-cell">
                        <el-icon class="time-icon"><Clock /></el-icon>
                        {{ row.update_time }}
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                width="180"
                fixed="right"
                header-align="center"
            >
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-tooltip content="查看详情" placement="top">
                            <el-button
                                size="small"
                                circle
                                @click="handleViewDetails(row)"
                                class="action-btn"
                            >
                                <el-icon><View /></el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip content="编辑参数" placement="top">
                            <el-button
                                size="small"
                                type="primary"
                                circle
                                @click="handleEditParameters(row)"
                                class="action-btn"
                            >
                                <el-icon><Edit /></el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip content="设置" placement="top">
                            <el-button
                                size="small"
                                type="warning"
                                circle
                                @click="handleSettings(row)"
                                class="action-btn"
                            >
                                <el-icon><Setting /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :total="totalPlugins"
                layout="total, sizes, prev, pager, next, jumper"
                background
                class="custom-pagination"
            />
        </div>
    </el-card>
</template>

<script>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import {
    fetchPluginsList,
    fetchPluginDetail,
    fetchPluginLogs,
    startPluginTask,
    fetchTaskStatus,
    stopPluginTask,
} from "../api/plugins.js";
import PluginDetailModal from "./PluginDetailModal.vue";
import PluginSettingModal from "./PluginSettingModal.vue";
import PluginUploadModal from "./PluginUploadModal.vue";
import PluginParameterModal from "./PluginParameterModal.vue";

export default {
    name: "PluginsList",
    components: {
        PluginDetailModal,
        PluginSettingModal,
        PluginUploadModal,
        PluginParameterModal,
    },
    setup() {
        const searchText = ref("");
        const statusFilter = ref("");
        const currentPage = ref(1);
        const pageSize = ref(10);
        const selectedPlugins = ref([]);
        const pluginsData = ref([]);

        // 存储所有插件数据
        const allPluginsData = ref([]);

        const totalPlugins = computed(() => filteredPlugins.value.length);

        // 初始化数据
        const loadData = async () => {
            try {
                const response = await fetchPluginsList();
                if (response.success) {
                    // 将数据按ID倒序排列（最新的在前面）
                    allPluginsData.value = response.data.sort(
                        (a, b) => b.id - a.id
                    );
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("获取插件数据失败");
                console.error("加载插件数据失败:", error);
            }
        };

        // 搜索和筛选后的数据
        const filteredPlugins = computed(() => {
            let filteredData = allPluginsData.value;
            if (searchText.value) {
                filteredData = filteredData.filter((plugin) =>
                    plugin.name
                        .toLowerCase()
                        .includes(searchText.value.toLowerCase())
                );
            }
            return filteredData;
        });

        // 监听搜索文本变化，重置到第一页
        watch(searchText, () => {
            currentPage.value = 1;
        });

        // 手动分页后的数据
        const paginatedPlugins = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value;
            const end = start + pageSize.value;
            return filteredPlugins.value.slice(start, end);
        });

        const getStatusType = (status) => {
            const statusMap = {
                running: "success",
                stopped: "info",
                error: "danger",
            };
            return statusMap[status] || "info";
        };

        const getStatusClass = (status) => {
            const statusMap = {
                running: "status-active",
                stopped: "status-pending",
                error: "status-inactive",
            };
            return statusMap[status] || "status-pending";
        };

        const getStatusText = (status) => {
            const statusMap = {
                running: "运行中",
                stopped: "已停止",
                error: "异常",
            };
            return statusMap[status] || "未知";
        };

        const handleSelectionChange = (selection) => {
            selectedPlugins.value = selection;
        };

        // 上传对话框状态
        const uploadDialog = ref(false);

        // 参数编辑对话框状态
        const parameterDialog = ref(false);
        const currentEditPlugin = ref({});

        const handleAddPlugin = () => {
            uploadDialog.value = true;
        };

        // 处理上传成功
        const handleUploadSuccess = async (data) => {
            ElMessage.success(`插件导入成功，ID: ${data.plugin_id}`);
            // 刷新插件列表，新上传的插件将显示在顶部
            await loadData();
        };

        const handleRefresh = async () => {
            await loadData();
            ElMessage.success("数据已刷新");
        };

        // 查看插件详情
        const pluginDetailDialog = ref(false);
        const pluginDetail = ref({});
        const logList = ref([]);
        const logLoading = ref(false);

        const handleViewDetails = async (row) => {
            try {
                // 获取插件详情
                const detailResponse = await fetchPluginDetail(row.id);

                if (detailResponse.success) {
                    pluginDetail.value = detailResponse.data;

                    // 获取日志信息
                    await refreshDetailLogs();
                } else {
                    ElMessage.error(detailResponse.message);
                }
            } catch (error) {
                ElMessage.error("获取插件详情失败");
                console.error("获取插件详情失败:", error);
            }

            pluginDetailDialog.value = true;
        };

        // 刷新日志（查看详情用）
        const refreshDetailLogs = async () => {
            if (pluginDetail.value.id && pluginDetail.value.save_name) {
                logLoading.value = true;
                try {
                    const logResponse = await fetchPluginLogs(
                        pluginDetail.value.id,
                        pluginDetail.value.save_name
                    );

                    if (logResponse.success) {
                        logList.value = logResponse.data;
                    } else {
                        ElMessage.error(logResponse.message);
                        logList.value = [];
                    }
                } catch (error) {
                    ElMessage.error("获取日志失败");
                    console.error("获取日志失败:", error);
                    logList.value = [];
                } finally {
                    logLoading.value = false;
                }
            }
        };

        // 编辑插件参数
        const handleEditParameters = (row) => {
            currentEditPlugin.value = row;
            parameterDialog.value = true;
        };

        // 处理参数保存成功
        const handleParameterSaveSuccess = (data) => {
            ElMessage.success("参数保存成功");
            // 可以在这里添加刷新插件列表等逻辑
        };

        // 处理插件名称更新
        const handlePluginNameUpdated = (data) => {
            // 构建成功消息
            let message = `插件名称已更新：${data.oldName} → ${data.newName}`;
            if (data.oldDocumentName !== data.newDocumentName) {
                message += `\n文档名称已更新：${data.oldDocumentName} → ${data.newDocumentName}`;
            }
            ElMessage.success(message);

            // 更新本地插件列表中的名称
            const pluginIndex = allPluginsData.value.findIndex(
                (p) => p.id === data.id
            );
            if (pluginIndex !== -1) {
                allPluginsData.value[pluginIndex].name = data.newName;
            }

            // 如果当前编辑的插件就是被更新的插件，也更新其名称
            if (currentEditPlugin.value.id === data.id) {
                currentEditPlugin.value.name = data.newName;
            }
        };

        // 设置相关变量
        const settingDialog = ref(false);
        const currentTask = ref({});
        const currentTaskDetail = ref({});
        const executionId = ref("");
        const currentStatus = ref("pending");
        const statusLoading = ref(false);

        // 刷新状态
        const refreshStatus = async () => {
            if (!executionId.value) return;

            statusLoading.value = true;
            try {
                const statusResponse = await fetchTaskStatus(executionId.value);

                if (statusResponse.success) {
                    currentStatus.value = statusResponse.data;
                } else {
                    ElMessage.error(statusResponse.message);
                }
            } catch (error) {
                ElMessage.error("获取状态失败");
                console.error("获取状态失败:", error);
            } finally {
                statusLoading.value = false;
            }
        };

        // 刷新日志（设置页面用）
        const refreshSettingLogs = async () => {
            if (currentTask.value.id && currentTaskDetail.value.save_name) {
                logLoading.value = true;
                try {
                    const logResponse = await fetchPluginLogs(
                        currentTask.value.id,
                        currentTaskDetail.value.save_name
                    );

                    if (logResponse.success) {
                        logList.value = logResponse.data;
                    } else {
                        ElMessage.error(logResponse.message);
                        logList.value = [];
                    }
                } catch (error) {
                    ElMessage.error("获取日志失败");
                    console.error("获取日志失败:", error);
                    logList.value = [];
                } finally {
                    logLoading.value = false;
                }
            } else {
                // 如果没有获取到save_name，尝试重新获取插件详情
                if (currentTask.value.id) {
                    const detailResponse = await fetchPluginDetail(
                        currentTask.value.id
                    );

                    if (detailResponse.success) {
                        currentTaskDetail.value = detailResponse.data;
                        await refreshSettingLogs();
                    }
                }
            }
        };

        // 启动任务
        const handleStartTask = async (task) => {
            try {
                const response = await startPluginTask(task.id);

                if (response.success) {
                    executionId.value = response.data.executionId;
                    currentStatus.value = response.data.status;
                    ElMessage.success(response.message);

                    // 如果任务正在运行，开始轮询状态
                    if (response.data.isRunning) {
                        await refreshStatus();
                    }
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("启动任务失败");
                console.error("启动任务失败:", error);
            }
        };

        // 停止任务
        const handleStopTask = async () => {
            if (!executionId.value) {
                ElMessage.warning("没有正在运行的任务");
                return;
            }

            try {
                const response = await stopPluginTask(executionId.value);

                if (response.success) {
                    currentStatus.value = "stopped";
                    ElMessage.success(response.message);
                    // 刷新状态以确保获取最新状态
                    await refreshStatus();
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("停止任务失败");
                console.error("停止任务失败:", error);
            }
        };

        // 处理设置按钮点击
        const handleSettings = async (row) => {
            currentTask.value = row;
            try {
                // 获取插件详情以获取save_name字段
                const detailResponse = await fetchPluginDetail(row.id);

                if (detailResponse.success) {
                    currentTaskDetail.value = detailResponse.data;
                    // 获取日志信息
                    await refreshSettingLogs();
                } else {
                    ElMessage.error(detailResponse.message);
                }
            } catch (error) {
                ElMessage.error("获取插件详情失败");
                console.error("获取插件详情失败:", error);
            }

            // 尝试获取上次的运行ID（如果有）
            // 这里可以添加获取上次运行记录的逻辑
            executionId.value = "";
            currentStatus.value = "pending";
            settingDialog.value = true;
        };

        // 获取设置页面状态类型
        const getSettingStatusType = (status) => {
            const statusMap = {
                pending: "info",
                running: "success",
                finished: "warning",
                stopped: "info",
                error: "danger",
            };
            return statusMap[status] || "info";
        };

        // 获取设置页面状态文本
        const getSettingStatusText = (status) => {
            const statusMap = {
                pending: "等待中",
                running: "运行中",
                finished: "已完成",
                stopped: "已停止",
                error: "错误",
            };
            return statusMap[status] || "未知";
        };

        // 页面初始化时加载数据
        loadData();

        return {
            searchText,
            statusFilter,
            currentPage,
            pageSize,
            selectedPlugins,
            allPluginsData,
            totalPlugins,
            filteredPlugins,
            paginatedPlugins,
            getStatusType,
            getStatusClass,
            getStatusText,
            handleSelectionChange,
            handleAddPlugin,
            handleRefresh,
            handleViewDetails,
            handleEditParameters,
            handleSettings,
            // 对话框相关
            pluginDetailDialog,
            pluginDetail,
            logList,
            logLoading,
            // 设置相关
            settingDialog,
            currentTask,
            executionId,
            currentStatus,
            statusLoading,
            // 上传相关
            uploadDialog,
            handleUploadSuccess,
            // 参数编辑相关
            parameterDialog,
            currentEditPlugin,
            handleParameterSaveSuccess,
            handlePluginNameUpdated,
            // 函数相关
            refreshDetailLogs,
            refreshStatus,
            handleStartTask,
            handleStopTask,
            getSettingStatusType,
            getSettingStatusText,
            refreshSettingLogs,
        };
    },
};
</script>

<style scoped>
.plugins-list-card {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    /* 确保不影响模态框的层级 */
    position: relative;
    z-index: 1;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    color: #409eff;
    font-size: 18px;
}

.header-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

.search-section {
    margin-bottom: 20px;
}

.search-input,
.status-select {
    border-radius: 20px;
}

.plugins-table {
    border-radius: 12px;
    overflow: hidden;
}

.plugin-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.plugin-avatar {
    background: linear-gradient(135deg, #409eff, #67c23a);
    color: white;
}

.plugin-info {
    flex: 1;
}

.plugin-name {
    font-weight: 600;
    color: #303133;
    margin-bottom: 2px;
}

.plugin-description {
    font-size: 12px;
    color: #909399;
}

.status-tag {
    display: flex;
    align-items: center;
    gap: 6px;
}

.time-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #606266;
}

.time-icon {
    color: #909399;
    font-size: 14px;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.action-btn {
    border-radius: 50%;
    transition: all 0.3s ease;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.custom-pagination {
    border-radius: 20px;
}

@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .search-section .el-row {
        flex-direction: column;
        gap: 12px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }
}
</style>
