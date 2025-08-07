<template>
    <div class="status-chart-card">
        <div class="card-header">
            <div class="header-title">插件运行状态（活跃插件比例）</div>
        </div>

        <div class="chart-content">
            <!-- 状态统计 -->
            <div class="status-stats">
                <div
                    class="stat-item"
                    v-for="item in statusData"
                    :key="item.name"
                >
                    <div class="stat-info">
                        <div class="stat-left">
                            <div class="stat-name">{{ item.name }}</div>
                            <div class="stat-count">
                                {{ item.value }}/{{ totalCount }} ({{
                                    item.percentage
                                }}%)
                            </div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            :style="{
                                width: item.percentage + '%',
                                backgroundColor: item.color,
                            }"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- 快速操作 -->
            <div class="quick-actions">
                <el-button
                    v-for="action in quickActions"
                    :key="action.name"
                    :type="action.type"
                    size="small"
                    class="action-button"
                    @click="handleQuickAction(action)"
                >
                    <el-icon>
                        <component :is="action.icon" />
                    </el-icon>
                    {{ action.name }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";

export default {
    name: "PluginStatusChart",
    setup() {
        const statusData = ref([
            {
                name: "活跃",
                value: 12,
                percentage: 75,
                color: "#00b42a",
            },
            {
                name: "准备中",
                value: 3,
                percentage: 18.75,
                color: "#4285f4",
            },
            {
                name: "执行中",
                value: 1,
                percentage: 6.25,
                color: "#fbbc04",
            },
        ]);

        const totalCount = computed(() => {
            return statusData.value.reduce((sum, item) => sum + item.value, 0);
        });

        const quickActions = ref([
            {
                name: "一键检查所有插件",
                type: "primary",
                icon: "Refresh",
                action: "refresh",
            },
        ]);

        const handleQuickAction = (action) => {
            switch (action.action) {
                case "refresh":
                    ElMessage.info("正在检查所有插件状态...");
                    updateStatusData();
                    break;
                default:
                    ElMessage.info(`执行操作: ${action.name}`);
            }
        };

        const updateStatusData = () => {
            // 模拟数据更新
            setTimeout(() => {
                ElMessage.success("检查完成，所有插件状态正常");
            }, 1500);
        };

        return {
            statusData,
            totalCount,
            quickActions,
            handleQuickAction,
        };
    },
};
</script>

<style scoped>
.status-chart-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.3s ease;
}

.status-chart-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: #d1d5db;
}

.card-header {
    padding: 20px 20px 0 20px;
    border-bottom: none;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.chart-content {
    padding: 20px;
}

.status-stats {
    margin-bottom: 24px;
}

.stat-item {
    margin-bottom: 20px;
}

.stat-item:last-child {
    margin-bottom: 0;
}

.stat-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.stat-left {
    flex: 1;
}

.stat-name {
    font-size: 14px;
    color: #4e5969;
    font-weight: 500;
    margin-bottom: 2px;
}

.stat-count {
    font-size: 12px;
    color: #86909c;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: #f2f3f5;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
}

.quick-actions {
    text-align: center;
}

.action-button {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .card-header {
        padding: 16px 16px 0 16px;
    }

    .chart-content {
        padding: 16px;
    }

    .header-title {
        font-size: 14px;
    }

    .stat-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        margin-bottom: 6px;
    }
}
</style>
