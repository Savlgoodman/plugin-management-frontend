<template>
  <div class="quality-analysis-chart-card">
    <div class="card-header">
      <div class="header-title">
        <el-icon class="header-icon"><DataAnalysis /></el-icon>
        数据质量分析
      </div>
    </div>

    <div class="chart-content">
      <div ref="chartContainer" class="chart-container"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

export default {
  name: "QualityAnalysisChart",
  setup() {
    const chartContainer = ref(null);
    let chartInstance = null;

    // 模拟数据质量数据
    const qualityData = ref({
      dimensions: ["有效性", "及时性", "一致性", "准确性", "完整性"],
      values: [95, 88, 92, 90, 85]
    });

    const initChart = () => {
      if (!chartContainer.value) return;

      chartInstance = echarts.init(chartContainer.value);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: "{b}: {c}%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e6eb",
          borderWidth: 1,
          textStyle: {
            color: "#333"
          }
        },
        grid: {
          left: "15%",
          right: "5%",
          top: "10%",
          bottom: "10%"
        },
        xAxis: {
          type: "value",
          max: 100,
          axisLabel: {
            formatter: "{value}%",
            color: "#606266"
          },
          axisLine: {
            lineStyle: {
              color: "#e5e6eb"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#f5f6fa"
            }
          }
        },
        yAxis: {
          type: "category",
          data: qualityData.value.dimensions,
          axisLabel: {
            color: "#606266",
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: "#e5e6eb"
            }
          }
        },
        series: [
          {
            name: "质量得分",
            type: "bar",
            data: qualityData.value.values,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#4285f4" },
                { offset: 1, color: "#a4c6fd" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#1a73e8" },
                  { offset: 1, color: "#8ab4f8" }
                ])
              }
            },
            barWidth: "60%"
          }
        ]
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
      chartContainer
    };
  }
};
</script>

<style scoped>
.quality-analysis-chart-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
}

.quality-analysis-chart-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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