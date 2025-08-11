<template>
  <div class="settings-page">
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-left">
          <div class="breadcrumb">
            <el-icon class="breadcrumb-icon"><Setting /></el-icon>
            <span class="breadcrumb-item">系统管理</span>
          </div>
          <h1 class="page-title">系统设置</h1>
          <div class="page-subtitle">
            系统配置与管理，查看系统状态和操作日志
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content-area">
        <!-- 左侧系统信息区域 -->
        <div class="left-section">
          <SystemInfoCard />
        </div>

        <!-- 右侧设置区域 -->
        <div class="right-section">
          <BasicSettingsCard />
          <SystemLogsCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemInfoCard from './components/SystemInfoCard.vue';
import BasicSettingsCard from './components/BasicSettingsCard.vue';
import SystemLogsCard from './components/SystemLogsCard.vue';

export default {
  name: 'SettingsPage',
  components: {
    SystemInfoCard,
    BasicSettingsCard,
    SystemLogsCard,
  },
};
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4285f4;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 16px;
}

.breadcrumb-item {
  color: #4285f4;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2329;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 16px;
  color: #86909c;
  line-height: 1.5;
  margin-top: 4px;
}

.main-content-area {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 24px;
  align-items: stretch;
}

.left-section {
  width: 100%;
}

.right-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-container {
    max-width: 100%;
    padding: 20px;
  }

  .main-content-area {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .main-content-area {
    gap: 16px;
  }

  .right-section {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 12px;
  }
}
</style>
