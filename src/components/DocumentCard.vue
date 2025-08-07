<template>
    <div class="document-card">
        <div class="card-header">
            <div class="header-title">文档管理</div>
            <el-button type="primary" text size="small" @click="viewAllDocs">
                查看全部
            </el-button>
        </div>

        <div class="card-content">
            <div
                v-for="doc in documentList"
                :key="doc.id"
                class="doc-item"
                @click="handleDocClick(doc)"
            >
                <div
                    class="doc-icon"
                    :style="{ backgroundColor: doc.iconColor }"
                >
                    <el-icon>
                        <component :is="doc.icon" />
                    </el-icon>
                </div>
                <div class="doc-info">
                    <div class="doc-title">{{ doc.title }}</div>
                    <div class="doc-meta">
                        <span class="doc-date">{{ doc.date }}</span>
                        <span class="doc-downloads">
                            <el-icon><Download /></el-icon>
                            {{ doc.downloads }}
                        </span>
                    </div>
                </div>
                <el-icon class="doc-arrow"><ArrowRight /></el-icon>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";

export default {
    name: "DocumentCard",
    setup() {
        const documentList = ref([
            {
                id: 1,
                title: "交通行业安全政策汇总2023",
                date: "2023-06-15",
                downloads: "32万下载",
                icon: "Document",
                iconColor: "#4285f4",
            },
            {
                id: 2,
                title: "数据采集规范与标准指南",
                date: "2023-06-10",
                downloads: "18万下载",
                icon: "DataBoard",
                iconColor: "#34a853",
            },
            {
                id: 3,
                title: "系统运维操作手册V2.1",
                date: "2023-06-08",
                downloads: "25万下载",
                icon: "Setting",
                iconColor: "#fbbc04",
            },
            {
                id: 4,
                title: "插件开发API文档",
                date: "2023-06-05",
                downloads: "12万下载",
                icon: "Grid",
                iconColor: "#ea4335",
            },
            {
                id: 5,
                title: "数据分析报告模板",
                date: "2023-06-01",
                downloads: "9万下载",
                icon: "TrendCharts",
                iconColor: "#9c27b0",
            },
        ]);

        const handleDocClick = (doc) => {
            ElMessage.info(`打开文档: ${doc.title}`);
        };

        const viewAllDocs = () => {
            ElMessage.info("跳转到文档管理页面...");
        };

        return {
            documentList,
            handleDocClick,
            viewAllDocs,
        };
    },
};
</script>

<style scoped>
.document-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.3s ease;
}

.document-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: #d1d5db;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
    margin-bottom: 16px;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.card-content {
    padding: 0 20px 20px 20px;
}

.doc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
    margin-bottom: 8px;
}

.doc-item:last-child {
    margin-bottom: 0;
}

.doc-item:hover {
    background: #f7f8fa;
}

.doc-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    flex-shrink: 0;
}

.doc-info {
    flex: 1;
    min-width: 0;
}

.doc-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
}

.doc-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #86909c;
    line-height: 1.2;
}

.doc-date {
    flex-shrink: 0;
}

.doc-downloads {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.doc-arrow {
    color: #c9cdd4;
    font-size: 14px;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.doc-item:hover .doc-arrow {
    color: #4285f4;
    transform: translateX(2px);
}

@media (max-width: 768px) {
    .card-header {
        padding: 16px 16px 0 16px;
        margin-bottom: 12px;
    }

    .card-content {
        padding: 0 16px 16px 16px;
    }

    .header-title {
        font-size: 14px;
    }

    .doc-item {
        padding: 8px;
    }

    .doc-icon {
        width: 32px;
        height: 32px;
        font-size: 16px;
    }

    .doc-title {
        font-size: 13px;
    }

    .doc-meta {
        font-size: 11px;
        gap: 8px;
    }
}
</style>
