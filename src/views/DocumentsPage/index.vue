<template>
    <div class="documents-page">
        <div class="page-container">
            <!-- 页面标题 -->
            <div class="page-header">
                <div class="header-left">
                    <div class="breadcrumb">
                        <el-icon class="breadcrumb-icon"><Document /></el-icon>
                        <span class="breadcrumb-item">文档管理</span>
                    </div>
                    <h1 class="page-title">文档管理中心</h1>
                    <div class="page-subtitle">
                        统一管理所有采集文档，支持分类查看和快速检索
                    </div>
                </div>
                <div class="header-right">
                    <el-button type="primary" @click="handleUploadDocument">
                        <el-icon><Upload /></el-icon>
                        上传文档
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
import StatsCard from "../PluginsPage/components/StatsCard.vue"; // 复用插件页面的统计卡片
import DocumentCategories from "./components/DocumentCategories.vue";
import DocumentsList from "./components/DocumentsList.vue";

export default {
    name: "DocumentsPage",
    components: {
        StatsCard,
        DocumentCategories,
        DocumentsList,
    },
    setup() {
        const documentsListRef = ref(null);

        const statsData = ref([
            {
                title: "总文档数",
                value: "1,296",
                icon: "Document",
                color: "#4285f4",
                trend: "已分类管理",
                subtitle: "",
            },
            {
                title: "本周新增",
                value: "48",
                icon: "Plus",
                color: "#34a853",
                trend: "较上周增长15%",
                subtitle: "",
            },
            {
                title: "文档分类",
                value: "16",
                icon: "Grid",
                color: "#ff9500",
                trend: "16个插件分类",
                subtitle: "",
            },
            {
                title: "下载次数",
                value: "3,842",
                icon: "Download",
                color: "#5856d6",
                trend: "今日下载124次",
                subtitle: "",
            },
        ]);

        const handleUploadDocument = () => {
            ElMessage.success("上传文档功能开发中...");
        };

        const handleCategoryChange = (categoryId) => {
            // 处理分类切换，可以传递给文档列表组件进行筛选
            console.log("Selected category:", categoryId);
            // 这里可以实现分类和列表的联动
        };

        return {
            documentsListRef,
            statsData,
            handleUploadDocument,
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
}

.left-section {
    width: 100%;
}

.right-section {
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
