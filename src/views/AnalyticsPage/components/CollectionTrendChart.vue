<template>
  <div class="collection-trend-chart-card">
    <div class="card-header">
      <div class="header-title">
        <el-icon class="header-icon"><TrendCharts /></el-icon>
        采集趋势分析
      </div>
      <div class="header-actions">
        <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
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
  name: "CollectionTrendChart",
  setup() {
    const chartContainer = ref(null);
    let chartInstance = null;
    const timeRange = ref("day");

    // 模拟采集趋势数据
    const trendData = ref({
      day: {
        categories: [
          "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07",
          "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15"
        ],
        series: [
          {
            name: "政策文件",
            data: [120, 132, 101, 134, 90, 230, 210, 140, 150, 160, 170, 180, 190, 200, 210],
            color: "#4285f4"
          },
          {
            name: "技术规范",
            data: [220, 182, 191, 234, 290, 330, 310, 240, 250, 260, 270, 280, 290, 300, 310],
            color: "#ea4335"
          },
          {
            name: "事故通报",
            data: [150, 232, 201, 154, 190, 330, 410, 340, 350, 360, 370, 380, 390, 400, 410],
            color: "#fbbc04"
          },
          {
            name: "行业新闻",
            data: [320, 332, 301, 334, 390, 330, 320, 440, 450, 460, 470, 480, 490, 500, 510],
            color: "#34a853"
          }
        ]
      },
      week: {
        categories: ["第1周", "第2周", "第3周", "第4周"],
        series: [
          {
            name: "政策文件",
            data: [850, 900, 950, 1000],
            color: "#4285f4"
          },
          {
            name: "技术规范",
            data: [1200, 1300, 1400, 1500],
            color: "#ea4335"
          },
          {
            name: "事故通报",
            data: [1600, 1700, 1800, 1900],
            color: "#fbbc04"
          },
          {
            name: "行业新闻",
            data: [2000, 2100, 2200, 2300],
            color: "#34a853"
          }
        ]
      },
      month: {
        categories: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"],
        series: [
          {
            name: "政策文件",
            data: [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200],
            color: "#4285f4"
          },
          {
            name: "技术规范",
            data: [3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200],
            color: "#ea4335"
          },
          {
            name: "事故通报",
            data: [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200],
            color: "#fbbc04"
          },
          {
            name: "行业新闻",
            data: [5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200],
            color: "#34a853"
          }
        ]
      },
      year: {
        categories: ["2021", "2022", "2023", "2024"],
        series: [
          {
            name: "政策文件",
            data: [20000, 22000, 24000, 26000],
            color: "#4285f4"
          },
          {
            name: "技术规范",
            data: [28000, 30000, 32000, 34000],
            color: "#ea4335"
          },
          {
            name: "事故通报",
            data: [36000, 38000, 40000, 42000],
            color: "#fbbc04"
          },
          {
            name: "行业新闻",
            data: [44000, 46000, 48000, 50000],
            color: "#34a853"
          }
        ]
      }
    });

    const initChart = () => {
      if (!chartContainer.value) return;

      chartInstance = echarts.init(chartContainer.value);

      updateChart();
    };

    const updateChart = () => {
      if (!chartInstance) return;

      const currentData = trendData.value[timeRange.value];
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e6eb",
          borderWidth: 1,
          textStyle: {
            color: "#333"
          }
        },
        legend: {
          data: currentData.series.map(s => s.name),
          top: 10,
          textStyle: {
            color: "#606266"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: currentData.categories,
            axisLabel: {
              color: "#606266",
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "#e5e6eb"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "采集量",
            axisLabel: {
              formatter: "{value}",
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
          }
        ],
        series: currentData.series.map(series => ({
          name: series.name,
          type: "bar",
          stack: "total",
          data: series.data,
          itemStyle: {
            color: series.color
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8
            }
          }
        }))
      };

      chartInstance.setOption(option);
    };

    const handleTimeRangeChange = () => {
      updateChart();
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
      timeRange,
      handleTimeRangeChange
    };
  }
};
</script>

<style scoped>
.collection-trend-chart-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
}

.collection-trend-chart-card:hover {
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