<template>
    <div class="plugins-page">
        <div class="page-container">
            <!-- 页面标题 -->
            <div class="page-header">
                <div class="header-left">
                    <h1 class="page-title">采集插件</h1>
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
                <!-- 左侧插件列表区域 -->
                <div class="left-section">
                    <!-- 插件列表 -->
                    <div class="plugins-list-section">
                        <PluginsList />
                    </div>

                    <!-- 采集性能分析 -->
                    <div class="performance-chart-section">
                        <PerformanceChart />
                    </div>
                </div>

                <!-- 右侧卡片区域 -->
                <div class="right-cards-section">
                    <!-- 插件运行状态卡片 -->
                    <div class="status-chart-wrapper">
                        <PluginStatusChart />
                    </div>

                    <!-- 文档管理卡片 -->
                    <div class="document-card-wrapper">
                        <DocumentCard />
                    </div>
                </div>
            </div>
            <!-- 最近采集数据 -->
            <div class="recent-collection-section">
                <RecentCollectionData />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import StatsCard from "./components/StatsCard.vue";
import PerformanceChart from "./components/PerformanceChart.vue";
import RecentCollectionData from "./components/RecentCollectionData.vue";
import PluginsList from "./components/PluginsList.vue";
import PluginStatusChart from "./components/PluginStatusChart.vue";
import DocumentCard from "./components/DocumentCard.vue";

export default {
    name: "PluginsPage",
    components: {
        StatsCard,
        PerformanceChart,
        RecentCollectionData,
        PluginsList,
        PluginStatusChart,
        DocumentCard,
    },
    setup() {
        const statsData = ref([
            {
                title: "活跃插件",
                value: "16",
                icon: "Download",
                color: "#4285f4",
                trend: "全部正在运行",
                subtitle: "",
            },
            {
                title: "今日采集",
                value: "248",
                icon: "DataBoard",
                color: "#34a853",
                trend: "较昨日增长12%",
                subtitle: "",
            },
            {
                title: "文档数量",
                value: "1,296",
                icon: "Document",
                color: "#4285f4",
                trend: "已分类管理",
                subtitle: "",
            },
            {
                title: "采集状态",
                value: "100%",
                icon: "TrendCharts",
                color: "#fbbc04",
                trend: "2个源略有故障",
                subtitle: "",
            },
        ]);

        return {
            statsData,
        };
    },
};
</script>

<style scoped>
.plugins-page {
    min-height: 100vh;
    background: #f5f6fa;
}

.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

.page-header {
    margin-bottom: 24px;
}

.header-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2329;
    margin: 0;
}

.stats-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 24px;
}

.main-content-area {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    align-items: stretch;
}

.left-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.plugins-list-section {
    min-height: 600px;
}

.performance-chart-section {
    width: 100%;
}

.right-cards-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}

.status-chart-wrapper {
    width: 100%;
}

.document-card-wrapper {
    width: 100%;
    flex: 1;
}

.recent-collection-section {
    margin-top: 24px;
    width: 100%;
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

    .right-cards-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
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

    .right-cards-section {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .recent-collection-section {
        margin-top: 16px;
    }
}

@media (max-width: 480px) {
    .page-container {
        padding: 12px;
    }

    .recent-collection-section {
        margin-top: 12px;
    }
}
</style>
