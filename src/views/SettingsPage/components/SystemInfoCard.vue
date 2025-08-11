<template>
    <el-card class="system-info-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><InfoFilled /></el-icon>
                    <span class="header-title">系统信息</span>
                </div>
            </div>
        </template>

        <div class="info-list">
            <!-- 服务器状态 -->
            <div class="info-row">
                <div class="info-label">服务器状态</div>
                <div class="info-value">
                    <el-tag
                        :type="
                            serverStatus === 'running' ? 'success' : 'danger'
                        "
                        round
                    >
                        <span
                            class="status-indicator"
                            :class="serverStatusClass"
                        ></span>
                        {{ serverStatusText }}
                    </el-tag>
                </div>
            </div>

            <!-- 最后更新时间 -->
            <div class="info-row">
                <div class="info-label">最后更新时间</div>
                <div class="info-value">{{ lastUpdateTime }}</div>
            </div>

            <!-- 数据库连接状态 -->
            <div class="info-row">
                <div class="info-label">数据库连接</div>
                <div class="info-value">
                    <el-tag
                        :type="dbStatus === 'connected' ? 'success' : 'danger'"
                        round
                    >
                        <span
                            class="status-indicator"
                            :class="dbStatusClass"
                        ></span>
                        {{ dbStatusText }}
                    </el-tag>
                </div>
            </div>

            <!-- 存储空间 -->
            <div class="info-row">
                <div class="info-label">存储空间</div>
                <div class="info-value">
                    <div class="storage-progress">
                        <el-progress
                            :percentage="storageUsage"
                            :color="storageColor"
                            :stroke-width="8"
                            :show-text="false"
                        />
                        <div class="storage-text">
                            {{ storageUsage }}% 已使用 ({{ usedStorage }} /
                            {{ totalStorage }})
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getSystemInfo } from "../api/settings";

export default {
    name: "SystemInfoCard",
    setup() {
        // 系统信息数据
        const serverStatus = ref("running");
        const lastUpdateTime = ref("2024/1/15 14:30:25");
        const dbStatus = ref("connected");
        const usedStorage = ref("45.2 GB");
        const totalStorage = ref("100 GB");
        const storageUsage = ref(45.2);

        // 服务器状态计算
        const serverStatusClass = computed(() => {
            return serverStatus.value === "running"
                ? "status-active"
                : "status-inactive";
        });

        const serverStatusText = computed(() => {
            return serverStatus.value === "running" ? "运行中" : "已停止";
        });

        // 数据库状态计算
        const dbStatusClass = computed(() => {
            return dbStatus.value === "connected"
                ? "status-active"
                : "status-inactive";
        });

        const dbStatusText = computed(() => {
            return dbStatus.value === "connected" ? "已连接" : "未连接";
        });

        // 存储空间颜色
        const storageColor = computed(() => {
            if (storageUsage.value < 70) return "#4285f4";
            if (storageUsage.value < 90) return "#ff9500";
            return "#ea4335";
        });

        // 从API获取系统信息
        const fetchSystemInfo = async () => {
            try {
                const response = await getSystemInfo();
                if (response.success) {
                    const data = response.data;
                    serverStatus.value = data.serverStatus;
                    dbStatus.value = data.dbStatus;
                    usedStorage.value = data.usedStorage;
                    totalStorage.value = data.totalStorage;
                    storageUsage.value = data.storageUsage;
                    // 更新最后更新时间
                    lastUpdateTime.value = data.lastUpdateTime;
                }
            } catch (error) {
                console.error("获取系统信息失败:", error);
            }
        };

        // 模拟数据更新
        const updateData = () => {
            lastUpdateTime.value = new Date().toLocaleString("zh-CN");
        };

        onMounted(() => {
            // 初始加载数据
            fetchSystemInfo();
            // 每30秒更新一次时间
            setInterval(updateData, 30000);
        });

        return {
            serverStatus,
            lastUpdateTime,
            dbStatus,
            usedStorage,
            totalStorage,
            storageUsage,
            serverStatusClass,
            serverStatusText,
            dbStatusClass,
            dbStatusText,
            storageColor,
        };
    },
};
</script>

<style scoped>
.system-info-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 18px;
    color: #4285f4;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e4e7ed;
}

.info-row:last-child {
    border-bottom: none;
}

.storage-progress {
    width: 100%;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.info-label {
    font-size: 14px;
    color: #86909c;
    font-weight: 500;
}

.info-value {
    font-size: 14px;
    color: #1f2329;
}

.status-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
}

.status-active {
    background: #00b42a;
}

.status-inactive {
    background: #ea4335;
}

.storage-text {
    font-size: 12px;
    color: #86909c;
    margin-top: 6px;
    text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>
