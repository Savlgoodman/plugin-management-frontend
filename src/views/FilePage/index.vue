<template>
    <div class="file-page">
        <div class="page-container">
            <!-- 页面标题 -->
            <div class="page-header">
                <div class="header-left">
                    <div class="breadcrumb">
                        <el-icon class="breadcrumb-icon"><Files /></el-icon>
                        <span class="breadcrumb-item">文件管理</span>
                    </div>
                    <h1 class="page-title">文件下载管理中心</h1>
                    <div class="page-subtitle">
                        统一管理所有插件的文件下载，支持批量下载和任务监控
                    </div>
                </div>
                <div class="header-right">
                    <el-button type="primary" @click="showConvertModal = true">
                        <el-icon><Plus /></el-icon>
                        转换插件
                    </el-button>
                    <el-button type="success" @click="showTaskModal = true">
                        <el-icon><Setting /></el-icon>
                        任务管理
                    </el-button>
                </div>
            </div>

            <!-- 数据展示卡片 -->
            <div class="stats-grid">
                <StatsCard
                    v-for="stat in statsData"
                    :key="stat.title"
                    :title="stat.title"
                    :value="stat.value"
                    :icon="stat.icon"
                    :color="stat.color"
                    :trend="stat.trend"
                    :subtitle="stat.subtitle"
                />
            </div>

            <!-- 主要内容区域 -->
            <div class="main-content-area">
                <!-- 左侧插件分类区域 -->
                <div class="left-section">
                    <PluginCategories
                        @plugin-change="handlePluginChange"
                        @convert-plugin="showConvertModal = true"
                        @manage-tasks="showTaskModal = true"
                    />
                </div>

                <!-- 右侧文件记录区域 -->
                <div class="right-section">
                    <FileRecordsList
                        :current-plugin="currentPlugin"
                        ref="fileRecordsRef"
                    />
                </div>
            </div>
        </div>

        <!-- 插件转换模态框 -->
        <PluginConvertModal
            v-model="showConvertModal"
            @success="handleConvertSuccess"
        />

        <!-- 下载任务管理模态框 -->
        <DownloadTaskModal v-model="showTaskModal" />
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import StatsCard from "./components/StatsCard.vue";
import PluginCategories from "./components/PluginCategories.vue";
import FileRecordsList from "./components/FileRecordsList.vue";
import PluginConvertModal from "./components/PluginConvertModal.vue";
import DownloadTaskModal from "./components/DownloadTaskModal.vue";
import { getDownloadablePlugins } from "./api/files";
// 暂时注释掉下载进度接口
// import { getDownloadingPlugins } from "./api/files";

export default {
    name: "FilePage",
    components: {
        StatsCard,
        PluginCategories,
        FileRecordsList,
        PluginConvertModal,
        DownloadTaskModal,
    },
    setup() {
        const currentPlugin = ref(null);
        const showConvertModal = ref(false);
        const showTaskModal = ref(false);
        const fileRecordsRef = ref(null);

        // 统计数据
        const statsData = ref([
            {
                title: "可下载插件",
                value: "0",
                icon: "FolderOpened",
                color: "#4285f4",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "已配置插件",
                value: "0",
                icon: "Setting",
                color: "#34a853",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "下载中任务",
                value: "0",
                icon: "Download",
                color: "#ff9500",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "总文件数",
                value: "0",
                icon: "Files",
                color: "#9c27b0",
                trend: "数据加载中...",
                subtitle: "",
            },
        ]);

        // 加载统计数据
        const loadStatsData = async () => {
            try {
                // 暂时只加载可下载插件数据
                const downloadableResult = await getDownloadablePlugins();
                // 暂时注释掉下载中插件数据
                // const downloadingResult = await getDownloadingPlugins();

                if (downloadableResult.success) {
                    const data = downloadableResult.data;

                    // 更新统计卡片数据
                    statsData.value[0].value = data.total || 0;
                    statsData.value[0].trend = `共 ${
                        data.total || 0
                    } 个可下载插件`;

                    statsData.value[1].value = data.configured_count || 0;
                    statsData.value[1].trend = `${
                        data.configured_count || 0
                    } 个已配置下载`;

                    statsData.value[2].value = data.downloading_count || 0;
                    statsData.value[2].trend = `${
                        data.downloading_count || 0
                    } 个正在下载`;

                    // 计算总文件数
                    const totalFiles = (data.plugins || []).reduce(
                        (sum, plugin) => {
                            return sum + (plugin.record_count || 0);
                        },
                        0
                    );
                    statsData.value[3].value = totalFiles;
                    statsData.value[3].trend = `总计 ${totalFiles} 个文件`;
                }

                // 暂时注释掉下载中数据的处理
                // if (downloadingResult.success) {
                //     const downloadingCount =
                //         downloadingResult.data.total_downloading || 0;
                //     statsData.value[2].value = downloadingCount;
                //     statsData.value[2].trend = `${downloadingCount} 个正在下载`;
                // }
            } catch (error) {
                console.error("加载统计数据失败:", error);
            }
        };

        // 处理插件变化
        const handlePluginChange = ({ pluginId, plugin }) => {
            currentPlugin.value = plugin;
        };

        // 处理转换成功
        const handleConvertSuccess = () => {
            // 刷新插件列表和统计数据
            loadStatsData();
            ElMessage.success("插件转换成功，请刷新页面查看最新数据");
        };

        onMounted(() => {
            loadStatsData();
        });

        return {
            currentPlugin,
            showConvertModal,
            showTaskModal,
            fileRecordsRef,
            statsData,
            handlePluginChange,
            handleConvertSuccess,
        };
    },
};
</script>

<style scoped>
.file-page {
    min-height: 100vh;
    background: #f5f6fa;
}

.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
}

.header-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4285f4;
    font-size: 14px;
    font-weight: 500;
}

.breadcrumb-icon {
    font-size: 16px;
}

.breadcrumb-item {
    color: #4285f4;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #1f2329;
    margin: 0;
    line-height: 1.2;
}

.page-subtitle {
    font-size: 16px;
    color: #86909c;
    line-height: 1.5;
    margin-top: 4px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}

.main-content-area {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 24px;
    align-items: stretch;
    width: 100%;
    max-width: 100%;
    overflow: hidden; /* 防止子元素撑开容器 */
}

.left-section {
    width: 100%;
    min-width: 0; /* 允许收缩 */
}

.right-section {
    width: 100%;
    min-width: 0; /* 允许收缩，防止内容撑开 */
    max-width: 100%; /* 严格限制最大宽度 */
    overflow: hidden; /* 防止内容溢出 */
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .page-container {
        max-width: 100%;
        padding: 20px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .main-content-area {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .page-container {
        padding: 16px;
    }

    .page-header {
        margin-bottom: 24px;
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .page-title {
        font-size: 24px;
    }

    .page-subtitle {
        font-size: 14px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .main-content-area {
        gap: 16px;
    }
}

@media (max-width: 480px) {
    .page-container {
        padding: 12px;
    }
}
</style>
