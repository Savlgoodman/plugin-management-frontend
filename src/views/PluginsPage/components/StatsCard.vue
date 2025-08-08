<template>
    <div class="stats-card">
        <div class="card-content">
            <div class="card-header">
                <div class="card-title">{{ title }}</div>
                <div class="card-icon" :style="{ color: color }">
                    <el-icon :size="24">
                        <component :is="icon" />
                    </el-icon>
                </div>
            </div>

            <div class="card-body">
                <div class="main-value" :style="{ color: valueColor }">
                    {{ value }}
                </div>
                <div class="trend-info">
                    <div class="trend-content" :class="trendClass">
                        <el-icon class="trend-icon" :size="14">
                            <component :is="trendIcon" />
                        </el-icon>
                        <span class="trend-text">{{ trend }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";

export default {
    name: "StatsCard",
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Number],
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "#4285f4",
        },
        trend: {
            type: String,
            default: "",
        },
        subtitle: {
            type: String,
            default: "",
        },
    },
    setup(props) {
        const valueColor = computed(() => {
            return "#1f2329";
        });

        const trendClass = computed(() => {
            if (
                props.trend.includes("增长") ||
                props.trend.includes("正在运行")
            ) {
                return "trend-positive";
            } else if (
                props.trend.includes("故障") ||
                props.trend.includes("异常")
            ) {
                return "trend-warning";
            }
            return "trend-neutral";
        });

        const trendIcon = computed(() => {
            if (props.trend.includes("增长")) {
                return "ArrowUp";
            } else if (props.trend.includes("故障")) {
                return "Warning";
            } else if (props.trend.includes("正在运行")) {
                return "Check";
            }
            return "Minus";
        });

        return {
            valueColor,
            trendClass,
            trendIcon,
        };
    },
};
</script>

<style scoped>
.stats-card {
    width: 320px;
    height: 136px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    cursor: pointer;
}

.stats-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: #d1d5db;
}

.card-content {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-title {
    font-size: 14px;
    color: #86909c;
    font-weight: 400;
    line-height: 1.2;
}

.card-icon {
    opacity: 0.8;
    transition: all 0.3s ease;
}

.stats-card:hover .card-icon {
    opacity: 1;
    transform: scale(1.1);
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.main-value {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.1;
    margin-bottom: 4px;
}

.trend-info {
    display: flex;
    align-items: center;
}

.trend-content {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
}

.trend-positive {
    color: #00b42a;
}

.trend-positive .trend-icon {
    color: #00b42a;
}

.trend-warning {
    color: #ff7d00;
}

.trend-warning .trend-icon {
    color: #ff7d00;
}

.trend-neutral {
    color: #86909c;
}

.trend-neutral .trend-icon {
    color: #86909c;
}

.trend-icon {
    flex-shrink: 0;
}

.trend-text {
    line-height: 1.2;
    white-space: nowrap;
}

@media (max-width: 1200px) {
    .stats-card {
        width: 100%;
        min-width: 250px;
    }
}

@media (max-width: 768px) {
    .stats-card {
        width: 100%;
        height: auto;
        min-height: 120px;
    }

    .card-content {
        padding: 16px;
    }

    .main-value {
        font-size: 28px;
    }

    .card-header {
        margin-bottom: 10px;
    }
}
</style>
