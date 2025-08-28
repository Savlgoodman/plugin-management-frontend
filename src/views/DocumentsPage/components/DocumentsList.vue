<template>
    <el-card class="documents-list-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><List /></el-icon>
                    <span class="header-title">文档列表</span>
                    <el-tag class="count-tag"
                        >{{ total }} 个文档</el-tag
                    >
                </div>
                <div class="header-right">
                    <el-button
                        type="primary"
                        class="rounded-button"
                        @click="handleBatchDownload"
                        :disabled="selectedDocuments.length === 0"
                    >
                        <el-icon><Download /></el-icon>
                        批量下载 ({{ selectedDocuments.length }})
                    </el-button>
                </div>
            </div>
        </template>

        <!-- 搜索和筛选 -->
        <div class="search-section">
            <el-row :gutter="16">
                <el-col :span="10">
                    <el-input
                        v-model="searchText"
                        placeholder="搜索文档名称、分类或来源"
                        clearable
                        class="search-input"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!-- 字段选择器 -->
                    <el-select
                        v-model="selectedColumns"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        placeholder="选择显示字段"
                        class="filter-select"
                        @change="handleColumnChange"
                    >
                        <el-option
                            v-for="column in availableColumns"
                            :key="column"
                            :label="column"
                            :value="column"
                        />
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        class="date-picker"
                        size="default"
                    />
                </el-col>
                <el-col :span="6">
                    <div class="action-buttons">
                        <el-button
                            @click="handleRefresh"
                            class="rounded-button"
                        >
                            <el-icon><Refresh /></el-icon>
                            刷新
                        </el-button>
                        <el-button @click="handleExport" class="rounded-button">
                            <el-icon><Download /></el-icon>
                            导出
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 文档表格 -->
        <el-table
            :data="documents"
            stripe
            class="documents-table"
            @selection-change="handleSelectionChange"
            v-loading="loading"
        >
            <el-table-column
                v-for="column in selectedColumns"
                :key="column"
                :label="column"
                :prop="column"
                min-width="120"
                show-overflow-tooltip
            />

            <el-table-column
                label="操作"
                fixed="right"
                width="160"
                header-align="center"
            >
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-tooltip content="预览" placement="top">
                            <el-button
                                text
                                @click="handlePreview(row)"
                                class="action-btn"
                            >
                                <el-icon><View /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="下载" placement="top">
                            <el-button
                                text
                                @click="handleDownload(row)"
                                class="action-btn"
                            >
                                <el-icon><Download /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top">
                            <el-button
                                text
                                @click="handleViewDetails(row)"
                                class="action-btn"
                            >
                                <el-icon><InfoFilled /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button
                                text
                                type="danger"
                                @click="handleDelete(row)"
                                class="action-btn"
                            >
                                <el-icon><Delete /></el-icon>
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
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </el-card>
    <el-card class="documents-list-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><List /></el-icon>
                    <span class="header-title">文档列表</span>
                    <el-tag class="count-tag"
                        >{{ total }} 个文档</el-tag
                    >
                </div>
                <div class="header-right">
                    <el-button
                        type="primary"
                        class="rounded-button"
                        @click="handleBatchDownload"
                        :disabled="selectedDocuments.length === 0"
                    >
                        <el-icon><Download /></el-icon>
                        批量下载 ({{ selectedDocuments.length }})
                    </el-button>
                </div>
            </div>
        </template>

        <!-- 搜索和筛选 -->
        <div class="search-section">
            <el-row :gutter="16">
                <el-col :span="10">
                    <el-input
                        v-model="searchText"
                        placeholder="搜索文档名称、分类或来源"
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
                        v-model="categoryFilter"
                        placeholder="分类筛选"
                        clearable
                        class="filter-select"
                    >
                        <el-option label="全部分类" value="" />
                        <el-option label="新闻采集器" value="新闻采集器" />
                        <el-option label="电商数据爬虫" value="电商数据爬虫" />
                        <el-option label="社交媒体监控" value="社交媒体监控" />
                        <el-option label="股票信息采集" value="股票信息采集" />
                        <el-option label="天气数据采集" value="天气数据采集" />
                        <el-option label="房产信息爬虫" value="房产信息爬虫" />
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        class="date-picker"
                        size="default"
                    />
                </el-col>
                <el-col :span="6">
                    <div class="action-buttons">
                        <el-button
                            @click="handleRefresh"
                            class="rounded-button"
                        >
                            <el-icon><Refresh /></el-icon>
                            刷新
                        </el-button>
                        <el-button @click="handleExport" class="rounded-button">
                            <el-icon><Download /></el-icon>
                            导出
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 文档表格 -->
        <el-table
            :data="paginatedDocuments"
            stripe
            class="documents-table"
            @selection-change="handleSelectionChange"
            v-loading="loading"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column
                label="文档名称"
                prop="name"
                min-width="320"
                show-overflow-tooltip
            >
                <template #default="{ row }">
                    <div class="document-name-cell">
                        <div
                            class="document-icon"
                            :style="{ color: getDocumentTypeColor(row.type) }"
                        >
                            <el-icon :size="20">
                                <component
                                    :is="getDocumentTypeIcon(row.type)"
                                />
                            </el-icon>
                        </div>
                        <div class="document-info">
                            <div class="document-name" :title="row.name">
                                {{ row.name }}
                            </div>
                            <div class="document-meta">
                                <span class="document-extension">{{
                                    row.extension
                                }}</span>
                                <span class="document-date">{{
                                    formatDate(row.documentDate)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                label="文档分类"
                prop="category"
                width="140"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <el-tag
                        :color="getCategoryColor(row.category)"
                        effect="light"
                        round
                        size="small"
                    >
                        {{ row.category }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="采集日期"
                prop="collectDate"
                width="120"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span class="date-text">{{
                        formatDate(row.collectDate)
                    }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="大小"
                prop="size"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <span class="size-text">{{
                        formatFileSize(row.size)
                    }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="下载次数"
                prop="downloadCount"
                width="100"
                header-align="center"
                align="center"
            >
                <template #default="{ row }">
                    <el-tag type="info" effect="plain" round size="small">
                        {{ row.downloadCount }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                fixed="right"
                width="160"
                header-align="center"
            >
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-tooltip content="预览" placement="top">
                            <el-button
                                text
                                @click="handlePreview(row)"
                                class="action-btn"
                            >
                                <el-icon><View /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="下载" placement="top">
                            <el-button
                                text
                                @click="handleDownload(row)"
                                class="action-btn"
                            >
                                <el-icon><Download /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top">
                            <el-button
                                text
                                @click="handleViewDetails(row)"
                                class="action-btn"
                            >
                                <el-icon><InfoFilled /></el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button
                                text
                                type="danger"
                                @click="handleDelete(row)"
                                class="action-btn"
                            >
                                <el-icon><Delete /></el-icon>
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
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </el-card>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTableColumns, getTableData, refreshDocuments, deleteDocument } from "../api/documents";

export default {
    name: "DocumentsList",
    setup() {
        const loading = ref(false);
        const searchText = ref("");
        const categoryFilter = ref("");
        const dateRange = ref([]);
        const selectedDocuments = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(20);
        const tableName = ref("");
        const availableColumns = ref([]);
        const selectedColumns = ref([]);
        const documents = ref([]);

        // 加载表数据
        const loadTableData = async () => {
            if (!tableName.value) {
                documents.value = [];
                return;
            }

            try {
                loading.value = true;
                // 获取字段信息
                const columns = await getTableColumns(tableName.value);
                availableColumns.value = columns.map(col => col.name);
                // 默认选择所有字段
                selectedColumns.value = [...availableColumns.value];

                // 获取表数据
                const data = await getTableData(
                    tableName.value,
                    selectedColumns.value.join(','),
                    (currentPage.value - 1) * pageSize.value,
                    pageSize.value
                );
                documents.value = data.data;
                total.value = data.total;
            } catch (error) {
                console.error("获取数据失败:", error);
                documents.value = [];
            } finally {
                loading.value = false;
            }
        };

        // 监听分类变化
        watch(() => tableName.value, () => {
            currentPage.value = 1;
            loadTableData();
        });

        // 监听分页变化
        watch([currentPage, pageSize], () => {
            loadTableData();
        });

        // 总数
        const total = ref(0);

        // 工具函数
        const formatDate = (dateStr) => {
            return dateStr;
        };

        const formatFileSize = (bytes) => {
            if (bytes === 0) return "0 B";
            const k = 1024;
            const sizes = ["B", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (
                parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
            );
        };

        const getDocumentTypeIcon = (type) => {
            const icons = {
                pdf: "Document",
                excel: "Grid",
                html: "Globe",
                json: "DataBoard",
                csv: "List",
                xml: "Files",
            };
            return icons[type] || "Document";
        };

        const getDocumentTypeColor = (type) => {
            const colors = {
                pdf: "#ea4335",
                excel: "#34a853",
                html: "#4285f4",
                json: "#ff9500",
                csv: "#34a853",
                xml: "#9c27b0",
            };
            return colors[type] || "#666";
        };

        const getCategoryColor = (category) => {
            const colors = {
                新闻采集器: "#e3f2fd",
                电商数据爬虫: "#ffebee",
                社交媒体监控: "#e8f5e8",
                股票信息采集: "#fff8e1",
                天气数据采集: "#fff3e0",
                房产信息爬虫: "#f3e5f5",
            };
            return colors[category] || "#f5f5f5";
        };

        // 事件处理
        const handleSelectionChange = (selection) => {
            selectedDocuments.value = selection;
        };

        const handleSizeChange = (newSize) => {
            pageSize.value = newSize;
            currentPage.value = 1;
        };

        const handleCurrentChange = (newPage) => {
            currentPage.value = newPage;
        };

        const handleRefresh = () => {
            refreshDocuments().then(() => {
                ElMessage.success("文档列表已刷新");
                loadTableData();
            });
        };

        const handleExport = () => {
            ElMessage.success("导出功能开发中...");
        };

        const handleBatchDownload = () => {
            ElMessage.success(
                `批量下载 ${selectedDocuments.value.length} 个文档功能开发中...`
            );
        };

        const handlePreview = (row) => {
            ElMessage.success(`预览文档: ${row.name}`);
        };

        const handleDownload = (row) => {
            ElMessage.success(`下载文档: ${row.name}`);
        };

        const handleViewDetails = (row) => {
            ElMessage.success(`查看详情: ${row.name}`);
        };

        const handleDelete = (row) => {
            ElMessageBox.confirm(
                `确定要删除文档 "${row.name}" 吗？`,
                "删除确认",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    deleteDocument(row.id).then(() => {
                        ElMessage.success("删除成功");
                        loadTableData();
                    }).catch(() => {
                        ElMessage.error("删除失败");
                    });
                })
                .catch(() => {
                    ElMessage.info("已取消删除");
                });
        };

        onMounted(() => {
            // 组件挂载时的初始化逻辑
        });

        // 处理分类变化
        const handleCategoryChange = (data) => {
            tableName.value = data.tableName;
        };

        // 处理字段选择变化
        const handleColumnChange = () => {
            loadTableData();
        };

        return {
            loading,
            searchText,
            categoryFilter,
            dateRange,
            selectedDocuments,
            currentPage,
            pageSize,
            total,
            documents,
            availableColumns,
            selectedColumns,
            formatDate,
            formatFileSize,
            getDocumentTypeIcon,
            getDocumentTypeColor,
            getCategoryColor,
            handleSelectionChange,
            handleSizeChange,
            handleCurrentChange,
            handleRefresh,
            handleExport,
            handleBatchDownload,
            handlePreview,
            handleDownload,
            handleViewDetails,
            handleDelete,
            handleCategoryChange,
            handleColumnChange
        };
    },
};
</script>

<style scoped>
.documents-list-card {
    height: 100%;
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
    gap: 12px;
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

.count-tag {
    background: #f0f7ff;
    color: #4285f4;
    border: 1px solid #b3d8ff;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rounded-button {
    border-radius: 12px;
    font-weight: 500;
}

.search-section {
    margin-bottom: 20px;
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

.documents-table {
    margin-bottom: 20px;
}

.document-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.document-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(66, 133, 244, 0.1);
}

.document-info {
    flex: 1;
}

.document-name {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    line-height: 1.2;
}

.document-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
}

.document-extension {
    font-size: 12px;
    color: #86909c;
}

.document-date {
    font-size: 12px;
    color: #86909c;
}

.source-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #606266;
}

.source-icon {
    color: #86909c;
}

.date-text,
.size-text {
    font-size: 13px;
    color: #606266;
}

.action-btn {
    padding: 4px;
    border-radius: 6px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination {
    background: none;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .search-section .el-col {
        margin-bottom: 8px;
    }
}

@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .header-left {
        justify-content: space-between;
    }

    .search-section .el-row {
        gap: 8px;
    }

    .action-buttons {
        justify-content: center;
    }

    .documents-table {
        font-size: 12px;
    }

    .document-name-cell {
        gap: 8px;
    }

    .document-icon {
        width: 28px;
        height: 28px;
    }
}
</style>
 