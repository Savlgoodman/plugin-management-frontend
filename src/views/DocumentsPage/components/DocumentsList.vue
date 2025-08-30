<template>
    <el-card class="documents-list-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><List /></el-icon>
                    <span class="header-title">文档列表</span>
                    <el-tag class="count-tag">{{ total }} 个文档</el-tag>
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
                <el-col :span="8">
                    <!-- 字段选择器 - 扩大尺寸 -->
                    <el-select
                        v-model="selectedColumns"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        placeholder="选择显示字段"
                        class="filter-select expanded-select"
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
        <div class="table-container">
            <el-table
                :data="paginatedDocuments"
                stripe
                class="documents-table"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                :show-overflow-tooltip="false"
                :style="getTableStyle()"
                table-layout="fixed"
            >
                <el-table-column type="selection" width="55" fixed="left" />

                <el-table-column
                    v-for="column in selectedColumns"
                    :key="column"
                    :label="column"
                    :prop="column"
                    :width="getColumnWidth()"
                    class-name="dynamic-width-column"
                    :show-overflow-tooltip="false"
                >
                    <template
                        #default="{ row }"
                        v-if="column === '文档名称' || column === 'name'"
                    >
                        <div class="document-name-cell">
                            <div
                                class="document-icon"
                                :style="{
                                    color: getDocumentTypeColor(row.type),
                                }"
                            >
                                <el-icon :size="16">
                                    <component
                                        :is="getDocumentTypeIcon(row.type)"
                                    />
                                </el-icon>
                            </div>
                            <div class="document-info">
                                <el-tooltip
                                    :content="row.name || row['文档名称']"
                                    placement="top"
                                    :disabled="
                                        !isTextOverflow(
                                            row.name || row['文档名称'],
                                            getTextMaxLength()
                                        )
                                    "
                                >
                                    <div class="document-name">
                                        {{
                                            truncateText(
                                                row.name || row["文档名称"],
                                                getTextMaxLength()
                                            )
                                        }}
                                    </div>
                                </el-tooltip>
                                <div class="document-meta">
                                    <el-tooltip
                                        :content="
                                            row.extension || row['扩展名']
                                        "
                                        placement="top"
                                        :disabled="
                                            !isTextOverflow(
                                                row.extension || row['扩展名'],
                                                Math.max(
                                                    4,
                                                    Math.floor(
                                                        getTextMaxLength() / 3
                                                    )
                                                )
                                            )
                                        "
                                    >
                                        <span class="document-extension">{{
                                            truncateText(
                                                row.extension || row["扩展名"],
                                                Math.max(
                                                    4,
                                                    Math.floor(
                                                        getTextMaxLength() / 3
                                                    )
                                                )
                                            )
                                        }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template
                        #default="{ row }"
                        v-else-if="
                            column === '文档分类' || column === 'category'
                        "
                    >
                        <el-tooltip
                            :content="row.category || row['文档分类']"
                            placement="top"
                            :disabled="
                                !isTextOverflow(
                                    row.category || row['文档分类'],
                                    getTextMaxLength()
                                )
                            "
                        >
                            <el-tag
                                :color="
                                    getCategoryColor(
                                        row.category || row['文档分类']
                                    )
                                "
                                effect="light"
                                round
                                size="small"
                            >
                                {{
                                    truncateText(
                                        row.category || row["文档分类"],
                                        getTextMaxLength()
                                    )
                                }}
                            </el-tag>
                        </el-tooltip>
                    </template>
                    <template
                        #default="{ row }"
                        v-else-if="
                            column === '采集日期' || column === 'collectDate'
                        "
                    >
                        <el-tooltip
                            :content="
                                formatDate(row.collectDate || row['采集日期'])
                            "
                            placement="top"
                            :disabled="
                                !isTextOverflow(
                                    formatDate(
                                        row.collectDate || row['采集日期']
                                    ),
                                    getTextMaxLength()
                                )
                            "
                        >
                            <span class="date-text">{{
                                truncateText(
                                    formatDate(
                                        row.collectDate || row["采集日期"]
                                    ),
                                    getTextMaxLength()
                                )
                            }}</span>
                        </el-tooltip>
                    </template>
                    <template
                        #default="{ row }"
                        v-else-if="column === '大小' || column === 'size'"
                    >
                        <el-tooltip
                            :content="formatFileSize(row.size || row['大小'])"
                            placement="top"
                            :disabled="
                                !isTextOverflow(
                                    formatFileSize(row.size || row['大小']),
                                    getTextMaxLength()
                                )
                            "
                        >
                            <span class="size-text">{{
                                truncateText(
                                    formatFileSize(row.size || row["大小"]),
                                    getTextMaxLength()
                                )
                            }}</span>
                        </el-tooltip>
                    </template>
                    <template
                        #default="{ row }"
                        v-else-if="
                            column === '下载次数' || column === 'downloadCount'
                        "
                    >
                        <el-tag type="info" effect="plain" round size="small">
                            {{ row.downloadCount || row["下载次数"] || 0 }}
                        </el-tag>
                    </template>
                    <template #default="{ row }" v-else>
                        <el-tooltip
                            :content="String(row[column] || '')"
                            placement="top"
                            :disabled="
                                !isTextOverflow(
                                    String(row[column] || ''),
                                    getTextMaxLength()
                                )
                            "
                        >
                            <span class="cell-content">
                                {{
                                    truncateText(
                                        row[column],
                                        getTextMaxLength()
                                    )
                                }}
                            </span>
                        </el-tooltip>
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
        </div>

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
import {
    getTableColumns,
    getTableData,
    refreshDocuments,
    deleteDocument,
    previewDocument,
    downloadDocument,
    exportDocuments,
    batchDownloadDocuments,
} from "../api/documents";

export default {
    name: "DocumentsList",
    setup() {
        // 响应式数据
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
        const total = ref(0);
        const isInitialLoad = ref(true); // 用于标识是否为初始加载

        // 计算属性 - 分页后的文档
        const paginatedDocuments = computed(() => {
            if (
                !searchText.value &&
                !categoryFilter.value &&
                !dateRange.value?.length
            ) {
                return documents.value;
            }

            let filtered = documents.value;

            // 搜索过滤
            if (searchText.value) {
                filtered = filtered.filter(
                    (doc) =>
                        (doc.name || doc["文档名称"] || "")
                            .toLowerCase()
                            .includes(searchText.value.toLowerCase()) ||
                        (doc.category || doc["文档分类"] || "")
                            .toLowerCase()
                            .includes(searchText.value.toLowerCase())
                );
            }

            // 分类过滤
            if (categoryFilter.value) {
                filtered = filtered.filter(
                    (doc) =>
                        (doc.category || doc["文档分类"]) ===
                        categoryFilter.value
                );
            }

            // 日期范围过滤
            if (dateRange.value?.length === 2) {
                const [startDate, endDate] = dateRange.value;
                filtered = filtered.filter((doc) => {
                    const docDate = doc.collectDate || doc["采集日期"];
                    return docDate >= startDate && docDate <= endDate;
                });
            }

            return filtered;
        });

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
                availableColumns.value = columns.map((col) => col.name);

                // 只在初始加载时设置默认选择的字段
                if (isInitialLoad.value) {
                    selectedColumns.value = [...availableColumns.value];
                    isInitialLoad.value = false;
                }

                // 获取表数据
                const data = await getTableData(
                    tableName.value,
                    selectedColumns.value.join(","),
                    (currentPage.value - 1) * pageSize.value,
                    pageSize.value
                );

                documents.value = data.data;
                total.value = data.total;
            } catch (error) {
                console.error("获取数据失败:", error);
                ElMessage.error("获取数据失败");
                documents.value = [];
                total.value = 0;
            } finally {
                loading.value = false;
            }
        };

        // 工具函数
        const formatDate = (dateStr) => {
            if (!dateStr) return "";
            return dateStr;
        };

        const formatFileSize = (bytes) => {
            if (!bytes || bytes === 0) return "0 B";
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

        // 获取表格样式 - 确保表格不会撑开卡片
        const getTableStyle = () => {
            const columnCount = selectedColumns.value.length;
            if (columnCount <= 4) {
                // 字段少时，表格宽度100%，充分利用卡片空间
                return {
                    width: "100%",
                    maxWidth: "100%",
                };
            } else {
                // 字段多时，表格可能超出卡片宽度，但卡片会显示滚动条
                const tableWidth = columnCount * 160 + 55 + 160; // 列宽 * 数量 + 选择列 + 操作列
                return {
                    width: `${tableWidth}px`,
                    minWidth: `${tableWidth}px`,
                    maxWidth: "none", // 允许表格超出，但由容器滚动处理
                };
            }
        };

        // 动态计算列宽 - 保持卡片宽度不变
        const getColumnWidth = () => {
            const columnCount = selectedColumns.value.length;
            if (columnCount === 0) return "200";

            // 卡片固定宽度，不允许变形
            const cardContentWidth = 800; // 卡片内容区域固定宽度
            const fixedWidths = 55 + 160; // 选择列 + 操作列

            if (columnCount <= 4) {
                // 字段少时，均匀分配剩余空间
                const availableWidth = cardContentWidth - fixedWidths;
                const columnWidth = Math.floor(availableWidth / columnCount);
                return Math.max(140, columnWidth).toString();
            } else {
                // 字段多时，使用固定列宽，启用横向滚动
                return "160";
            }
        };

        // 动态计算文字最大长度 - 基于列宽和字段数量
        const getTextMaxLength = () => {
            const columnCount = selectedColumns.value.length;
            const columnWidth = parseInt(getColumnWidth());

            // 根据列宽和字段数量计算合适的字符数
            if (columnCount <= 2) {
                return Math.floor(columnWidth / 8); // 字段少时，显示更多字符
            } else if (columnCount <= 4) {
                return Math.floor(columnWidth / 10); // 中等数量字段
            } else {
                return Math.min(15, Math.floor(columnWidth / 10)); // 字段多时，限制最大字符数
            }
        };

        const truncateText = (text, maxLength = 12) => {
            if (!text || typeof text !== "string") {
                return text || "";
            }
            if (text.length <= maxLength) {
                return text;
            }
            return text.substring(0, maxLength) + "...";
        };

        const isTextOverflow = (text, maxLength) => {
            if (!text || typeof text !== "string") {
                return false;
            }
            return text.length > maxLength;
        };

        // 事件处理函数
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

        const handleRefresh = async () => {
            try {
                await refreshDocuments();
                await loadTableData();
                ElMessage.success("文档列表已刷新");
            } catch (error) {
                ElMessage.error("刷新失败");
            }
        };

        const handleExport = async () => {
            try {
                loading.value = true;
                const filters = {
                    searchText: searchText.value,
                    categoryFilter: categoryFilter.value,
                    dateRange: dateRange.value,
                    tableName: tableName.value,
                };

                const exportUrl = await exportDocuments(filters);

                // 创建临时链接进行下载
                const link = document.createElement("a");
                link.href = exportUrl;
                link.download = `documents_${new Date().getTime()}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                ElMessage.success("导出成功");
            } catch (error) {
                ElMessage.error("导出失败: " + error.message);
            } finally {
                loading.value = false;
            }
        };

        const handleBatchDownload = async () => {
            if (selectedDocuments.value.length === 0) {
                ElMessage.warning("请先选择要下载的文档");
                return;
            }

            try {
                loading.value = true;
                const documentIds = selectedDocuments.value.map(
                    (doc) => doc.id
                );
                await batchDownloadDocuments(documentIds);
                ElMessage.success(
                    `成功下载 ${selectedDocuments.value.length} 个文档`
                );
            } catch (error) {
                ElMessage.error("批量下载失败: " + error.message);
            } finally {
                loading.value = false;
            }
        };

        const handlePreview = async (row) => {
            try {
                const documentName = row.name || row["文档名称"];

                if (!row.id) {
                    ElMessage.warning("文档ID缺失，无法预览");
                    return;
                }

                const previewUrl = await previewDocument(row.id);

                // 在新窗口中打开预览
                window.open(previewUrl, "_blank");

                ElMessage.success(`正在预览文档: ${documentName}`);
            } catch (error) {
                ElMessage.error("预览失败: " + error.message);
            }
        };

        const handleDownload = async (row) => {
            try {
                const documentName = row.name || row["文档名称"];

                if (!row.id) {
                    ElMessage.warning("文档ID缺失，无法下载");
                    return;
                }

                const downloadUrl = await downloadDocument(row.id);

                // 创建临时链接进行下载
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = documentName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                ElMessage.success(`正在下载文档: ${documentName}`);
            } catch (error) {
                ElMessage.error("下载失败: " + error.message);
            }
        };

        const handleViewDetails = (row) => {
            ElMessage.success(`查看详情: ${row.name || row["文档名称"]}`);
        };

        const handleDelete = (row) => {
            ElMessageBox.confirm(
                `确定要删除文档 "${row.name || row["文档名称"]}" 吗？`,
                "删除确认",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(async () => {
                    try {
                        await deleteDocument(row.id);
                        ElMessage.success("删除成功");
                        await loadTableData();
                    } catch (error) {
                        ElMessage.error("删除失败");
                    }
                })
                .catch(() => {
                    ElMessage.info("已取消删除");
                });
        };

        // 处理分类变化
        const handleCategoryChange = (data) => {
            tableName.value = data.tableName;
            isInitialLoad.value = true; // 重置为初始加载状态
        };

        // 处理字段选择变化
        const handleColumnChange = () => {
            // 只有在非初始加载时才重新加载数据
            if (!isInitialLoad.value) {
                loadTableData();
            }
        };

        // 监听器
        watch(
            () => tableName.value,
            () => {
                currentPage.value = 1;
                loadTableData();
            }
        );

        watch([currentPage, pageSize], () => {
            if (!isInitialLoad.value) {
                loadTableData();
            }
        });

        // 生命周期
        onMounted(() => {
            // 组件挂载时的初始化逻辑
        });

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
            paginatedDocuments,
            formatDate,
            formatFileSize,
            getDocumentTypeIcon,
            getDocumentTypeColor,
            getCategoryColor,
            getTableStyle,
            getColumnWidth,
            getTextMaxLength,
            truncateText,
            isTextOverflow,
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
            handleColumnChange,
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
    width: 100%; /* 确保卡片宽度固定 */
    max-width: 100%; /* 防止超出容器 */
    overflow: hidden; /* 防止内容溢出导致卡片变形 */
    box-sizing: border-box; /* 包含边框和内边距 */
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
    gap: 8px;
    width: 100%;
    min-width: 0; /* 允许flex子元素收缩 */
}

.document-icon {
    flex-shrink: 0; /* 防止图标被压缩 */
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: rgba(66, 133, 244, 0.1);
}

.document-info {
    flex: 1;
    min-width: 0; /* 允许文本内容收缩 */
    overflow: hidden;
}

.document-name {
    font-size: 13px;
    font-weight: 500;
    color: #1f2329;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.document-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
}

.document-extension {
    font-size: 11px;
    color: #86909c;
    background: #f2f3f5;
    padding: 1px 4px;
    border-radius: 3px;
}

.document-date {
    font-size: 11px;
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

.expanded-select {
    width: 100%;
}

.table-container {
    overflow-x: auto; /* 允许表格内容横向滚动 */
    -webkit-overflow-scrolling: touch; /* 优化移动端滚动 */
    width: 100%;
    max-width: 100%; /* 严格限制最大宽度 */
    position: relative; /* 为滚动条定位做准备 */
    box-sizing: border-box;
}

/* 自定义滚动条样式 */
.table-container::-webkit-scrollbar {
    height: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}

.documents-table {
    overflow: hidden;
    table-layout: fixed; /* 强制固定表格布局 */
    margin: 0; /* 移除默认边距 */
}

/* 确保表格在字段少时充分利用空间，字段多时允许滚动 */
.documents-table :deep(.el-table__body-wrapper) {
    overflow: visible;
}

/* 强制限制Element Plus表格的宽度行为 */
.documents-table :deep(.el-table) {
    max-width: 100% !important;
}

.documents-table :deep(.el-table__header-wrapper),
.documents-table :deep(.el-table__body-wrapper),
.documents-table :deep(.el-table__footer-wrapper) {
    overflow-x: visible !important;
}

.documents-table :deep(.el-table__header) {
    background-color: #f8f9fa;
}

.documents-table :deep(.el-table__cell) {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
}

.documents-table :deep(.dynamic-width-column) {
    /* 动态列宽，根据字段数量调整 */
    overflow: hidden;
}

.documents-table :deep(.dynamic-width-column .cell) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 12px; /* 增加列间距 */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.cell-content {
    /* 确保单元格内容不会被截断 */
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    cursor: pointer; /* 提示用户可以悬浮查看完整内容 */
}

/* 为所有可能被截断的文本添加悬浮指示 */
.document-name,
.document-extension,
.date-text,
.size-text,
.el-tag {
    cursor: pointer;
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
