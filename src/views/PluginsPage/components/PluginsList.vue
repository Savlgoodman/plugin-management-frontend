<template>
    <el-card class="plugins-list-card">


        <!-- 查看详情对话框 -->
        <el-dialog
            v-model="pluginDetailDialog"
            title="插件详情"
            width="60%"
            :destroy-on-close="true"
            center
            append-to-body
        >
            <div class="detail-content">
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="ID">{{ pluginDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="名称">{{ pluginDetail.name }}</el-descriptions-item>
                    <el-descriptions-item label="URL">{{ pluginDetail.url }}</el-descriptions-item>
                    <el-descriptions-item label="更新时间">{{ pluginDetail.update_time }}</el-descriptions-item>
                    <el-descriptions-item label="输出格式">{{ pluginDetail.output_format }}</el-descriptions-item>
                    <el-descriptions-item label="保存名称">{{ pluginDetail.save_name }}</el-descriptions-item>
                    <el-descriptions-item label="去重">{{ pluginDetail.remove_duplicate ? '是' : '否' }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ pluginDetail.create_time }}</el-descriptions-item>
                </el-descriptions>

                <div class="logs-section">
                    <div class="logs-header">
                        <h4>运行日志</h4>
                        <el-button
                            size="small"
                            type="primary"
                            @click="refreshDetailLogs"
                            :loading="logLoading"
                        >
                            <el-icon><Refresh /></el-icon>
                            刷新
                        </el-button>
                    </div>
                    <el-card class="logs-card">
                        <div v-if="logList.length === 0" class="no-logs">
                            暂无日志信息
                        </div>
                        <div v-else class="logs-list">
                            <div
                                v-for="(log, index) in logList"
                                :key="index"
                                class="log-item"
                            >
                                {{ log }}
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </el-dialog>

        <!-- 设置对话框 -->
        <el-dialog
            v-model="settingDialog"
            title="插件设置"
            width="50%"
            :destroy-on-close="true"
            center
            append-to-body
        >
            <div class="setting-content">
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="任务ID">{{ currentTask.id }}</el-descriptions-item>
                    <el-descriptions-item label="任务名称">{{ currentTask.name }}</el-descriptions-item>
                    <el-descriptions-item label="运行状态">
                        <el-tag
                            :type="getSettingStatusType(currentStatus)"
                            effect="dark"
                        >
                            {{ getSettingStatusText(currentStatus) }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="运行ID">{{ executionId }}</el-descriptions-item>
                </el-descriptions>

                <div class="status-actions">
                    <el-button
                        type="success"
                        @click="startTask(currentTask)"
                        :disabled="currentStatus === 'running'"
                    >
                        启动任务
                    </el-button>
                    <el-button
                        type="danger"
                        @click="stopTask"
                        :disabled="currentStatus !== 'running'"
                    >
                        停止任务
                    </el-button>
                    <el-button
                        type="warning"
                        @click="refreshStatus"
                        :loading="statusLoading"
                    >
                        <el-icon><Refresh /></el-icon>
                        刷新状态
                    </el-button>
                </div>

                <!-- 日志区域 -->
                <div class="logs-section">
                    <div class="logs-header">
                        <h4>运行日志</h4>
                        <el-button
                            size="small"
                            type="primary"
                            @click="refreshSettingLogs"
                            :loading="logLoading"
                        >
                            <el-icon><Refresh /></el-icon>
                            刷新日志
                        </el-button>
                    </div>
                    <el-card class="logs-card">
                        <div v-if="logList.length === 0" class="no-logs">
                            暂无日志信息
                        </div>
                        <div v-else class="logs-list">
                            <div
                                v-for="(log, index) in logList"
                                :key="index"
                                class="log-item"
                            >
                                {{ log }}
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </el-dialog>


        
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
            :data="filteredPlugins"
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

                        <el-tooltip content="编辑名称" placement="top">
                            <el-button
                                size="small"
                                type="primary"
                                circle
                                @click="handleEditName(row)"
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
                :page-sizes="[10, 20, 50, 100]"
                :total="totalPlugins"
                layout="total, sizes, prev, pager, next, jumper"
                background
                class="custom-pagination"
            />
        </div>
    </el-card>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { getPlugins } from "../api/plugins.js";
// 新增API导入
import request from "../../../utils/request.js";

export default {
    name: "PluginsList",
    setup() {
        const searchText = ref("");
        const statusFilter = ref("");
        const currentPage = ref(1);
        const pageSize = ref(10);
        const selectedPlugins = ref([]);
        const pluginsData = ref([]);

        const totalPlugins = computed(() => pluginsData.value.length);

        // 初始化数据
        const loadData = async () => {
            try {
                const response = await getPlugins();
                pluginsData.value = response.data;
            } catch (error) {
                ElMessage.error("获取插件数据失败");
            }
        };

        // 搜索和筛选时不重新加载数据，直接过滤现有数据
        const filteredPlugins = computed(() => {
            // 过滤搜索文本
            let filteredData = pluginsData.value;
            if (searchText.value) {
                filteredData = filteredData.filter(plugin =>
                    plugin.name.toLowerCase().includes(searchText.value.toLowerCase())
                );
            }
            return filteredData;
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

        const handleAddPlugin = () => {
            ElMessage.success("添加插件功能开发中...");
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
                const detailResponse = await request.get(`/plugin/task`, {
                    params: { id: row.id }
                });
                
                if (detailResponse.code === 200) {
                    pluginDetail.value = detailResponse.data;
                    
                    // 获取日志信息
                    await fetchDetailLogs(row.id, detailResponse.data.save_name);
                } else {
                    ElMessage.error(detailResponse.message || "获取插件详情失败");
                }
            } catch (error) {
                ElMessage.error("获取插件详情失败");
                console.error("获取插件详情失败:", error);
            }
            
            pluginDetailDialog.value = true;
        };

        // 获取日志（查看详情用）
        const fetchDetailLogs = async (id, saveName) => {
            logLoading.value = true;
            try {
                const logResponse = await request.get(`/plugin/logs`, {
                    params: { id, save_name: saveName }
                });
                
                if (logResponse.code === 200) {
                    logList.value = logResponse.data;
                } else {
                    ElMessage.error(logResponse.message || "获取日志失败");
                }
            } catch (error) {
                ElMessage.error("获取日志失败");
                console.error("获取日志失败:", error);
            } finally {
                logLoading.value = false;
            }
        };

        // 刷新日志（查看详情用）
        const refreshDetailLogs = async () => {
            if (pluginDetail.value.id && pluginDetail.value.save_name) {
                await fetchDetailLogs(pluginDetail.value.id, pluginDetail.value.save_name);
            }
        };

        const handleEditName = (row) => {
            ElMessage.info(`编辑插件名称: ${row.name}`);
        };

        // 设置相关变量
        const settingDialog = ref(false);
        const currentTask = ref({});
        const currentTaskDetail = ref({});
        const executionId = ref('');
        const currentStatus = ref('pending');
        const statusLoading = ref(false);

        // 获取任务状态
        const fetchStatus = async () => {
            if (!executionId.value) return;
            
            statusLoading.value = true;
            try {
                const statusResponse = await request.get(`/plugin/status`, {
                    params: { E_id: executionId.value }
                });
                
                if (statusResponse.code === 200) {
                    currentStatus.value = statusResponse.data;
                } else {
                    ElMessage.error(statusResponse.message || "获取状态失败");
                }
            } catch (error) {
                ElMessage.error("获取状态失败");
                console.error("获取状态失败:", error);
            } finally {
                statusLoading.value = false;
            }
        };

        // 刷新状态
        const refreshStatus = async () => {
            await fetchStatus();
        };

        // 获取日志（设置页面用）
        const fetchSettingLogs = async () => {
            if (!currentTask.value.id || !currentTaskDetail.value.save_name) return;
            
            logLoading.value = true;
            try {
                const logResponse = await request.get(`/plugin/logs`, {
                    params: {
                        id: currentTask.value.id,
                        save_name: currentTaskDetail.value.save_name
                    }
                });
                
                if (logResponse.code === 200) {
                    logList.value = logResponse.data;
                } else {
                    ElMessage.error(logResponse.message || "获取日志失败");
                }
            } catch (error) {
                ElMessage.error("获取日志失败");
                console.error("获取日志失败:", error);
            } finally {
                logLoading.value = false;
            }
        };

        // 刷新日志（设置页面用）
        const refreshSettingLogs = async () => {
            if (currentTask.value.id && currentTaskDetail.value.save_name) {
                await fetchSettingLogs();
            } else {
                // 如果没有获取到save_name，尝试重新获取插件详情
                if (currentTask.value.id) {
                    const detailResponse = await request.get(`/plugin/task`, {
                        params: { id: currentTask.value.id }
                    });
                    
                    if (detailResponse.code === 200) {
                        currentTaskDetail.value = detailResponse.data;
                        await fetchSettingLogs();
                    }
                }
            }
        };

        // 启动任务
        const startTask = async (task) => {
            try {
                const invokeResponse = await request.post(`/plugin/invoke`, null, {
                    params: { id: task.id }
                });
                
                if (invokeResponse.code === 200) {
                    executionId.value = invokeResponse.data;
                    currentStatus.value = 'running';
                    ElMessage.success("任务启动成功");
                    
                    // 开始轮询状态
                    await fetchStatus();
                } else {
                    ElMessage.error(invokeResponse.message || "启动任务失败");
                }
            } catch (error) {
                ElMessage.error("启动任务失败");
                console.error("启动任务失败:", error);
            }
        };

        // 停止任务（假设有一个停止接口，这里先用消息提示）
        const stopTask = () => {
            ElMessage.warning("停止任务功能待实现");
            // 实际项目中这里会调用停止任务的API
        };

        // 处理设置按钮点击
        const handleSettings = async (row) => {
            currentTask.value = row;
            try {
                // 获取插件详情以获取save_name字段
                const detailResponse = await request.get(`/plugin/task`, {
                    params: { id: row.id }
                });
                
                if (detailResponse.code === 200) {
                    currentTaskDetail.value = detailResponse.data;
                    // 获取日志信息
                    await fetchSettingLogs();
                } else {
                    ElMessage.error(detailResponse.message || "获取插件详情失败");
                }
            } catch (error) {
                ElMessage.error("获取插件详情失败");
                console.error("获取插件详情失败:", error);
            }
            
            // 尝试获取上次的运行ID（如果有）
            // 这里可以添加获取上次运行记录的逻辑
            executionId.value = '';
            currentStatus.value = 'pending';
            settingDialog.value = true;
        };

        // 获取设置页面状态类型
        const getSettingStatusType = (status) => {
            const statusMap = {
                pending: "info",
                running: "success",
                finished: "warning",
                error: "danger"
            };
            return statusMap[status] || "info";
        };

        // 获取设置页面状态文本
        const getSettingStatusText = (status) => {
            const statusMap = {
                pending: "等待中",
                running: "运行中",
                finished: "已完成",
                error: "错误"
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
            pluginsData,
            totalPlugins,
            filteredPlugins,
            getStatusType,
            getStatusClass,
            getStatusText,
            handleSelectionChange,
            handleAddPlugin,
            handleRefresh,
            handleViewDetails,
            handleEditName,
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
            // 函数相关
            fetchDetailLogs,
            refreshDetailLogs,
            fetchSettingLogs,
            refreshStatus,
            startTask,
            stopTask,
            getSettingStatusType,
            getSettingStatusText,
            refreshSettingLogs,
        };
    }
};
</script>

<style scoped>
.plugins-list-card {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
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
