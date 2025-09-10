<template>
    <el-card class="plugin-categories-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><FolderOpened /></el-icon>
                    <span class="header-title">可下载插件</span>
                    <HelpTooltip
                        content="显示所有已转换为文件下载模式的插件列表"
                    />
                </div>
                <div class="header-right">
                    <el-tooltip content="刷新插件列表" placement="top">
                        <el-button
                            text
                            @click="handleRefresh"
                            :loading="refreshing"
                            :disabled="refreshing"
                            class="refresh-btn"
                        >
                            <el-icon v-if="!refreshing"><Refresh /></el-icon>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </template>

        <div class="card-body">
            <!-- 插件列表 -->
            <div class="plugins-list" v-loading="loading">
                <div
                    v-for="plugin in plugins"
                    :key="plugin.plugin_id"
                    :class="[
                        'plugin-item',
                        { active: selectedPlugin === plugin.plugin_id },
                    ]"
                    @click="handlePluginSelect(plugin.plugin_id)"
                >
                    <div class="plugin-content">
                        <div class="plugin-info">
                            <div
                                class="plugin-icon"
                                :style="{ color: getPluginStatusColor(plugin) }"
                            >
                                <el-icon :size="16">
                                    <component :is="getPluginIcon(plugin)" />
                                </el-icon>
                            </div>
                            <div class="plugin-details">
                                <div class="plugin-name">
                                    {{ plugin.plugin_name }}
                                </div>
                                <div class="plugin-status">
                                    <el-tag
                                        :type="getPluginStatusType(plugin)"
                                        size="small"
                                    >
                                        {{ getPluginStatusText(plugin) }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                        <div class="plugin-count">
                            <span class="count-number">{{
                                plugin.record_count || 0
                            }}</span>
                            <span class="count-label">文件</span>
                        </div>
                    </div>
                    <div class="plugin-progress">
                        <el-progress
                            :percentage="getPluginProgress(plugin)"
                            :color="getPluginStatusColor(plugin)"
                            :show-text="false"
                            :stroke-width="3"
                        />
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <div class="action-btn-wrapper">
                    <el-button
                        type="primary"
                        @click="$emit('convert-plugin')"
                        class="action-btn convert-btn"
                    >
                        <el-icon><Plus /></el-icon>
                        <span>转换插件</span>
                    </el-button>
                </div>
                <div class="action-btn-wrapper">
                    <el-button
                        type="success"
                        @click="$emit('manage-tasks')"
                        class="action-btn manage-btn"
                    >
                        <el-icon><Setting /></el-icon>
                        <span>任务管理</span>
                    </el-button>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getDownloadablePlugins } from "../api/files";
import HelpTooltip from "./HelpTooltip.vue";

export default {
    name: "PluginCategories",
    components: {
        HelpTooltip,
    },
    emits: ["plugin-change", "convert-plugin", "manage-tasks"],
    setup(props, { emit }) {
        const selectedPlugin = ref(null);
        const plugins = ref([]);
        const loading = ref(false);
        const refreshing = ref(false);

        // 获取可下载插件列表
        const loadPlugins = async () => {
            loading.value = true;
            try {
                const result = await getDownloadablePlugins();
                if (result.success) {
                    let pluginsList = result.data.plugins || [];
                    // 按照文件个数从高到低排序
                    pluginsList.sort((a, b) => {
                        const countA = a.record_count || 0;
                        const countB = b.record_count || 0;
                        return countB - countA;
                    });
                    plugins.value = pluginsList;
                    // 默认选择第一个插件
                    if (plugins.value.length > 0 && !selectedPlugin.value) {
                        handlePluginSelect(plugins.value[0].plugin_id);
                    }
                } else {
                    ElMessage.error(result.message);
                }
            } catch (error) {
                console.error("加载插件列表失败:", error);
                ElMessage.error("加载插件列表失败");
            } finally {
                loading.value = false;
            }
        };

        // 处理插件选择
        const handlePluginSelect = (pluginId) => {
            selectedPlugin.value = pluginId;
            const plugin = plugins.value.find((p) => p.plugin_id === pluginId);
            emit("plugin-change", {
                pluginId,
                plugin,
            });
        };

        // 刷新插件列表
        const handleRefresh = async () => {
            refreshing.value = true;
            await loadPlugins();
            refreshing.value = false;
            ElMessage.success("插件列表已刷新");
        };

        // 获取插件图标
        const getPluginIcon = (plugin) => {
            if (plugin.is_downloading === 1) {
                return "Download";
            }
            return plugin.has_download_config ? "Document" : "Folder";
        };

        // 获取插件状态颜色
        const getPluginStatusColor = (plugin) => {
            if (plugin.is_downloading === 1) {
                return "#409eff";
            }
            return plugin.has_download_config ? "#67c23a" : "#909399";
        };

        // 获取插件状态类型
        const getPluginStatusType = (plugin) => {
            if (plugin.is_downloading === 1) {
                return "primary";
            }
            return plugin.has_download_config ? "success" : "info";
        };

        // 获取插件状态文本
        const getPluginStatusText = (plugin) => {
            if (plugin.is_downloading === 1) {
                return "下载中";
            }
            return plugin.has_download_config ? "已配置" : "未配置";
        };

        // 获取插件进度
        const getPluginProgress = (plugin) => {
            if (!plugin.has_download_config) return 0;
            if (plugin.is_downloading === 1) return 50;
            return 100;
        };

        onMounted(() => {
            loadPlugins();
        });

        return {
            selectedPlugin,
            plugins,
            loading,
            refreshing,
            handlePluginSelect,
            handleRefresh,
            getPluginIcon,
            getPluginStatusColor,
            getPluginStatusType,
            getPluginStatusText,
            getPluginProgress,
        };
    },
};
</script>

<style scoped>
.plugin-categories-card {
    height: 100%;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
}

.plugin-categories-card :deep(.el-card__body) {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    color: #409eff;
    font-size: 18px;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.refresh-btn {
    padding: 4px;
    border-radius: 6px;
}

.plugins-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.plugin-item {
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafafa;
}

.plugin-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.plugin-item.active {
    border-color: #409eff;
    background: #ecf5ff;
}

.plugin-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.plugin-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.plugin-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.plugin-details {
    flex: 1;
}

.plugin-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
}

.plugin-status {
    font-size: 12px;
}

.plugin-count {
    text-align: right;
}

.count-number {
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
}

.count-label {
    font-size: 12px;
    color: #909399;
    margin-left: 2px;
}

.plugin-progress {
    margin-top: 8px;
}

.action-buttons {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    flex-shrink: 0;
}

.action-btn-wrapper {
    width: 100%;
    display: flex;
}

.action-btn {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 16px;
    box-sizing: border-box;
    border: none;
    outline: none;
}

.convert-btn {
    background-color: #409eff;
    color: white;
}

.convert-btn:hover {
    background-color: #66b1ff;
}

.convert-btn:active {
    background-color: #3a8ee6;
}

.manage-btn {
    background-color: #67c23a;
    color: white;
}

.manage-btn:hover {
    background-color: #85ce61;
}

.manage-btn:active {
    background-color: #5daf34;
}

.action-btn .el-icon {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn span {
    flex-shrink: 0;
    white-space: nowrap;
}
</style>
