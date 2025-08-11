<template>
    <div class="recent-collection-card">
        <div class="card-header">
            <div class="header-left">
                <div class="header-title">
                    <el-icon class="header-icon"><Clock /></el-icon>
                    最近采集数据
                </div>
                <div class="header-subtitle">
                    查看最近从各数据源采集的最新信息
                </div>
            </div>
            <div class="header-actions">
                <el-button
                    type="primary"
                    text
                    size="small"
                    @click="refreshData"
                >
                    <el-icon><Refresh /></el-icon>
                    刷新
                </el-button>
            </div>
        </div>

        <div class="card-content">
            <div class="data-grid">
                <div
                    v-for="item in displayData"
                    :key="item.id"
                    class="data-item"
                    @click="viewDetails(item)"
                >
                    <!-- 数据源图标和信息 -->
                    <div class="data-source">
                        <div
                            class="source-icon"
                            :style="{ backgroundColor: item.iconColor }"
                        >
                            <el-icon>
                                <component :is="item.icon" />
                            </el-icon>
                        </div>
                        <div class="source-info">
                            <div class="source-name">{{ item.sourceName }}</div>
                            <div class="collection-time">
                                {{ item.collectionTime }}
                            </div>
                        </div>
                    </div>

                    <!-- 数据类型标签 -->
                    <div class="data-type">
                        <el-tag
                            :type="item.tagType"
                            effect="light"
                            size="small"
                        >
                            {{ item.dataType }}
                        </el-tag>
                    </div>

                    <!-- 数据标题和描述 -->
                    <div class="data-content">
                        <div class="data-title">{{ item.title }}</div>
                        <div class="data-description">
                            {{ item.description }}
                        </div>
                    </div>

                    <!-- 操作区域 -->
                    <div class="data-actions">
                        <div class="action-tags">
                            <el-tag
                                v-for="tag in item.tags"
                                :key="tag.name"
                                :type="tag.type"
                                size="small"
                                effect="plain"
                            >
                                {{ tag.name }}
                            </el-tag>
                        </div>
                        <el-button
                            type="primary"
                            text
                            size="small"
                            @click.stop="viewDetails(item)"
                        >
                            查看详情
                            <el-icon><ArrowRight /></el-icon>
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 展开/收起控制 -->
            <div
                class="expand-control"
                v-if="recentData.length > defaultShowCount"
            >
                <el-button type="primary" text @click="toggleExpand">
                    {{
                        isExpanded
                            ? "收起"
                            : `展开更多 (${
                                  recentData.length - defaultShowCount
                              })`
                    }}
                    <el-icon>
                        <component :is="isExpanded ? 'ArrowUp' : 'ArrowDown'" />
                    </el-icon>
                </el-button>
            </div>

            <!-- 加载更多 -->
            <div class="load-more" v-if="isExpanded && hasMore">
                <el-button
                    type="primary"
                    text
                    @click="loadMore"
                    :loading="loading"
                >
                    加载更多数据
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { getRecentCollectionData } from "../api/plugins.js";

export default {
    name: "RecentCollectionData",
    setup() {
        const loading = ref(false);
        const hasMore = ref(true);
        const isExpanded = ref(false);
        const defaultShowCount = 3; // 默认显示3个项目，在一行展示
        const recentData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);

        // 计算显示的数据
        const displayData = computed(() => {
            if (isExpanded.value) {
                return recentData.value;
            } else {
                return recentData.value.slice(0, defaultShowCount);
            }
        });

        // 加载数据
        const loadData = async () => {
            try {
                const params = {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                };
                const response = await getRecentCollectionData(params);
                recentData.value = response.data.list;
            } catch (error) {
                ElMessage.error("获取最近采集数据失败");
            }
        };

        const toggleExpand = () => {
            isExpanded.value = !isExpanded.value;
        };

        const refreshData = async () => {
            loading.value = true;
            ElMessage.info("正在刷新最近采集数据...");
            await loadData();
            loading.value = false;
            ElMessage.success("数据刷新完成");
        };

        const loadMore = async () => {
            loading.value = true;
            currentPage.value++;
            try {
                const params = {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                };
                const response = await getRecentCollectionData(params);
                recentData.value.push(...response.data.list);

                if (recentData.value.length >= 10) {
                    hasMore.value = false;
                }

                ElMessage.success("已加载更多数据");
            } catch (error) {
                ElMessage.error("加载更多数据失败");
            } finally {
                loading.value = false;
            }
        };

        const viewDetails = (item) => {
            ElMessage.info(`查看详情: ${item.title}`);
        };

        // 初始化加载数据
        loadData();

        return {
            loading,
            hasMore,
            isExpanded,
            defaultShowCount,
            recentData,
            displayData,
            toggleExpand,
            refreshData,
            loadMore,
            viewDetails,
        };
    },
};
</script>

<style scoped>
.recent-collection-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.3s ease;
}

.recent-collection-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: #d1d5db;
}

.card-header {
    padding: 24px 24px 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: none;
}

.header-left {
    flex: 1;
}

.header-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    color: #409eff;
    font-size: 20px;
}

.header-subtitle {
    font-size: 14px;
    color: #86909c;
    line-height: 1.5;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card-content {
    padding: 24px;
}

.data-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.data-item {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.data-item:hover {
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #e5e6eb;
    transform: translateY(-2px);
}

.data-source {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.source-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    flex-shrink: 0;
}

.source-info {
    flex: 1;
    min-width: 0;
}

.source-name {
    font-size: 15px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 4px;
}

.collection-time {
    font-size: 12px;
    color: #86909c;
}

.data-type {
    margin-bottom: 12px;
}

.data-content {
    margin-bottom: 12px;
}

.data-title {
    font-size: 15px;
    font-weight: 500;
    color: #1f2329;
    line-height: 1.4;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.data-description {
    font-size: 13px;
    color: #4e5969;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.data-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.action-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    flex: 1;
}

.expand-control {
    text-align: center;
    padding: 16px 0;
    border-top: 1px solid #f2f3f5;
}

.load-more {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #f2f3f5;
}

@media (max-width: 768px) {
    .card-header {
        padding: 20px 20px 0 20px;
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .card-content {
        padding: 20px;
    }

    .data-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .data-item {
        padding: 14px;
    }

    .data-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .action-tags {
        justify-content: flex-start;
    }

    .header-title {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .header-title {
        font-size: 16px;
    }

    .data-grid {
        grid-template-columns: 1fr;
    }

    .data-item {
        padding: 12px;
    }
}
</style>
