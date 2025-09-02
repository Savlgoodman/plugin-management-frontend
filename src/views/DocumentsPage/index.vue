<template>
    <div class="documents-page">
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
                <!-- 左侧文档分类区域 -->
                <div class="left-section">
                    <DocumentCategories
                        @category-change="handleCategoryChange"
                    />
                </div>

                <!-- 右侧文档列表区域 -->
                <div class="right-section">
                    <DocumentsList ref="documentsListRef" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import StatsCard from "./components/StatsCard.vue";
import DocumentCategories from "./components/DocumentCategories.vue";
import DocumentsList from "./components/DocumentsList.vue";
// getStatsData 已从API中移除，因为后端不再提供统计卡片数据

export default {
    name: "DocumentsPage",
    components: {
        StatsCard,
        DocumentCategories,
        DocumentsList,
    },
    setup() {
        const documentsListRef = ref(null);

        // 统计卡片数据暂时从组件内部获取，因为后端不再提供统计API
        const statsData = ref([
            {
                title: "总文档数",
                value: "0",
                icon: "Document",
                color: "#4285f4",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "本周新增",
                value: "0",
                icon: "Plus",
                color: "#34a853",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "文档分类",
                value: "0",
                icon: "Grid",
                color: "#ff9500",
                trend: "数据加载中...",
                subtitle: "",
            },
            {
                title: "下载次数",
                value: "0",
                icon: "Download",
                color: "#5856d6",
                trend: "数据加载中...",
                subtitle: "",
            },
        ]);

        const handleCategoryChange = (data) => {
            // 处理分类切换，传递表名给文档列表组件
            console.log("Selected category:", data);
            documentsListRef.value?.handleCategoryChange(data);
        };

        return {
            documentsListRef,
            statsData,
            handleCategoryChange,
        };
    },
};
</script>

<style scoped>
.documents-page {
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
