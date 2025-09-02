<template>
    <div class="file-page">
        <div class="page-container">
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
