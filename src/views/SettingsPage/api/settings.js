import { ref, computed } from "vue";

// 模拟系统信息数据
const mockSystemInfo = {
    serverStatus: "running",
    lastUpdateTime: "2024-01-15 14:30:25",
    dbStatus: "connected",
    usedStorage: "66 GB",
    totalStorage: "100 GB",
    storageUsage: 66,
};

// 模拟基本设置数据
const mockBasicSettings = {
    systemName: "数据采集管理系统",
    systemDesc: "用于管理和监控数据采集任务的综合平台",
    version: "v2.3.1",
    timezone: "Asia/Shanghai",
    username: "admin",
    name: "管理员",
};

// 模拟日志数据
const mockLogsData = [
    {
        id: 1,
        timestamp: "2024-01-15 14:30:25",
        type: "info",
        source: "系统核心",
        message: "系统启动成功，服务正常运行中",
    },
    {
        id: 2,
        timestamp: "2024-01-15 14:28:12",
        type: "warning",
        source: "数据库连接池",
        message: "数据库连接数达到80%阈值，建议优化查询性能",
    },
    {
        id: 3,
        timestamp: "2024-01-15 14:25:08",
        type: "error",
        source: "文件上传服务",
        message: "文件上传失败：磁盘空间不足，剩余空间仅剩5%",
    },
    {
        id: 4,
        timestamp: "2024-01-15 14:22:55",
        type: "debug",
        source: "数据采集模块",
        message: "采集任务[新闻采集器]执行完成，共采集128条数据",
    },
    {
        id: 5,
        timestamp: "2024-01-15 14:20:30",
        type: "info",
        source: "用户管理",
        message: "管理员[admin]登录系统",
    },
    {
        id: 6,
        timestamp: "2024-01-15 14:18:15",
        type: "warning",
        source: "缓存服务",
        message: "Redis缓存命中率下降至65%，建议检查缓存策略",
    },
    {
        id: 7,
        timestamp: "2024-01-15 14:15:42",
        type: "error",
        source: "API网关",
        message: "外部API调用失败：超时（30s），目标服务响应缓慢",
    },
    {
        id: 8,
        timestamp: "2024-01-15 14:12:20",
        type: "debug",
        source: "任务调度器",
        message: "定时任务[每日数据备份]开始执行",
    },
    {
        id: 9,
        timestamp: "2024-01-15 14:10:05",
        type: "info",
        source: "安全审计",
        message: "检测到异常登录尝试，已自动封锁IP地址 192.168.1.100",
    },
    {
        id: 10,
        timestamp: "2024-01-15 14:08:33",
        type: "warning",
        source: "消息队列",
        message: "消息队列积压达到1000条，消费者处理速度较慢",
    },
];

// API 函数

// 获取系统信息
export const getSystemInfo = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟API延迟
            const systemInfo = { ...mockSystemInfo };
            // 更新最后更新时间
            systemInfo.lastUpdateTime = new Date().toLocaleString("zh-CN");
            resolve({
                success: true,
                data: systemInfo,
            });
        }, 300);
    });
};

// 获取基本设置
export const getBasicSettings = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟API延迟
            resolve({
                success: true,
                data: { ...mockBasicSettings },
            });
        }, 300);
    });
};

// 获取系统日志
export const getSystemLogs = (params = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟API延迟
            let filteredLogs = [...mockLogsData];

            // 关键词搜索
            if (params.searchText) {
                filteredLogs = filteredLogs.filter(
                    (log) =>
                        log.message
                            .toLowerCase()
                            .includes(params.searchText.toLowerCase()) ||
                        log.source
                            .toLowerCase()
                            .includes(params.searchText.toLowerCase())
                );
            }

            // 日志类型筛选
            if (params.logType) {
                filteredLogs = filteredLogs.filter(
                    (log) => log.type === params.logType
                );
            }

            // 日期范围筛选
            if (params.dateRange && params.dateRange.length === 2) {
                filteredLogs = filteredLogs.filter(
                    (log) =>
                        log.timestamp >= params.dateRange[0] &&
                        log.timestamp <= params.dateRange[1]
                );
            }

            resolve({
                success: true,
                data: filteredLogs,
            });
        }, 300);
    });
};

// 保存系统设置
export const saveSystemSettings = (settings) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟保存操作
            console.log("保存系统设置:", settings);
            resolve({
                success: true,
                message: "系统设置保存成功",
            });
        }, 500);
    });
};

// 保存用户设置
export const saveUserSettings = (settings) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟保存操作
            console.log("保存用户设置:", settings);
            resolve({
                success: true,
                message: "用户设置保存成功，请重新登录",
            });
        }, 500);
    });
};
