<template>
    <Teleport to="body">
        <el-dialog
            v-model="visible"
            title="活跃任务列表"
            width="80%"
            :before-close="handleClose"
            class="active-tasks-modal"
            :append-to-body="true"
            :lock-scroll="true"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
        >
            <!-- 头部统计信息 -->
            <div class="tasks-summary">
                <div class="summary-item">
                    <el-icon class="summary-icon"><Monitor /></el-icon>
                    <div class="summary-info">
                        <span class="summary-label">内存任务</span>
                        <span class="summary-value">{{
                            tasksData.total_memory || 0
                        }}</span>
                    </div>
                </div>
                <div class="summary-item">
                    <el-icon class="summary-icon"><Document /></el-icon>
                    <div class="summary-info">
                        <span class="summary-label">数据库记录任务</span>
                        <span class="summary-value">{{
                            tasksData.total_database || 0
                        }}</span>
                    </div>
                </div>
                <div class="summary-actions">
                    <el-button
                        type="primary"
                        size="small"
                        :loading="loading"
                        @click="refreshTasks"
                    >
                        <el-icon><Refresh /></el-icon>
                        刷新
                    </el-button>
                    <el-button
                        type="warning"
                        size="small"
                        :loading="cleanupLoading"
                        @click="handleCleanupDeadTasks"
                    >
                        <el-icon><Delete /></el-icon>
                        清理死亡任务
                    </el-button>
                </div>
            </div>

            <!-- 内存中的任务 -->
            <div v-if="memoryTasksList.length > 0" class="tasks-section">
                <div class="section-header">
                    <el-icon class="section-icon"><Monitor /></el-icon>
                    <span class="section-title">内存中的任务</span>
                    <el-tag size="small" type="primary">{{
                        memoryTasksList.length
                    }}</el-tag>
                </div>
                <div class="tasks-list">
                    <div
                        v-for="task in memoryTasksList"
                        :key="task.task_E_id"
                        class="task-item"
                    >
                        <div class="task-info">
                            <div class="task-header">
                                <span class="task-name">{{
                                    task.task_name
                                }}</span>
                                <el-tag
                                    :type="getStatusType(task.status)"
                                    size="small"
                                >
                                    {{ getStatusText(task.status) }}
                                </el-tag>
                            </div>
                            <div class="task-details">
                                <span class="task-id"
                                    >ID: {{ task.task_E_id }}</span
                                >
                                <span class="task-time"
                                    >创建时间:
                                    {{ formatTime(task.created_time) }}</span
                                >
                            </div>
                            <div class="task-status-info">
                                <el-tag
                                    :type="
                                        task.thread_alive ? 'success' : 'danger'
                                    "
                                    size="small"
                                    effect="plain"
                                >
                                    线程:
                                    {{ task.thread_alive ? "存活" : "停止" }}
                                </el-tag>
                                <el-tag
                                    :type="
                                        task.process_running
                                            ? 'success'
                                            : 'info'
                                    "
                                    size="small"
                                    effect="plain"
                                >
                                    进程:
                                    {{
                                        task.process_running ? "运行中" : "停止"
                                    }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="task-actions">
                            <el-button
                                size="small"
                                class="action-btn refresh-btn"
                                @click="refreshTaskStatus(task.task_E_id)"
                                :loading="refreshingTasks.has(task.task_E_id)"
                            >
                                <el-icon><Refresh /></el-icon>
                            </el-button>
                            <el-button
                                size="small"
                                class="action-btn stop-btn"
                                @click="stopTask(task.task_E_id)"
                                :loading="stoppingTasks.has(task.task_E_id)"
                                :disabled="
                                    task.status === 'stopped' ||
                                    task.status === 'finished'
                                "
                            >
                                <el-icon><VideoStop /></el-icon>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 数据库中的任务 -->
            <div v-if="databaseTasksList.length > 0" class="tasks-section">
                <div class="section-header">
                    <el-icon class="section-icon"><Document /></el-icon>
                    <span class="section-title">数据库记录任务</span>
                    <el-tag size="small" type="info">{{
                        databaseTasksList.length
                    }}</el-tag>
                </div>
                <div class="tasks-list">
                    <div
                        v-for="task in databaseTasksList"
                        :key="task.task_E_id"
                        class="task-item"
                    >
                        <div class="task-info">
                            <div class="task-header">
                                <span class="task-name">{{
                                    task.task_name
                                }}</span>
                                <el-tag
                                    :type="getStatusType(task.status)"
                                    size="small"
                                >
                                    {{ getStatusText(task.status) }}
                                </el-tag>
                            </div>
                            <div class="task-details">
                                <span class="task-id"
                                    >ID: {{ task.task_E_id }}</span
                                >
                                <span class="task-time"
                                    >创建时间:
                                    {{ formatTime(task.created_time) }}</span
                                >
                            </div>
                            <div class="task-status-info">
                                <el-tag
                                    type="warning"
                                    size="small"
                                    effect="plain"
                                >
                                    {{ task.source }}
                                </el-tag>
                            </div>
                        </div>
                        <div class="task-actions">
                            <el-button
                                size="small"
                                class="action-btn refresh-btn"
                                @click="refreshTaskStatus(task.task_E_id)"
                                :loading="refreshingTasks.has(task.task_E_id)"
                            >
                                <el-icon><Refresh /></el-icon>
                            </el-button>
                            <el-button
                                size="small"
                                class="action-btn stop-btn"
                                @click="stopTask(task.task_E_id)"
                                :loading="stoppingTasks.has(task.task_E_id)"
                                :disabled="
                                    task.status === 'stopped' ||
                                    task.status === 'finished'
                                "
                            >
                                <el-icon><VideoStop /></el-icon>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 无任务状态 -->
            <div
                v-if="
                    memoryTasksList.length === 0 &&
                    databaseTasksList.length === 0 &&
                    !loading
                "
                class="empty-state"
            >
                <el-empty description="暂无活跃任务" />
            </div>

            <!-- 加载状态 -->
            <div
                v-if="
                    loading &&
                    memoryTasksList.length === 0 &&
                    databaseTasksList.length === 0
                "
                class="loading-state"
            >
                <el-skeleton :rows="3" animated />
            </div>
        </el-dialog>
    </Teleport>
</template>

<script>
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    fetchActiveTasks,
    fetchTaskStatus,
    stopPluginTask,
    cleanupDeadTasks,
} from "../api/plugins.js";
import { Teleport } from "vue";

export default {
    name: "ActiveTasksModal",
    components: {
        Teleport,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const loading = ref(false);
        const cleanupLoading = ref(false);
        const tasksData = ref({});
        const refreshingTasks = ref(new Set());
        const stoppingTasks = ref(new Set());

        // 计算属性：内存任务列表
        const memoryTasksList = computed(() => {
            const memoryTasks = tasksData.value.memory_tasks || {};
            return Object.keys(memoryTasks).map((key) => ({
                ...memoryTasks[key],
                task_E_id: key,
            }));
        });

        // 计算属性：数据库任务列表
        const databaseTasksList = computed(() => {
            const databaseTasks = tasksData.value.database_tasks || {};
            return Object.keys(databaseTasks).map((key) => ({
                ...databaseTasks[key],
                task_E_id: key,
            }));
        });

        // 获取活跃任务数据
        const loadActiveTasks = async () => {
            loading.value = true;
            try {
                const response = await fetchActiveTasks();
                if (response.success) {
                    tasksData.value = response.data;
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("获取活跃任务失败");
            } finally {
                loading.value = false;
            }
        };

        // 刷新所有任务
        const refreshTasks = () => {
            loadActiveTasks();
        };

        // 刷新单个任务状态
        const refreshTaskStatus = async (executionId) => {
            refreshingTasks.value.add(executionId);
            try {
                const response = await fetchTaskStatus(executionId);
                if (response.success) {
                    // 刷新整个任务列表以获取最新状态
                    await loadActiveTasks();
                    ElMessage.success("任务状态已刷新");
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                ElMessage.error("刷新任务状态失败");
            } finally {
                refreshingTasks.value.delete(executionId);
            }
        };

        // 停止任务
        const stopTask = async (executionId) => {
            try {
                await ElMessageBox.confirm(
                    "确认要停止这个任务吗？",
                    "停止任务",
                    {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                stoppingTasks.value.add(executionId);
                const response = await stopPluginTask(executionId);

                if (response.success) {
                    ElMessage.success("任务已停止");
                    // 刷新任务列表
                    await loadActiveTasks();
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    ElMessage.error("停止任务失败");
                }
            } finally {
                stoppingTasks.value.delete(executionId);
            }
        };

        // 清理死亡任务
        const handleCleanupDeadTasks = async () => {
            try {
                await ElMessageBox.confirm(
                    "确认要清理所有死亡任务吗？此操作不可撤销。",
                    "清理死亡任务",
                    {
                        confirmButtonText: "确认清理",
                        cancelButtonText: "取消",
                        type: "warning",
                        confirmButtonClass: "el-button--warning",
                    }
                );

                cleanupLoading.value = true;
                const response = await cleanupDeadTasks();

                if (response.success) {
                    ElMessage.success("死亡任务清理成功");
                    // 刷新任务列表
                    await loadActiveTasks();
                } else {
                    ElMessage.error(response.message);
                }
            } catch (error) {
                if (error !== "cancel") {
                    ElMessage.error("清理死亡任务失败");
                }
            } finally {
                cleanupLoading.value = false;
            }
        };

        // 获取状态类型
        const getStatusType = (status) => {
            const statusMap = {
                pending: "info",
                running: "success",
                finished: "success",
                stopped: "warning",
                failed: "danger",
            };
            return statusMap[status] || "info";
        };

        // 获取状态文本
        const getStatusText = (status) => {
            const statusMap = {
                pending: "等待中",
                running: "运行中",
                finished: "已完成",
                stopped: "已停止",
                failed: "已失败",
            };
            return statusMap[status] || status;
        };

        // 格式化时间
        const formatTime = (timestamp) => {
            if (!timestamp) return "-";
            const date = new Date(timestamp * 1000);
            return date.toLocaleString("zh-CN");
        };

        // 关闭对话框
        const handleClose = () => {
            visible.value = false;
        };

        // 监听对话框显示状态
        watch(visible, (newVal) => {
            if (newVal) {
                loadActiveTasks();
            }
        });

        return {
            visible,
            loading,
            cleanupLoading,
            tasksData,
            memoryTasksList,
            databaseTasksList,
            refreshingTasks,
            stoppingTasks,
            refreshTasks,
            refreshTaskStatus,
            stopTask,
            handleCleanupDeadTasks,
            getStatusType,
            getStatusText,
            formatTime,
            handleClose,
        };
    },
};
</script>

<style scoped>
.active-tasks-modal :deep(.el-dialog__body) {
    padding: 20px;
}

.tasks-summary {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 24px;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.summary-icon {
    color: #409eff;
    font-size: 18px;
}

.summary-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.summary-label {
    font-size: 12px;
    color: #86909c;
}

.summary-value {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.summary-actions {
    margin-left: auto;
    display: flex;
    gap: 12px;
}

.tasks-section {
    margin-bottom: 24px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e6eb;
}

.section-icon {
    color: #409eff;
    font-size: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2329;
}

.tasks-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.task-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.task-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.task-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2329;
}

.task-details {
    display: flex;
    gap: 16px;
    align-items: center;
}

.task-id,
.task-time {
    font-size: 12px;
    color: #86909c;
    line-height: 1.4;
    display: flex;
    align-items: center;
}

.task-status-info {
    display: flex;
    gap: 8px;
}

.task-actions {
    display: flex;
    gap: 8px;
    margin-left: 16px;
}

/* 自定义按钮样式 - 类似视频软件控制按钮 */
.action-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-btn {
    background: #409eff;
    color: white;
}

.refresh-btn:hover {
    background: #66b1ff;
}

.refresh-btn:disabled {
    background: #c0c4cc;
    cursor: not-allowed;
}

.stop-btn {
    background: #f56c6c;
    color: white;
    position: relative;
}

.stop-btn:hover {
    background: #f78989;
}

.stop-btn:disabled {
    background: #c0c4cc;
    cursor: not-allowed;
}

/* 停止按钮的白色方形图标 */
.stop-btn::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 2px;
}

.empty-state,
.loading-state {
    padding: 40px 0;
    text-align: center;
}

@media (max-width: 768px) {
    .active-tasks-modal :deep(.el-dialog) {
        width: 95% !important;
        margin: 5vh auto !important;
    }

    .tasks-summary {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .summary-actions {
        margin-left: 0;
        width: 100%;
    }

    .task-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .task-actions {
        margin-left: 0;
        width: 100%;
        justify-content: flex-end;
    }

    .action-btn {
        width: 36px;
        height: 36px;
    }

    .task-details {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }
}
</style>
