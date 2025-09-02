<template>
    <div class="analytics-page">
        <div class="page-container">
            <!-- 状态卡片区域 -->
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

            <!-- 图表区域 -->
            <div class="charts-grid">
                <!-- 采集趋势分析 -->
                <div class="trend-chart">
                    <CollectionTrendChart />
                </div>

                <!-- 采集来源分布 -->
                <div class="source-chart">
                    <SourceDistributionChart />
                </div>
            </div>

            <!-- 分析区域 -->
            <div class="analysis-grid">
                <!-- 采集性能分析 -->
                <div class="performance-chart">
                    <PerformanceChart />
                </div>

                <!-- 数据质量分析 -->
                <div class="quality-chart">
                    <QualityAnalysisChart />
                </div>
            </div>

            <!-- 异常记录区域 -->
            <div class="abnormal-records">
                <RecentAbnormalRecords />
            </div>
        </div>
    </div>
</template>

<script>
import StatsCard from "./components/StatsCard.vue";
import CollectionTrendChart from "./components/CollectionTrendChart.vue";
import SourceDistributionChart from "./components/SourceDistributionChart.vue";
import PerformanceChart from "../PluginsPage/components/PerformanceChart.vue";
import QualityAnalysisChart from "./components/QualityAnalysisChart.vue";
import RecentAbnormalRecords from "./components/RecentAbnormalRecords.vue";

export default {
    name: "AnalyticsPage",
    components: {
        StatsCard,
        CollectionTrendChart,
        SourceDistributionChart,
        PerformanceChart,
        QualityAnalysisChart,
        RecentAbnormalRecords,
    },
    setup() {
        const statsData = [
            {
                title: "总采集量",
                value: "86,432",
                icon: "Document",
                color: "#4285f4",
                trend: "较昨日增长15%",
                subtitle: "",
            },
            {
                title: "平均响应时间",
                value: "128ms",
                icon: "Timer",
                color: "#ea4335",
                trend: "较昨日下降5%",
                subtitle: "",
            },
            {
                title: "采集成功率",
                value: "98.7%",
                icon: "Check",
                color: "#34a853",
                trend: "正在运行",
                subtitle: "",
            },
            {
                title: "异常数据",
                value: "124",
                icon: "WarningFilled",
                color: "#ff9500",
                trend: "较昨日减少8%",
                subtitle: "",
            },
        ];

        return {
            statsData,
        };
    },
};
</script>

<style scoped>
.analytics-page {
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

.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

.analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

.abnormal-records {
    margin-bottom: 24px;
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

    .charts-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .analysis-grid {
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

    .charts-grid,
    .analysis-grid {
        gap: 16px;
    }
}

@media (max-width: 480px) {
    .page-container {
        padding: 12px;
    }
}
</style>
