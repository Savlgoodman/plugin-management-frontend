<template>
    <el-affix :offset="0">
        <div class="top-navbar">
            <div class="navbar-container">
                <!-- 左侧Logo和网站名称 -->
                <div class="navbar-left">
                    <div class="logo-section">
                        <div class="logo-wrapper">
                            <el-icon class="logo-icon" size="24">
                                <Grid />
                            </el-icon>
                        </div>
                        <div class="site-info">
                            <div class="site-name">蜀道数据采集系统</div>
                            <div class="site-desc">数据采集与管理平台</div>
                        </div>
                    </div>
                </div>

                <!-- 中间菜单 -->
                <div class="navbar-center">
                    <div class="menu-wrapper">
                        <div
                            v-for="menu in menuItems"
                            :key="menu.index"
                            :class="[
                                'menu-item',
                                { active: activeIndex === menu.index },
                            ]"
                            @click="handleSelect(menu.index)"
                        >
                            <el-icon class="menu-icon">
                                <component :is="menu.icon" />
                            </el-icon>
                            <span class="menu-text">{{ menu.text }}</span>
                        </div>
                    </div>
                </div>

                <!-- 右侧通知和用户信息 -->
                <div class="navbar-right">
                    <!-- 通知图标 -->
                    <div class="notification-wrapper">
                        <el-badge
                            :value="1"
                            :max="99"
                            class="notification-badge"
                        >
                            <div class="notification-btn">
                                <el-icon size="16"><Bell /></el-icon>
                            </div>
                        </el-badge>
                    </div>

                    <!-- 用户信息 -->
                    <el-dropdown trigger="click" class="user-dropdown">
                        <div class="user-info">
                            <el-avatar :size="32" class="user-avatar">
                                <el-icon><User /></el-icon>
                            </el-avatar>
                            <span class="username">管理员</span>
                            <el-icon class="dropdown-icon"
                                ><ArrowDown
                            /></el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu class="user-menu">
                                <el-dropdown-item>
                                    <el-icon><User /></el-icon>
                                    个人中心
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-icon><Setting /></el-icon>
                                    账户设置
                                </el-dropdown-item>
                                <el-dropdown-item divided @click="handleLogout">
                                    <el-icon><SwitchButton /></el-icon>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </el-affix>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
    name: "TopNavbar",
    setup() {
        const router = useRouter();
        const route = useRoute();

        // 退出登录处理
        const handleLogout = () => {
            // 清除本地存储的token
            localStorage.removeItem("access-token");
            // 跳转到登录页
            router.push("/login");
        };

        const menuItems = ref([
            {
                index: "plugins",
                text: "采集插件",
                icon: "Download",
            },
            {
                index: "documents",
                text: "公文管理",
                icon: "Document",
            },
            {
                index: "files",
                text: "规范管理",
                icon: "Files",
            },
            {
                index: "settings",
                text: "系统设置",
                icon: "Setting",
            },
            {
                index: "analytics",
                text: "数据分析",
                icon: "TrendCharts",
            },
        ]);

        const activeIndex = computed(() => {
            const routeName = route.name;
            if (routeName === "plugins") return "plugins";
            if (routeName === "documents") return "documents";
            if (routeName === "files") return "files";
            if (routeName === "settings") return "settings";
            if (routeName === "analytics") return "analytics";
            return "plugins";
        });

        const handleSelect = (key) => {
            router.push({ name: key });
        };

        return {
            menuItems,
            activeIndex,
            handleSelect,
            handleLogout,
        };
    },
};
</script>

<style scoped>
.top-navbar {
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid #f0f0f0;
}

.navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    width: 100%;
}

/* 左侧Logo区域 */
.navbar-left {
    flex: 0 0 auto;
    min-width: 280px;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-wrapper {
    width: 40px;
    height: 40px;
    background: #4285f4;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-icon {
    color: white;
}

.site-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.site-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
    line-height: 1.2;
}

.site-desc {
    font-size: 12px;
    color: #86909c;
    line-height: 1.2;
}

/* 中间菜单区域 */
.navbar-center {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 600px;
    margin: 0 40px;
}

.menu-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #4e5969;
    white-space: nowrap;
}

.menu-item:hover {
    background: #f7f8fa;
    color: #4285f4;
}

.menu-item.active {
    background: #e8f4fd;
    color: #4285f4;
}

.menu-icon {
    font-size: 16px;
    flex-shrink: 0;
}

.menu-text {
    font-weight: 500;
    flex-shrink: 0;
}

/* 右侧用户区域 */
.navbar-right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 160px;
    justify-content: flex-end;
}

.notification-wrapper {
    display: flex;
    align-items: center;
}

.notification-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: #f7f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #4e5969;
}

.notification-btn:hover {
    background: #e8f4fd;
    color: #4285f4;
}

.notification-badge :deep(.el-badge__content) {
    border-radius: 50% !important;
    min-width: 18px !important;
    height: 18px !important;
    line-height: 18px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    border: 2px solid #ffffff !important;
    box-sizing: border-box !important;
}

.user-dropdown {
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.user-info:hover {
    background: #f7f8fa;
}

.user-avatar {
    background: #4285f4;
    color: white;
    border: none;
}

.username {
    color: #1f2329;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
}

.dropdown-icon {
    color: #86909c;
    font-size: 12px;
    transition: transform 0.2s ease;
}

.user-info:hover .dropdown-icon {
    color: #4e5969;
}

.user-menu {
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e6eb;
    margin-top: 4px;
}

.user-menu .el-dropdown-menu__item {
    padding: 10px 16px;
    border-radius: 4px;
    margin: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4e5969;
    transition: all 0.2s ease;
}

.user-menu .el-dropdown-menu__item:hover {
    background: #f7f8fa;
    color: #4285f4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .navbar-center {
        margin: 0 20px;
    }

    .menu-item {
        padding: 8px 12px;
        font-size: 13px;
    }
}

@media (max-width: 1024px) {
    .navbar-left {
        min-width: 200px;
    }

    .site-desc {
        display: none;
    }

    .menu-wrapper {
        gap: 4px;
    }

    .menu-item {
        padding: 8px 10px;
    }
}

@media (max-width: 768px) {
    .navbar-container {
        padding: 0 16px;
    }

    .navbar-center {
        margin: 0 12px;
    }

    .menu-text {
        display: none;
    }

    .menu-item {
        padding: 8px;
    }

    .username {
        display: none;
    }

    .navbar-right {
        min-width: auto;
        gap: 12px;
    }
}
</style>
