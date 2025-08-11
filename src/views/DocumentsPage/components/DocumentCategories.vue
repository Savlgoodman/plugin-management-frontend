<template>
    <el-card class="document-categories-card">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <el-icon class="header-icon"><Grid /></el-icon>
                    <span class="header-title">文档分类</span>
                </div>
                <div class="header-right">
                    <el-tooltip content="刷新分类" placement="top">
                        <el-button
                            text
                            @click="handleRefresh"
                            class="refresh-btn"
                        >
                            <el-icon><Refresh /></el-icon>
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getCategories } from "../api/documents";

export default {
    name: "DocumentCategories",
    emits: ["category-change"],
    setup(props, { emit }) {
        const selectedCategory = ref("all");
        const categories = ref([]);
        
        // 从 API 获取分类数据
        getCategories().then(data => {
            categories.value = data;
        });

        const handleCategorySelect = (categoryId) => {
            selectedCategory.value = categoryId;
            emit("category-change", categoryId);

            const categoryName =
                categoryId === "all"
                    ? "全部分类"
                    : categories.value.find((c) => c.id === categoryId)?.name;

            ElMessage.success(`已切换到：${categoryName}`);
        };

        const handleRefresh = () => {
            ElMessage.success("分类数据已刷新");
            // 这里可以添加实际的刷新逻辑
        };

        onMounted(() => {
            // 初始化时通知父组件当前选中的分类
            emit("category-change", selectedCategory.value);
        });

        return {
            selectedCategory,
            categories,
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
