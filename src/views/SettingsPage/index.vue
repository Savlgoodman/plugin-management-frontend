<template>
    <div class="settings-page">
        <div class="page-container">
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
import SystemInfoCard from "./components/SystemInfoCard.vue";
import BasicSettingsCard from "./components/BasicSettingsCard.vue";
import SystemLogsCard from "./components/SystemLogsCard.vue";

export default {
    name: "SettingsPage",
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
