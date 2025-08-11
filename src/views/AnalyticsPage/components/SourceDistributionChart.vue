<template>
  <div class="source-distribution-chart-card">
    <div class="card-header">
      <div class="header-title">
        <el-icon class="header-icon"><PieChart /></el-icon>
        采集来源分布
      </div>
      <div class="header-actions">
        <el-button type="primary" text size="small" @click="refreshData">
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
import * as echarts from "echarts";

export default {
  name: "SourceDistributionChart",
  setup() {
    const chartContainer = ref(null);
    let chartInstance = null;

    // 模拟采集来源数据
    const sourceData = ref([
      { name: "新闻采集器", value: 35 },
      { name: "电商数据爬虫", value: 25 },
      { name: "社交媒体监控", value: 20 },
      { name: "股票信息采集", value: 15 },
      { name: "天气数据采集", value: 3 },
      { name: "房产信息爬虫", value: 2 }
    ]);

    const initChart = () => {
      if (!chartContainer.value) return;

      chartInstance = echarts.init(chartContainer.value);

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e6eb",
          borderWidth: 1,
          textStyle: {
            color: "#333"
          }
        },
        legend: {
                   orient: "vertical",
                   left: "left",
                   bottom: "10%",
                   textStyle: {
                     color: "#606266"
                   },
                   itemGap: 12
                 },
        series: [
          {
            name: "来源分布",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["60%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
                           show: false
                         },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold"
              }
            },
            labelLine: {
                           show: false
                         },
            data: sourceData.value
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

    const refreshData = () => {
      // 模拟数据刷新
      sourceData.value = sourceData.value.map(item => ({
        ...item,
        value: Math.max(1, Math.floor(Math.random() * 40))
      }));

      // 重新计算总和，确保百分比正确
      const total = sourceData.value.reduce((sum, item) => sum + item.value, 0);
      sourceData.value = sourceData.value.map(item => ({
        ...item,
        value: Math.round((item.value / total) * 100)
      }));

      if (chartInstance) {
        chartInstance.setOption({
          series: [{
            data: sourceData.value
          }]
        });
      }
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
      refreshData
    };
  }
};
</script>

<style scoped>
.source-distribution-chart-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
}

.source-distribution-chart-card:hover {
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
  height: 400px;
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
    height: 300px;
  }

  .header-title {
    font-size: 14px;
    text-align: center;
  }
}
</style>