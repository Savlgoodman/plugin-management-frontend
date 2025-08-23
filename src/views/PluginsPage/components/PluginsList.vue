<template>
    <el-card class="plugins-list-card">
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

        const handleViewDetails = (row) => {
            ElMessage.info(`查看插件详情: ${row.name}`);
        };

        const handleEditName = (row) => {
            ElMessage.info(`编辑插件名称: ${row.name}`);
        };

        const handleSettings = (row) => {
            ElMessage.info(`插件设置: ${row.name}`);
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
        };
    },
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
