<template>
    <div class="recent-collection-card">
        <div class="card-header">
            <div class="header-left">
                <div class="header-title">
                    <el-icon class="header-icon"><Clock /></el-icon>
                    最近采集数据
                </div>
                <div class="header-subtitle">查看最近从各数据源采集的最新信息</div>
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
                            <div class="collection-time">{{ item.collectionTime }}</div>
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
                        <div class="data-description">{{ item.description }}</div>
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
            <div class="expand-control" v-if="recentData.length > defaultShowCount">
                <el-button 
                    type="primary" 
                    text 
                    @click="toggleExpand"
                >
                    {{ isExpanded ? '收起' : `展开更多 (${recentData.length - defaultShowCount})` }}
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

export default {
    name: "RecentCollectionData",
    setup() {
        const loading = ref(false);
        const hasMore = ref(true);
        const isExpanded = ref(false);
        const defaultShowCount = 3; // 默认显示3个项目，在一行展示

        // 模拟最近采集的数据
        const recentData = ref([
            {
                id: 1,
                sourceName: "交通运输部",
                collectionTime: "今天 09:24",
                icon: "Files",
                iconColor: "#4285f4",
                dataType: "政策文件",
                tagType: "primary",
                title: "关于进一步加强公路工程施工安全管理的通知",
                description: "为深入贯彻落实党中央、国务院关于安全生产工作的决策部署，切实加强公路工程施工安全管理，有效防范遏制重特大事故...",
                tags: [
                    { name: "安全管理", type: "success" },
                    { name: "施工规范", type: "info" }
                ]
            },
            {
                id: 2,
                sourceName: "安全与质量监管管理司",
                collectionTime: "今天 11:18",
                icon: "Warning",
                iconColor: "#f56c6c",
                dataType: "事故通报",
                tagType: "danger",
                title: "关于近期几起道路施工安全事故的通报",
                description: "近期，部分地区发生多起道路施工安全事故，造成人员伤亡和财产损失。为进一步加强道路施工安全管理，现将有关情况通报如下...",
                tags: [
                    { name: "事故通报", type: "danger" },
                    { name: "安全警示", type: "warning" }
                ]
            },
            {
                id: 3,
                sourceName: "交通运输部科学研究院",
                collectionTime: "今天 10:15",
                icon: "Document",
                iconColor: "#67c23a",
                dataType: "技术规范",
                tagType: "success",
                title: "公路工程智能化施工技术指南（2023版）",
                description: "为适应公路工程建设信息化发展要求，规范智能化施工技术的应用，提升工程建设质量和效率，制定本指南。本指南适用于新建、改建扩建的公路工程施工...",
                tags: [
                    { name: "技术规范", type: "success" },
                    { name: "智能化施工", type: "primary" }
                ]
            },
            {
                id: 4,
                sourceName: "综合规划司",
                collectionTime: "今天 08:45",
                icon: "DataBoard",
                iconColor: "#e6a23c",
                dataType: "统计数据",
                tagType: "warning",
                title: "2024年第一季度全国公路建设进展统计",
                description: "2024年第一季度，全国公路建设保持稳定增长态势，新开工项目152个，完工项目89个，累计完成投资2156.8亿元...",
                tags: [
                    { name: "统计数据", type: "warning" },
                    { name: "建设进展", type: "info" }
                ]
            },
            {
                id: 5,
                sourceName: "公路局",
                collectionTime: "昨天 16:30",
                icon: "Location",
                iconColor: "#909399",
                dataType: "工程信息",
                tagType: "info",
                title: "重点公路项目建设进展月报",
                description: "本月重点公路项目建设总体进展顺利，国道、省道改造升级项目按计划推进，高速公路新建项目土建工程完成度达到预期目标...",
                tags: [
                    { name: "工程信息", type: "info" },
                    { name: "进展月报", type: "primary" }
                ]
            },
            {
                id: 6,
                sourceName: "运输服务司",
                collectionTime: "昨天 14:22",
                icon: "Truck",
                iconColor: "#f89898",
                dataType: "服务通知",
                tagType: "primary",
                title: "关于优化货运车辆通行服务的通知",
                description: "为进一步优化货运车辆通行环境，提升物流效率，降低物流成本，现就有关事项通知如下...",
                tags: [
                    { name: "服务通知", type: "primary" },
                    { name: "货运服务", type: "success" }
                ]
            }
        ]);

        // 计算显示的数据
        const displayData = computed(() => {
            if (isExpanded.value) {
                return recentData.value;
            } else {
                return recentData.value.slice(0, defaultShowCount);
            }
        });

        const toggleExpand = () => {
            isExpanded.value = !isExpanded.value;
        };

        const refreshData = () => {
            loading.value = true;
            ElMessage.info("正在刷新最近采集数据...");
            
            setTimeout(() => {
                // 模拟刷新数据
                const newTime = new Date().toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                recentData.value.forEach(item => {
                    if (Math.random() > 0.5) {
                        item.collectionTime = `今天 ${newTime}`;
                    }
                });
                
                loading.value = false;
                ElMessage.success("数据刷新完成");
            }, 1500);
        };

        const loadMore = () => {
            loading.value = true;
            
            setTimeout(() => {
                // 模拟加载更多数据
                const moreData = [
                    {
                        id: recentData.value.length + 1,
                        sourceName: "质量监督局",
                        collectionTime: "昨天 12:15",
                        icon: "Medal",
                        iconColor: "#409eff",
                        dataType: "质量报告",
                        tagType: "primary",
                        title: "公路工程质量监督检查报告",
                        description: "对重点公路工程项目进行质量监督检查，总体质量状况良好...",
                        tags: [
                            { name: "质量报告", type: "primary" },
                            { name: "监督检查", type: "info" }
                        ]
                    }
                ];
                
                recentData.value.push(...moreData);
                loading.value = false;
                
                if (recentData.value.length >= 10) {
                    hasMore.value = false;
                }
                
                ElMessage.success("已加载更多数据");
            }, 1000);
        };

        const viewDetails = (item) => {
            ElMessage.info(`查看详情: ${item.title}`);
        };

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
            viewDetails
        };
    }
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