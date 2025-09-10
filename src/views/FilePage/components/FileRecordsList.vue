<template>
    <el-card class="file-records-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><Files /></el-icon>
                    <span class="header-title">文件记录</span>
                    <el-tag class="count-tag">{{ total }} 个文件</el-tag>
                </div>
                <div class="header-right">
                    <el-button
                        type="warning"
                        class="rounded-button"
                        @click="handleResetFailed"
                        :disabled="!currentPlugin"
                        :loading="resetting"
                    >
                        <el-icon><RefreshRight /></el-icon>
                        重置失败
                    </el-button>
                    <el-button
                        type="primary"
                        class="rounded-button"
                        @click="handleBatchDownload"
                        :disabled="selectedRecords.length === 0"
                        :loading="batchDownloading"
                    >
                        <el-icon><Download /></el-icon>
                        批量下载 ({{ selectedRecords.length }})
                    </el-button>
                    <el-dropdown v-if="lastZipInfo" trigger="click">
                        <el-button
                            type="success"
                            class="rounded-button"
                            size="small"
                        >
                            <el-icon><Download /></el-icon>
                            手动下载ZIP
                            <el-icon class="el-icon--right"
                                ><ArrowDown
                            /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleManualDownload">
                                    <el-icon><Download /></el-icon>
                                    当前窗口下载
                                </el-dropdown-item>
                                <el-dropdown-item
                                    @click="handleNewWindowDownload"
                                >
                                    <el-icon><Link /></el-icon>
                                    新窗口下载
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </template>

        <!-- 搜索和筛选 -->
        <div class="search-section" v-if="currentPlugin">
            <el-row :gutter="16">
                <el-col :span="8">
                    <el-input
                        v-model="searchText"
                        placeholder="搜索文件名"
                        clearable
                        class="search-input"
                        @input="handleSearch"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-select
                        v-model="filterStatus"
                        placeholder="下载状态"
                        clearable
                        class="filter-select"
                        @change="handleFilter"
                    >
                        <el-option label="全部" value="" />
                        <el-option label="已下载" value="1" />
                        <el-option label="未下载" value="0" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select
                        v-model="filterType"
                        placeholder="文件类型"
                        clearable
                        class="filter-select"
                        @change="handleFilter"
                    >
                        <el-option label="全部" value="" />
                        <el-option label="PDF文档" value="pdf" />
                        <el-option label="Word文档" value="doc,docx" />
                        <el-option label="Excel表格" value="xls,xlsx,csv" />
                        <el-option label="PPT演示" value="ppt,pptx" />
                        <el-option
                            label="图片文件"
                            value="jpg,jpeg,png,gif,bmp,webp,svg"
                        />
                        <el-option
                            label="视频文件"
                            value="mp4,avi,mov,wmv,flv,mkv,webm"
                        />
                        <el-option
                            label="音频文件"
                            value="mp3,wav,flac,aac,ogg"
                        />
                        <el-option label="压缩文件" value="zip,rar,7z,tar,gz" />
                        <el-option label="文本文件" value="txt,md,log" />
                        <el-option
                            label="代码文件"
                            value="js,html,css,json,xml,py,java,c,cpp"
                        />
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button
                        @click="handleRefresh"
                        class="rounded-button"
                        :loading="loading"
                    >
                        <el-icon><Refresh /></el-icon>
                        刷新
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 文件记录表格 -->
        <div class="table-container" v-if="currentPlugin">
            <el-table
                ref="fileTableRef"
                :data="records"
                stripe
                class="files-table"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                :show-overflow-tooltip="false"
                table-layout="fixed"
                :row-class-name="getRowClassName"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    fixed="left"
                    :selectable="checkSelectable"
                />

                <el-table-column
                    label="文件名"
                    prop="filename"
                    width="250"
                    fixed="left"
                >
                    <template #default="{ row }">
                        <div class="file-name-cell">
                            <div
                                class="file-icon"
                                :style="{
                                    color: getFileTypeColor(row.file_type),
                                }"
                            >
                                <el-icon :size="16">
                                    <component
                                        :is="getFileTypeIcon(row.file_type)"
                                    />
                                </el-icon>
                            </div>
                            <div class="file-info">
                                <el-tooltip
                                    :content="row.filename"
                                    placement="top"
                                >
                                    <div class="file-name file-name-multiline">
                                        {{ row.filename }}
                                    </div>
                                </el-tooltip>
                                <div class="file-type">{{ row.file_type }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="文件大小" width="120" align="right">
                    <template #default="{ row }">
                        <span class="file-size">{{
                            formatFileSize(row.size)
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="文件路径" prop="file_path" width="200">
                    <template #default="{ row }">
                        <el-tooltip
                            :content="row.file_path || '-'"
                            placement="top"
                        >
                            <span class="file-path file-path-truncated">{{
                                truncateText(row.file_path, 30) || "-"
                            }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="下载链接" width="250">
                    <template #default="{ row }">
                        <el-tooltip
                            :content="row.download_url || '-'"
                            placement="top"
                        >
                            <span class="download-url download-url-truncated">{{
                                truncateText(row.download_url, 40) || "-"
                            }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="下载状态" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag
                            :type="row.is_download === 1 ? 'success' : 'info'"
                            size="small"
                        >
                            {{
                                row.download_status ||
                                (row.is_download === 1 ? "已下载" : "未下载")
                            }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-tooltip content="下载文件" placement="top">
                            <el-button
                                type="primary"
                                size="small"
                                text
                                @click="handleSingleDownload(row)"
                                :disabled="!row._id"
                            >
                                <el-icon><Download /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
            <el-empty
                description="请选择一个插件查看文件记录"
                :image-size="100"
            />
        </div>

        <!-- 分页 -->
        <div class="pagination-container" v-if="currentPlugin && total > 0">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[20, 50, 100, 200]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="pagination"
            />
        </div>

        <!-- 下载进度弹窗 -->
        <el-dialog
            v-model="downloadProgress.visible"
            title="文件下载进度"
            width="500px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="downloadProgress.status !== 'downloading'"
        >
            <div class="download-progress-content">
                <div class="progress-info">
                    <div class="progress-status">
                        <el-icon :size="24" :color="getProgressStatusColor()">
                            <component :is="getProgressStatusIcon()" />
                        </el-icon>
                        <span class="status-text">{{
                            getProgressStatusText()
                        }}</span>
                    </div>

                    <div
                        class="progress-details"
                        v-if="downloadProgress.total > 0"
                    >
                        <div class="size-info">
                            {{ formatFileSize(downloadProgress.loaded) }} /
                            {{ formatFileSize(downloadProgress.total) }}
                        </div>
                        <div
                            class="attempt-info"
                            v-if="downloadProgress.maxAttempts > 1"
                        >
                            尝试 {{ downloadProgress.attempt }} /
                            {{ downloadProgress.maxAttempts }}
                        </div>
                    </div>
                </div>

                <el-progress
                    :percentage="downloadProgress.progress"
                    :status="getProgressType()"
                    :stroke-width="8"
                    :show-text="true"
                />

                <div
                    class="progress-tips"
                    v-if="downloadProgress.status === 'downloading'"
                >
                    <p>文件较大时下载可能需要较长时间，请耐心等待</p>
                    <p>如果下载失败，系统会自动重试</p>
                </div>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import { ref, watch, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    getFileRecords,
    createBatchDownload,
    downloadZip,
    downloadZipSimple,
    downloadZipInNewWindow,
    downloadZipWithProgress,
    downloadSingleFile,
    resetFailedRecords,
} from "../api/files";

export default {
    name: "FileRecordsList",
    props: {
        currentPlugin: {
            type: Object,
            default: null,
        },
    },
    setup(props) {
        const fileTableRef = ref(null);
        const records = ref([]);
        const selectedRecords = ref([]);
        const loading = ref(false);
        const batchDownloading = ref(false);
        const resetting = ref(false);
        const searchText = ref("");
        const filterStatus = ref("");
        const filterType = ref("");
        const currentPage = ref(1);
        const pageSize = ref(20);
        const total = ref(0);
        const lastZipInfo = ref(null);

        // 下载进度相关状态
        const downloadProgress = ref({
            visible: false,
            progress: 0,
            loaded: 0,
            total: 0,
            attempt: 1,
            maxAttempts: 3,
            status: "downloading", // downloading, success, error
        });

        // 监听插件变化
        watch(
            () => props.currentPlugin,
            (newPlugin) => {
                if (newPlugin) {
                    currentPage.value = 1;
                    loadFileRecords();
                }
            },
            { immediate: true }
        );

        // 加载文件记录
        const loadFileRecords = async () => {
            if (!props.currentPlugin) return;

            loading.value = true;
            try {
                const skip = (currentPage.value - 1) * pageSize.value;
                const result = await getFileRecords(
                    props.currentPlugin.plugin_id,
                    skip,
                    pageSize.value
                );

                if (result.success) {
                    records.value = result.data.records || [];
                    total.value = result.data.pagination?.total || 0;
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("加载文件记录失败:", error);
                ElMessage.error("加载文件记录失败");
            } finally {
                loading.value = false;
            }
        };

        // 检查行是否可选
        const checkSelectable = (row) => {
            // 只有已下载的文件（is_download === 1）才可以被选中
            return row.is_download === 1;
        };

        // 获取行的CSS类名
        const getRowClassName = ({ row }) => {
            // 为未下载的文件添加特殊样式
            if (row.is_download === 0) {
                return "row-not-selectable";
            }
            return "";
        };

        // 处理选择变化
        const handleSelectionChange = (selection) => {
            selectedRecords.value = selection;
        };

        // 处理批量下载
        const handleBatchDownload = async () => {
            if (selectedRecords.value.length === 0) {
                ElMessage.warning("请选择要下载的文件");
                return;
            }

            try {
                await ElMessageBox.confirm(
                    `确定要批量下载 ${selectedRecords.value.length} 个文件吗？`,
                    "批量下载确认",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }
                );

                batchDownloading.value = true;
                const recordIds = selectedRecords.value.map(
                    (record) => record._id
                );

                // 创建ZIP文件
                const createResult = await createBatchDownload(
                    props.currentPlugin.plugin_id,
                    recordIds
                );

                if (createResult.success) {
                    // 保存ZIP信息以便手动下载
                    lastZipInfo.value = {
                        pluginId: props.currentPlugin.plugin_id,
                        zipFilename: createResult.data.zip_filename,
                        createTime: new Date(),
                    };

                    ElMessage.success("ZIP文件创建成功，开始下载...");

                    // 显示下载进度
                    downloadProgress.value.visible = true;
                    downloadProgress.value.status = "downloading";
                    downloadProgress.value.progress = 0;

                    // 使用带进度的下载函数
                    const downloadResult = await downloadZipWithProgress(
                        props.currentPlugin.plugin_id,
                        createResult.data.zip_filename,
                        (progressInfo) => {
                            // 更新进度信息
                            downloadProgress.value.progress =
                                progressInfo.progress;
                            downloadProgress.value.loaded = progressInfo.loaded;
                            downloadProgress.value.total = progressInfo.total;
                            downloadProgress.value.attempt =
                                progressInfo.attempt;
                            downloadProgress.value.maxAttempts =
                                progressInfo.maxAttempts;
                        },
                        3 // 重试3次
                    );

                    if (downloadResult.success) {
                        downloadProgress.value.status = "success";
                        ElMessage.success(downloadResult.message);

                        // 清空选择
                        selectedRecords.value = [];
                        fileTableRef.value?.clearSelection();

                        // 3秒后隐藏进度条和清除ZIP信息
                        setTimeout(() => {
                            downloadProgress.value.visible = false;
                            lastZipInfo.value = null;
                        }, 3000);
                    } else {
                        downloadProgress.value.status = "error";
                        ElMessage.warning(
                            `下载失败：${downloadResult.message}，请点击'手动下载ZIP'按钮重试`
                        );

                        // 5秒后隐藏进度条
                        setTimeout(() => {
                            downloadProgress.value.visible = false;
                        }, 5000);
                    }
                } else {
                    ElMessage.error(createResult.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    console.error("批量下载失败:", error);
                    ElMessage.error("批量下载失败");
                }
            } finally {
                batchDownloading.value = false;
            }
        };

        // 处理单个文件下载
        const handleSingleDownload = async (row) => {
            if (!props.currentPlugin) {
                ElMessage.warning("请先选择插件");
                return;
            }

            if (!row._id) {
                ElMessage.warning("文件记录ID缺失，无法下载");
                return;
            }

            try {
                ElMessage.info("开始下载文件...");

                const downloadResult = await downloadSingleFile(
                    props.currentPlugin.plugin_id,
                    row._id
                );

                if (downloadResult.success) {
                    ElMessage.success(downloadResult.message);
                } else {
                    ElMessage.error(downloadResult.message);
                }
            } catch (error) {
                console.error("单个文件下载失败:", error);
                ElMessage.error("文件下载失败");
            }
        };

        // 手动下载ZIP文件
        const handleManualDownload = async () => {
            if (!lastZipInfo.value) {
                ElMessage.warning("没有可下载的ZIP文件");
                return;
            }

            try {
                // 使用request.js下载，自动处理access-token认证
                const downloadResult = await downloadZipSimple(
                    lastZipInfo.value.pluginId,
                    lastZipInfo.value.zipFilename
                );

                if (downloadResult.success) {
                    ElMessage.success("手动下载已启动");
                    // 清除ZIP信息
                    setTimeout(() => {
                        lastZipInfo.value = null;
                    }, 5000);
                } else {
                    ElMessage.error(`下载失败：${downloadResult.message}`);
                }
            } catch (error) {
                console.error("手动下载失败:", error);
                ElMessage.error("手动下载失败");
            }
        };

        // 新窗口下载ZIP文件
        const handleNewWindowDownload = async () => {
            if (!lastZipInfo.value) {
                ElMessage.warning("没有可下载的ZIP文件");
                return;
            }

            try {
                // 使用request.js下载，自动处理access-token认证
                const downloadResult = await downloadZipInNewWindow(
                    lastZipInfo.value.pluginId,
                    lastZipInfo.value.zipFilename
                );

                if (downloadResult.success) {
                    ElMessage.success(downloadResult.message);
                    // 清除ZIP信息
                    setTimeout(() => {
                        lastZipInfo.value = null;
                    }, 5000);
                } else {
                    ElMessage.error(`下载失败：${downloadResult.message}`);
                }
            } catch (error) {
                console.error("新窗口下载失败:", error);
                ElMessage.error("新窗口下载失败");
            }
        };

        // 搜索处理
        const handleSearch = () => {
            // 这里可以实现客户端搜索或者重新请求服务器
            currentPage.value = 1;
            loadFileRecords();
        };

        // 筛选处理
        const handleFilter = () => {
            currentPage.value = 1;
            loadFileRecords();
        };

        // 刷新
        const handleRefresh = () => {
            loadFileRecords();
        };

        // 重置失败记录
        const handleResetFailed = async () => {
            if (!props.currentPlugin) return;

            try {
                await ElMessageBox.confirm(
                    `确定要重置插件"${props.currentPlugin.plugin_name}"的失败下载记录吗？`,
                    "重置失败记录",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                resetting.value = true;
                const result = await resetFailedRecords(
                    props.currentPlugin.plugin_id
                );

                if (result.success) {
                    ElMessage.success(
                        `成功重置 ${result.data.reset_count || 0} 条失败记录`
                    );
                    loadFileRecords(); // 刷新列表
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    console.error("重置失败记录失败:", error);
                    ElMessage.error("重置失败记录失败");
                }
            } finally {
                resetting.value = false;
            }
        };

        // 分页处理
        const handleSizeChange = (newSize) => {
            pageSize.value = newSize;
            currentPage.value = 1;
            loadFileRecords();
        };

        const handleCurrentChange = (newPage) => {
            currentPage.value = newPage;
            loadFileRecords();
        };

        // 获取文件类型图标
        const getFileTypeIcon = (fileType) => {
            if (!fileType) return "Files";

            const type = fileType.toLowerCase();

            // PDF 文件
            if (type === "pdf") {
                return "Document";
            }

            // Word 文档
            if (["doc", "docx"].includes(type)) {
                return "Edit";
            }

            // Excel 表格
            if (["xls", "xlsx", "csv"].includes(type)) {
                return "Grid";
            }

            // PowerPoint 演示文稿
            if (["ppt", "pptx"].includes(type)) {
                return "Present";
            }

            // 图片文件
            if (
                ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
                    type
                )
            ) {
                return "Picture";
            }

            // 视频文件
            if (
                ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(
                    type
                )
            ) {
                return "VideoPlay";
            }

            // 音频文件
            if (["mp3", "wav", "flac", "aac", "ogg"].includes(type)) {
                return "Headphones";
            }

            // 压缩文件
            if (["zip", "rar", "7z", "tar", "gz"].includes(type)) {
                return "Box";
            }

            // 文本文件
            if (["txt", "md", "log"].includes(type)) {
                return "Document";
            }

            // 代码文件
            if (
                [
                    "js",
                    "html",
                    "css",
                    "json",
                    "xml",
                    "py",
                    "java",
                    "c",
                    "cpp",
                ].includes(type)
            ) {
                return "Code";
            }

            // 默认文件图标
            return "Files";
        };

        // 获取文件类型颜色
        const getFileTypeColor = (fileType) => {
            if (!fileType) return "#909399";

            const type = fileType.toLowerCase();

            // PDF - 红色
            if (type === "pdf") {
                return "#f56c6c";
            }

            // Word - 蓝色
            if (["doc", "docx"].includes(type)) {
                return "#409eff";
            }

            // Excel - 绿色
            if (["xls", "xlsx", "csv"].includes(type)) {
                return "#67c23a";
            }

            // PowerPoint - 橙色
            if (["ppt", "pptx"].includes(type)) {
                return "#e6a23c";
            }

            // 图片 - 绿色
            if (
                ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
                    type
                )
            ) {
                return "#67c23a";
            }

            // 视频 - 紫色
            if (
                ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(
                    type
                )
            ) {
                return "#9c27b0";
            }

            // 音频 - 青色
            if (["mp3", "wav", "flac", "aac", "ogg"].includes(type)) {
                return "#00bcd4";
            }

            // 压缩文件 - 黄色
            if (["zip", "rar", "7z", "tar", "gz"].includes(type)) {
                return "#ff9500";
            }

            // 文本文件 - 灰色
            if (["txt", "md", "log"].includes(type)) {
                return "#606266";
            }

            // 代码文件 - 深蓝色
            if (
                [
                    "js",
                    "html",
                    "css",
                    "json",
                    "xml",
                    "py",
                    "java",
                    "c",
                    "cpp",
                ].includes(type)
            ) {
                return "#304156";
            }

            // 默认颜色
            return "#909399";
        };

        // 格式化文件大小
        const formatFileSize = (bytes) => {
            if (!bytes) return "-";
            if (bytes < 1024) return bytes + " B";
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
            if (bytes < 1024 * 1024 * 1024)
                return (bytes / (1024 * 1024)).toFixed(1) + " MB";
            return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
        };

        // 截断文本显示（通用方法）
        const truncateText = (text, maxLength = 50) => {
            if (!text) return "";
            return text.length > maxLength
                ? text.substring(0, maxLength - 3) + "..."
                : text;
        };

        // 截断URL显示（保留兼容性）
        const truncateUrl = (url) => {
            if (!url) return "-";
            return url.length > 50 ? url.substring(0, 47) + "..." : url;
        };

        // 进度显示相关方法
        const getProgressStatusIcon = () => {
            switch (downloadProgress.value.status) {
                case "downloading":
                    return "Loading";
                case "success":
                    return "Check";
                case "error":
                    return "Close";
                default:
                    return "Download";
            }
        };

        const getProgressStatusColor = () => {
            switch (downloadProgress.value.status) {
                case "downloading":
                    return "#409eff";
                case "success":
                    return "#67c23a";
                case "error":
                    return "#f56c6c";
                default:
                    return "#909399";
            }
        };

        const getProgressStatusText = () => {
            switch (downloadProgress.value.status) {
                case "downloading":
                    return "下载中...";
                case "success":
                    return "下载完成";
                case "error":
                    return "下载失败";
                default:
                    return "准备下载";
            }
        };

        const getProgressType = () => {
            switch (downloadProgress.value.status) {
                case "success":
                    return "success";
                case "error":
                    return "exception";
                default:
                    return "";
            }
        };

        return {
            fileTableRef,
            records,
            selectedRecords,
            loading,
            batchDownloading,
            resetting,
            searchText,
            filterStatus,
            filterType,
            currentPage,
            pageSize,
            total,
            lastZipInfo,
            downloadProgress,
            checkSelectable,
            getRowClassName,
            handleSelectionChange,
            handleBatchDownload,
            handleSingleDownload,
            handleManualDownload,
            handleNewWindowDownload,
            handleSearch,
            handleFilter,
            handleRefresh,
            handleResetFailed,
            handleSizeChange,
            handleCurrentChange,
            getFileTypeIcon,
            getFileTypeColor,
            formatFileSize,
            truncateText,
            truncateUrl,
            getProgressStatusIcon,
            getProgressStatusColor,
            getProgressStatusText,
            getProgressType,
        };
    },
};
</script>

<style scoped>
.file-records-card {
    height: 100%;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
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
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.count-tag {
    background: #ecf5ff;
    color: #409eff;
    border: none;
    border-radius: 12px;
}

.rounded-button {
    border-radius: 8px;
}

.search-section {
    margin-bottom: 16px;
}

.search-input {
    border-radius: 8px;
}

.filter-select {
    width: 100%;
    border-radius: 8px;
}

.table-container {
    margin-bottom: 16px;
}

.files-table {
    border-radius: 8px;
    overflow: hidden;
}

.file-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-info {
    flex: 1;
    min-width: 0;
}

.file-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}

.file-name-multiline {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 1.4;
    max-height: 3.6em; /* 约2.5行的高度 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.file-type {
    font-size: 12px;
    color: #909399;
}

.file-size {
    font-family: "Courier New", monospace;
    font-size: 13px;
    color: #606266;
}

.file-path {
    font-size: 13px;
    color: #606266;
    font-family: "Courier New", monospace;
}

.file-path-truncated {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.download-url {
    font-size: 13px;
    color: #606266;
    font-family: "Courier New", monospace;
}

.download-url-truncated {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.empty-state {
    padding: 40px 0;
    text-align: center;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.pagination {
    background: transparent;
}

/* 下载进度样式 */
.download-progress-content {
    padding: 20px 0;
}

.progress-info {
    margin-bottom: 20px;
}

.progress-status {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.status-text {
    font-size: 16px;
    font-weight: 500;
}

.progress-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #606266;
}

.size-info {
    font-family: "Courier New", monospace;
}

.attempt-info {
    color: #909399;
}

.progress-tips {
    margin-top: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
}

.progress-tips p {
    margin: 0;
    margin-bottom: 4px;
}

.progress-tips p:last-child {
    margin-bottom: 0;
}

/* 不可选行的样式 */
.files-table :deep(.row-not-selectable) {
    background-color: #fafafa !important;
    opacity: 0.6;
    cursor: not-allowed;
}

.files-table :deep(.row-not-selectable:hover) {
    background-color: #fafafa !important;
}

.files-table :deep(.row-not-selectable .el-checkbox) {
    cursor: not-allowed;
}

.files-table
    :deep(
        .row-not-selectable .el-checkbox__input.is-disabled .el-checkbox__inner
    ) {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
}

.files-table :deep(.row-not-selectable td) {
    color: #c0c4cc;
}
</style>
