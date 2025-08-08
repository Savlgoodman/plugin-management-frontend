<template>
    <div class="performance-chart-card">
        <div class="card-header">
            <div class="header-title">
                <el-icon class="header-icon"><DataBoard /></el-icon>
                采集性能分析
            </div>
            <div class="header-actions">
                <el-button
                    type="primary"
                    text
                    size="small"
                    @click="refreshData"
                >
                    <el-icon><Refresh /></el-icon>
                    刷新数据
                </el-button>
            </div>
        </div>

        <div class="chart-content">
            <div ref="chartContainer" class="chart-container"></div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";

export default {
    name: "PerformanceChart",
    setup() {
        const chartContainer = ref(null);
        let chartInstance = null;

        // 模拟性能数据
        const performanceData = ref({
            plugins: [
                "新闻采集器",
                "电商数据爬虫",
                "社交媒体监控",
                "股票信息采集",
                "天气数据采集",
                "房产信息爬虫",
            ],
            responseTime: [120, 85, 230, 45, 180, 95], // 响应时间(ms)
            successRate: [98.5, 99.2, 94.8, 99.8, 96.3, 98.9], // 成功率(%)
        });

        const initChart = () => {
            if (!chartContainer.value) return;

            chartInstance = echarts.init(chartContainer.value);

            const option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: {
                            color: "#999",
                        },
                    },
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderColor: "#e5e6eb",
                    borderWidth: 1,
                    textStyle: {
                        color: "#333",
                    },
                },
                legend: {
                    data: ["响应时间", "采集成功率"],
                    top: 10,
                    textStyle: {
                        color: "#606266",
                    },
                },
                xAxis: [
                    {
                        type: "category",
                        data: performanceData.value.plugins,
                        axisPointer: {
                            type: "shadow",
                        },
                        axisLabel: {
                            color: "#606266",
                            fontSize: 12,
                            interval: 0,
                            rotate: 30,
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#e5e6eb",
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "响应时间(ms)",
                        position: "left",
                        axisLabel: {
                            formatter: "{value} ms",
                            color: "#606266",
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#4285f4",
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#f5f6fa",
                            },
                        },
                    },
                    {
                        type: "value",
                        name: "成功率(%)",
                        position: "right",
                        axisLabel: {
                            formatter: "{value}%",
                            color: "#606266",
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#00b42a",
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: "响应时间",
                        type: "bar",
                        data: performanceData.value.responseTime,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    { offset: 0, color: "#4285f4" },
                                    { offset: 1, color: "#a4c6fd" },
                                ]
                            ),
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        { offset: 0, color: "#1a73e8" },
                                        { offset: 1, color: "#8ab4f8" },
                                    ]
                                ),
                            },
                        },
                        barWidth: "60%",
                    },
                    {
                        name: "采集成功率",
                        type: "line",
                        yAxisIndex: 1,
                        data: performanceData.value.successRate,
                        itemStyle: {
                            color: "#00b42a",
                        },
                        lineStyle: {
                            color: "#00b42a",
                            width: 3,
                        },
                        symbol: "circle",
                        symbolSize: 8,
                        emphasis: {
                            scale: true,
                            scaleSize: 12,
                        },
                    },
                ],
            };

            chartInstance.setOption(option);

            // 监听窗口大小变化
            const resizeHandler = () => {
                if (chartInstance) {
                    chartInstance.resize();
                }
            };
            window.addEventListener("resize", resizeHandler);
        };

        const refreshData = () => {
            ElMessage.info("正在刷新性能数据...");

            // 模拟数据刷新
            setTimeout(() => {
                // 随机生成新的性能数据
                performanceData.value.responseTime =
                    performanceData.value.responseTime.map(
                        () => Math.floor(Math.random() * 200) + 50
                    );
                performanceData.value.successRate =
                    performanceData.value.successRate.map(
                        () =>
                            Math.floor(Math.random() * 10) + 90 + Math.random()
                    );

                if (chartInstance) {
                    chartInstance.setOption({
                        series: [
                            { data: performanceData.value.responseTime },
                            { data: performanceData.value.successRate },
                        ],
                    });
                }

                ElMessage.success("性能数据已更新");
            }, 1000);
        };

        onMounted(() => {
            nextTick(() => {
                initChart();
            });
        });

        onUnmounted(() => {
            if (chartInstance) {
                chartInstance.dispose();
            }
            window.removeEventListener("resize", () => {});
        });

        return {
            chartContainer,
            refreshData,
        };
    },
};
</script>

<style scoped>
.performance-chart-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e6eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.3s ease;
}

.performance-chart-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    /* transform: translateY(-2px); */
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
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    color: #409eff;
    font-size: 18px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-content {
    padding: 20px;
}

.chart-container {
    width: 100%;
    height: 300px;
}

@media (max-width: 768px) {
    .card-header {
        padding: 16px 16px 0 16px;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }

    .chart-content {
        padding: 16px;
    }

    .chart-container {
        height: 250px;
    }

    .header-title {
        font-size: 14px;
        text-align: center;
    }
}
</style>
