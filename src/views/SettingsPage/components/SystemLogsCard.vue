<template>
    <el-card class="system-logs-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><Document /></el-icon>
                    <span class="header-title">系统日志</span>
                </div>
            </div>
        </template>

        <!-- 搜索和筛选区域 -->
        <div class="search-section">
            <el-row :gutter="16" class="search-row">
                <el-col :span="8">
                    <el-input
                        v-model="searchText"
                        placeholder="输入关键词搜索日志"
                        clearable
                        class="search-input"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>

                <el-col :span="4">
                    <el-select
                        v-model="logType"
                        placeholder="日志类型"
                        clearable
                        class="filter-select"
                        @change="handleFilterChange"
                    >
                        <el-option label="全部类型" value="" />
                        <el-option label="信息" value="info" />
                        <el-option label="警告" value="warning" />
                        <el-option label="错误" value="error" />
                        <el-option label="调试" value="debug" />
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm"
                        class="date-picker"
                        @change="handleFilterChange"
                    />
                </el-col>

                <el-col :span="6">
                    <div class="action-buttons">
                        <el-button
                            type="primary"
                            @click="handleSearch"
                            class="search-btn"
                        >
                            <el-icon><Search /></el-icon>
                            搜索
                        </el-button>
                        <el-button @click="handleReset" class="reset-btn">
                            <el-icon><Refresh /></el-icon>
                            重置
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 日志表格 -->
        <el-table
            :data="paginatedLogs"
            stripe
            class="logs-table"
            v-loading="loading"
            :default-sort="{ prop: 'timestamp', order: 'descending' }"
        >
            <el-table-column
                label="时间"
                prop="timestamp"
                width="180"
                sortable
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <div class="time-cell">
                        <el-icon class="time-icon"><Clock /></el-icon>
                        {{ row.timestamp }}
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="日志类型"
                prop="type"
                width="120"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <el-tag
                        :type="getLogTypeTag(row.type)"
                        effect="light"
                        round
                        size="small"
                        class="log-type-tag"
                    >
                        <el-icon :size="12">
                            <component :is="getLogTypeIcon(row.type)" />
                        </el-icon>
                        {{ getLogTypeText(row.type) }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="来源"
                prop="source"
                width="150"
                show-overflow-tooltip
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <div class="source-cell">
                        <el-icon class="source-icon"><Grid /></el-icon>
                        {{ row.source }}
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="日志消息"
                prop="message"
                min-width="300"
                show-overflow-tooltip
            >
                <template #default="{ row }">
                    <div class="message-cell">
                        <span class="message-text">{{ row.message }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"
                :total="filteredLogs.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
                class="custom-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </el-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getSystemLogs } from "../api/settings";

export default {
    name: "SystemLogsCard",
    setup() {
        const loading = ref(false);
        const searchText = ref("");
        const logType = ref("");
        const dateRange = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(5);

        // 日志数据
        const logsData = ref([]);

        // 从API获取系统日志
        const fetchSystemLogs = async () => {
            loading.value = true;
            try {
                const params = {};
                if (searchText.value) params.searchText = searchText.value;
                if (logType.value) params.logType = logType.value;
                if (dateRange.value && dateRange.value.length === 2) {
                    params.dateRange = dateRange.value;
                }

                const response = await getSystemLogs(params);
                if (response.success) {
                    logsData.value = response.data;
                }
            } catch (error) {
                console.error("获取系统日志失败:", error);
                ElMessage.error("获取日志失败");
            } finally {
                loading.value = false;
            }
        };

        // 筛选后的日志
        const filteredLogs = computed(() => {
            return logsData.value.filter((log) => {
                // 关键词搜索
                const matchesSearch =
                    !searchText.value ||
                    log.message
                        .toLowerCase()
                        .includes(searchText.value.toLowerCase()) ||
                    log.source
                        .toLowerCase()
                        .includes(searchText.value.toLowerCase());

                // 日志类型筛选
                const matchesType =
                    !logType.value || log.type === logType.value;

                // 日期范围筛选
                const matchesDate =
                    !dateRange.value ||
                    dateRange.value.length === 0 ||
                    (log.timestamp >= dateRange.value[0] &&
                        log.timestamp <= dateRange.value[1]);

                return matchesSearch && matchesType && matchesDate;
            });
        });

        // 分页后的日志
        const paginatedLogs = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value;
            const end = start + pageSize.value;
            return filteredLogs.value.slice(start, end);
        });

        // 工具函数
        const getLogTypeTag = (type) => {
            const typeMap = {
                info: "info",
                warning: "warning",
                error: "danger",
                debug: "primary",
            };
            return typeMap[type] || "info";
        };

        const getLogTypeIcon = (type) => {
            const iconMap = {
                info: "InfoFilled",
                warning: "Warning",
                error: "CircleClose",
                debug: "DataLine",
            };
            return iconMap[type] || "InfoFilled";
        };

        const getLogTypeText = (type) => {
            const textMap = {
                info: "信息",
                warning: "警告",
                error: "错误",
                debug: "调试",
            };
            return textMap[type] || "未知";
        };

        // 事件处理
        const handleSearch = () => {
            currentPage.value = 1;
            fetchSystemLogs();
        };

        const handleReset = () => {
            searchText.value = "";
            logType.value = "";
            dateRange.value = [];
            currentPage.value = 1;
            fetchSystemLogs();
        };

        const handleFilterChange = () => {
            currentPage.value = 1;
        };

        const handleSizeChange = (newSize) => {
            pageSize.value = newSize;
            currentPage.value = 1;
        };

        const handleCurrentChange = (newPage) => {
            currentPage.value = newPage;
        };

        onMounted(() => {
            // 初始化加载日志
            fetchSystemLogs();
        });

        return {
            loading,
            searchText,
            logType,
            dateRange,
            currentPage,
            pageSize,
            logsData,
            filteredLogs,
            paginatedLogs,
            getLogTypeTag,
            getLogTypeIcon,
            getLogTypeText,
            handleSearch,
            handleReset,
            handleFilterChange,
            handleSizeChange,
            handleCurrentChange,
        };
    },
};
</script>

<style scoped>
.system-logs-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 18px;
    color: #4285f4;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.search-section {
    margin-bottom: 20px;
}

.search-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-input,
.filter-select,
.date-picker {
    border-radius: 12px;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.search-btn {
    border-radius: 12px;
    padding: 10px 20px;
}

.reset-btn {
    border-radius: 12px;
    padding: 10px 20px;
}

.logs-table {
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
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

.source-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #606266;
}

.source-icon {
    color: #909399;
    font-size: 14px;
}

.message-cell {
    display: flex;
    align-items: center;
}

.message-text {
    font-size: 13px;
    color: #1f2329;
}

.log-type-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.custom-pagination {
    border-radius: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-row {
        flex-direction: column;
        gap: 12px;
    }

    .action-buttons {
        justify-content: flex-end;
    }

    .time-cell,
    .source-cell {
        justify-content: center;
    }

    .message-text {
        font-size: 12px;
    }
}
</style>
