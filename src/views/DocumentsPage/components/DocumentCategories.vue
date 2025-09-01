<template>
    <el-card class="document-categories-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><Grid /></el-icon>
                    <span class="header-title">文档分类</span>
                </div>
                <div class="header-right">
                    <el-tooltip content="刷新分类计数" placement="top">
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

        <!-- 分类列表 -->
        <div class="categories-list">
            <div
                v-for="category in categories"
                :key="category.id"
                :class="[
                    'category-item',
                    { active: selectedCategory === category.id },
                ]"
                @click="handleCategorySelect(category.id)"
            >
                <div class="category-content">
                    <div class="category-info">
                        <div
                            class="category-icon"
                            :style="{ color: category.color }"
                        >
                            <el-icon :size="16">
                                <component :is="category.icon" />
                            </el-icon>
                        </div>
                        <div class="category-details">
                            <div class="category-name">{{ category.name }}</div>
                            <div class="category-plugin">
                                {{ category.plugin }}
                            </div>
                        </div>
                    </div>
                    <div class="category-count">
                        <span class="count-number">{{ category.count }}</span>
                        <span class="count-label">文档</span>
                    </div>
                </div>
                <div class="category-progress">
                    <el-progress
                        :percentage="category.percentage"
                        :color="category.color"
                        :show-text="false"
                        :stroke-width="3"
                    />
                </div>
            </div>
        </div>

        <!-- 全部分类按钮 -->
        <div class="all-categories">
            <el-button
                :type="selectedCategory === 'all' ? 'primary' : 'default'"
                @click="handleCategorySelect('all')"
                class="all-btn"
            >
                <el-icon><List /></el-icon>
                查看全部分类
            </el-button>
        </div>
    </el-card>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { getCategories, updateDocumentCounts } from "../api/documents";

export default {
    name: "DocumentCategories",
    emits: ["category-change"],
    setup(props, { emit }) {
        const selectedCategory = ref("all");
        const categories = ref([]);
        const refreshing = ref(false);

        // 从 API 获取分类数据
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                categories.value = data;
                
                // 自动选择第一个分类
                if (data.length > 0 && selectedCategory.value === "all") {
                    await handleCategorySelect(data[0].id);
                }
            } catch (error) {
                console.error("获取分类数据失败:", error);
            }
        };

        loadCategories();

        // 存储选中的分类ID和对应的表名
        const selectedCategoryTable = ref("");

        const handleCategorySelect = async (categoryId) => {
            selectedCategory.value = categoryId;

            // 如果不是"全部分类"，获取该分类的表名
            if (categoryId !== "all") {
                const category = categories.value.find(
                    (c) => c.id === categoryId
                );
                if (category) {
                    selectedCategoryTable.value = category.table_name; // 使用table_name作为表名
                }
            } else {
                selectedCategoryTable.value = "";
            }

            emit("category-change", {
                categoryId: categoryId,
                tableName: selectedCategoryTable.value,
            });

            const categoryName =
                categoryId === "all"
                    ? "全部分类"
                    : categories.value.find((c) => c.id === categoryId)?.name;

            ElMessage.success(`已切换到：${categoryName}`);
        };

        const handleRefresh = async () => {
            if (refreshing.value) return; // 防止重复点击

            try {
                refreshing.value = true;

                // 调用更新计数接口
                const result = await updateDocumentCounts();

                if (result.taskStarted) {
                    ElMessage.success(result.message);

                    // 等待一段时间后刷新分类数据
                    setTimeout(async () => {
                        try {
                            await loadCategories();
                            ElMessage.success("分类数据已更新");
                        } catch (error) {
                            console.error("刷新分类数据失败:", error);
                            ElMessage.warning(
                                "计数更新成功，但刷新分类数据失败"
                            );
                        } finally {
                            refreshing.value = false;
                        }
                    }, 2000); // 等待2秒后刷新，给后台处理时间
                } else {
                    ElMessage.warning("更新任务启动失败");
                    refreshing.value = false;
                }
            } catch (error) {
                console.error("刷新失败:", error);
                ElMessage.error("刷新失败: " + error.message);
                refreshing.value = false;
            }
        };

        onMounted(() => {
            // 如果没有分类数据，初始化时通知父组件当前选中的分类
            if (categories.value.length === 0) {
                emit("category-change", {
                    categoryId: selectedCategory.value,
                    tableName: selectedCategoryTable.value,
                });
            }
        });

        return {
            selectedCategory,
            categories,
            refreshing,
            handleCategorySelect,
            handleRefresh,
        };
    },
};
</script>

<style scoped>
.document-categories-card {
    height: 100%;
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

.header-right {
    display: flex;
    align-items: center;
}

.refresh-btn {
    padding: 4px;
    border-radius: 6px;
}

.categories-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.category-item {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    background: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-item:hover {
    border-color: #4285f4;
    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.1);
    transform: translateY(-1px);
}

.category-item.active {
    border-color: #4285f4;
    background: #f0f7ff;
    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.15);
}

.category-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.category-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.category-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(66, 133, 244, 0.1);
}

.category-details {
    flex: 1;
}

.category-name {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    line-height: 1.2;
}

.category-plugin {
    font-size: 12px;
    color: #86909c;
    margin-top: 2px;
}

.category-count {
    text-align: right;
}

.count-number {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
}

.count-label {
    font-size: 12px;
    color: #86909c;
    margin-left: 2px;
}

.category-progress {
    margin-top: 8px;
}

.all-categories {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;
}

.all-btn {
    width: 100%;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .category-item {
        padding: 10px;
    }

    .category-icon {
        width: 28px;
        height: 28px;
    }

    .category-name {
        font-size: 13px;
    }

    .category-plugin {
        font-size: 11px;
    }

    .count-number {
        font-size: 14px;
    }
}
</style>
