<template>
  <div class="recent-abnormal-records-card">
    <div class="card-header">
      <div class="header-title">
        <el-icon class="header-icon"><WarningFilled /></el-icon>
        最近异常采集记录
      </div>
    </div>

    <div class="table-content">
      <el-table
        :data="abnormalRecords"
        stripe
        class="abnormal-records-table"
        v-loading="loading"
      >
        <el-table-column
          label="时间"
          prop="time"
          width="160"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon class="time-icon"><Clock /></el-icon>
              {{ row.time }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="采集源"
          prop="source"
          width="150"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <div class="source-cell">
              <el-icon class="source-icon"><Grid /></el-icon>
              {{ row.source }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="异常类型"
          prop="type"
          width="140"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getTypeTag(row.type)"
              effect="light"
              round
              size="small"
            >
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="描述"
          prop="description"
          min-width="200"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div class="description-cell">
              <span class="description-text">{{ row.description }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          width="120"
          header-align="center"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getStatusTag(row.status)"
              effect="plain"
              round
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="100"
          fixed="right"
          header-align="center"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleViewDetails(row)"
              class="action-btn"
            >
              <el-icon><View /></el-icon>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "RecentAbnormalRecords",
  setup() {
    const loading = ref(false);
    const abnormalRecords = ref([
      {
        id: 1,
        time: "2024-01-15 14:30:25",
        source: "新闻采集器",
        type: "超时错误",
        description: "采集目标网站响应超时，可能由于网络问题或目标网站访问限制",
        status: "未解决"
      },
      {
        id: 2,
        time: "2024-01-15 14:28:12",
        source: "电商数据爬虫",
        type: "数据格式错误",
        description: "解析返回的JSON数据时出现格式错误，可能API接口已变更",
        status: "已解决"
      },
      {
        id: 3,
        time: "2024-01-15 14:25:08",
        source: "社交媒体监控",
        type: "认证失效",
        description: "API认证令牌已过期，需要重新获取访问权限",
        status: "未解决"
      },
      {
        id: 4,
        time: "2024-01-15 14:22:55",
        source: "股票信息采集",
        type: "频率限制",
        description: "请求频率超过API限制，已被暂时封禁",
        status: "已解决"
      },
      {
        id: 5,
        time: "2024-01-15 14:20:30",
        source: "天气数据采集",
        type: "数据缺失",
        description: "目标网站数据源暂时不可用，部分数据未能采集",
        status: "未解决"
      },
      {
        id: 6,
        time: "2024-01-15 14:18:15",
        source: "房产信息爬虫",
        type: "解析错误",
        description: "HTML结构发生变化，导致数据解析失败",
        status: "已解决"
      }
    ]);

    const getTypeTag = (type) => {
      const typeMap = {
        "超时错误": "danger",
        "数据格式错误": "warning",
        "认证失效": "info",
        "频率限制": "warning",
        "数据缺失": "warning",
        "解析错误": "danger"
      };
      return typeMap[type] || "info";
    };

    const getStatusTag = (status) => {
      return status === "已解决" ? "success" : "danger";
    };

    const handleViewDetails = (row) => {
      ElMessage.info(`查看异常记录详情: ${row.source}`);
    };

    onMounted(() => {
      // 初始化加载数据
    });

    return {
      loading,
      abnormalRecords,
      getTypeTag,
      getStatusTag,
      handleViewDetails
    };
  }
};
</script>

<style scoped>
.recent-abnormal-records-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e6eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
}

.recent-abnormal-records-card:hover {
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
  color: #ff9500;
  font-size: 18px;
}

.table-content {
  padding: 20px;
}

.abnormal-records-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.time-icon {
  color: #909399;
  font-size: 14px;
}

.source-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.source-icon {
  color: #909399;
  font-size: 14px;
}

.description-cell {
  display: flex;
  align-items: center;
}

.description-text {
  font-size: 13px;
  color: #1f2329;
}

.action-btn {
  padding: 4px;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 16px 16px 0 16px;
  }

  .table-content {
    padding: 16px;
  }

  .abnormal-records-table {
    font-size: 12px;
  }

  .time-cell,
  .source-cell {
    justify-content: center;
  }

  .description-text {
    font-size: 12px;
  }
}
</style>