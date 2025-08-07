<template>
    <div class="settings-page">
        <div class="page-container">
            <div class="coming-soon-container">
                <div class="coming-soon-icon">
                    <el-icon size="80"><Setting /></el-icon>
                </div>
                <h1 class="coming-soon-title">系统设置</h1>
                <p class="coming-soon-description">
                    此功能正在开发中，敬请期待...
                </p>
                <div class="feature-preview">
                    <h3>即将上线的功能：</h3>
                    <ul class="feature-list">
                        <li>
                            <el-icon><Check /></el-icon> 系统参数配置
                        </li>
                        <li>
                            <el-icon><Check /></el-icon> 用户权限管理
                        </li>
                        <li>
                            <el-icon><Check /></el-icon> 数据备份设置
                        </li>
                        <li>
                            <el-icon><Check /></el-icon> 系统监控配置
                        </li>
                    </ul>
                </div>
                <el-button
                    type="primary"
                    class="back-button"
                    @click="$router.push('/plugins')"
                >
                    <el-icon><ArrowLeft /></el-icon>
                    返回插件管理
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsPage",
};
</script>

<style scoped>
.settings-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.coming-soon-container {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 60px 40px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    max-width: 500px;
}

.coming-soon-icon {
    margin-bottom: 24px;
    color: #409eff;
}

.coming-soon-title {
    font-size: 32px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
}

.coming-soon-description {
    font-size: 18px;
    color: #606266;
    margin-bottom: 32px;
}

.feature-preview {
    text-align: left;
    margin-bottom: 32px;
}

.feature-preview h3 {
    color: #303133;
    margin-bottom: 16px;
    text-align: center;
}

.feature-list {
    list-style: none;
    padding: 0;
}

.feature-list li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    color: #606266;
}

.feature-list li .el-icon {
    color: #67c23a;
}

.back-button {
    border-radius: 25px;
    padding: 12px 24px;
}
</style> 