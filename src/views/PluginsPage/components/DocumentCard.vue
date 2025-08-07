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
                title: "数据采集报告",
                date: "2024-01-15",
                downloads: 128,
                icon: "Document",
                iconColor: "#4285f4",
            },
            {
                id: 2,
                title: "插件配置指南",
                date: "2024-01-14",
                downloads: 89,
                icon: "Setting",
                iconColor: "#34a853",
            },
            {
                id: 3,
                title: "系统架构文档",
                date: "2024-01-13",
                downloads: 156,
                icon: "Files",
                iconColor: "#fbbc04",
            },
            {
                id: 4,
                title: "API接口文档",
                date: "2024-01-12",
                downloads: 203,
                icon: "Connection",
                iconColor: "#ea4335",
            },
        ]);

        const viewAllDocs = () => {
            ElMessage.success("跳转到文档页面...");
        };

        const handleDocClick = (doc) => {
            ElMessage.info(`打开文档: ${doc.title}`);
        };

        return {
            documentList,
            viewAllDocs,
            handleDocClick,
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
    padding: 20px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.card-content {
    padding: 20px;
}

.doc-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 8px;
}

.doc-item:last-child {
    margin-bottom: 0;
}

.doc-item:hover {
    background: #f5f6fa;
}

.doc-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 12px;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.doc-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #86909c;
}

.doc-date {
    white-space: nowrap;
}

.doc-downloads {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.doc-arrow {
    color: #c9cdd4;
    font-size: 14px;
    margin-left: 8px;
    transition: all 0.2s ease;
}

.doc-item:hover .doc-arrow {
    color: #4285f4;
    transform: translateX(2px);
}

@media (max-width: 768px) {
    .card-header {
        padding: 16px 16px 0 16px;
    }

    .card-content {
        padding: 16px;
    }

    .header-title {
        font-size: 14px;
    }

    .doc-item {
        padding: 10px;
    }

    .doc-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}
</style> 