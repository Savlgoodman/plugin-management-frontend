import { ref } from "vue";

// 模拟插件列表数据
const mockPlugins = [
    {
        id: 1,
        name: "新闻采集器",
        description: "采集各大新闻网站内容",
        status: "running",
        lastCollectTime: "2024-01-15 14:30:25",
        frequency: "每10分钟",
    },
    {
        id: 2,
        name: "电商数据爬虫",
        description: "采集电商平台商品信息",
        status: "running",
        lastCollectTime: "2024-01-15 14:28:12",
        frequency: "每30分钟",
    },
    {
        id: 3,
        name: "社交媒体监控",
        description: "监控社交媒体动态",
        status: "stopped",
        lastCollectTime: "2024-01-15 13:45:08",
        frequency: "每小时",
    },
    {
        id: 4,
        name: "股票信息采集",
        description: "实时采集股票价格信息",
        status: "running",
        lastCollectTime: "2024-01-15 14:29:55",
        frequency: "每5分钟",
    },
    {
        id: 5,
        name: "天气数据采集",
        description: "采集天气预报数据",
        status: "error",
        lastCollectTime: "2024-01-15 12:15:30",
        frequency: "每6小时",
    },
    {
        id: 6,
        name: "房产信息爬虫",
        description: "采集房产网站信息",
        status: "running",
        lastCollectTime: "2024-01-15 14:25:18",
        frequency: "每2小时",
    },
];

// 模拟插件状态统计数据
const mockStatusData = [
    {
        name: "活跃",
        value: 12,
        percentage: 75,
        color: "#00b42a",
    },
    {
        name: "准备中",
        value: 3,
        percentage: 18.75,
        color: "#4285f4",
    },
    {
        name: "执行中",
        value: 1,
        percentage: 6.25,
        color: "#fbbc04",
    },
];

// 模拟性能分析数据
const mockPerformanceData = {
    plugins: [
        "新闻采集器",
        "电商数据爬虫",
        "社交媒体监控",
        "股票信息采集",
        "天气数据采集",
        "房产信息爬虫",
    ],
    responseTime: [120, 85, 230, 45, 180, 95], // 响应时间(ms)
    successRate: [98.5, 99.2, 94.8, 99.8, 96.3, 98.9], // 成功率(%)
};

// 模拟最近采集数据
const mockRecentData = [
    {
        id: 1,
        sourceName: "交通运输部",
        collectionTime: "今天 09:24",
        icon: "Files",
        iconColor: "#4285f4",
        dataType: "政策文件",
        tagType: "primary",
        title: "关于进一步加强公路工程施工安全管理的通知",
        description:
            "为深入贯彻落实党中央、国务院关于安全生产工作的决策部署，切实加强公路工程施工安全管理，有效防范遏制重特大事故...",
        tags: [
            { name: "安全管理", type: "success" },
            { name: "施工规范", type: "info" },
        ],
    },
    {
        id: 2,
        sourceName: "安全与质量监管管理司",
        collectionTime: "今天 11:18",
        icon: "Warning",
        iconColor: "#f56c6c",
        dataType: "事故通报",
        tagType: "danger",
        title: "关于近期几起道路施工安全事故的通报",
        description:
            "近期，部分地区发生多起道路施工安全事故，造成人员伤亡和财产损失。为进一步加强道路施工安全管理，现将有关情况通报如下...",
        tags: [
            { name: "事故通报", type: "danger" },
            { name: "安全警示", type: "warning" },
        ],
    },
    {
        id: 3,
        sourceName: "交通运输部科学研究院",
        collectionTime: "今天 10:15",
        icon: "Document",
        iconColor: "#67c23a",
        dataType: "技术规范",
        tagType: "success",
        title: "公路工程智能化施工技术指南（2023版）",
        description:
            "为适应公路工程建设信息化发展要求，规范智能化施工技术的应用，提升工程建设质量和效率，制定本指南。本指南适用于新建、改建扩建的公路工程施工...",
        tags: [
            { name: "技术规范", type: "success" },
            { name: "智能化施工", type: "primary" },
        ],
    },
    {
        id: 4,
        sourceName: "综合规划司",
        collectionTime: "今天 08:45",
        icon: "DataBoard",
        iconColor: "#e6a23c",
        dataType: "统计数据",
        tagType: "warning",
        title: "2024年第一季度全国公路建设进展统计",
        description:
            "2024年第一季度，全国公路建设保持稳定增长态势，新开工项目152个，完工项目89个，累计完成投资2156.8亿元...",
        tags: [
            { name: "统计数据", type: "warning" },
            { name: "建设进展", type: "info" },
        ],
    },
    {
        id: 5,
        sourceName: "公路局",
        collectionTime: "昨天 16:30",
        icon: "Location",
        iconColor: "#909399",
        dataType: "工程信息",
        tagType: "info",
        title: "重点公路项目建设进展月报",
        description:
            "本月重点公路项目建设总体进展顺利，国道、省道改造升级项目按计划推进，高速公路新建项目土建工程完成度达到预期目标...",
        tags: [
            { name: "工程信息", type: "info" },
            { name: "进展月报", type: "primary" },
        ],
    },
    {
        id: 6,
        sourceName: "运输服务司",
        collectionTime: "昨天 14:22",
        icon: "Truck",
        iconColor: "#f89898",
        dataType: "服务通知",
        tagType: "primary",
        title: "关于优化货运车辆通行服务的通知",
        description:
            "为进一步优化货运车辆通行环境，提升物流效率，降低物流成本，现就有关事项通知如下...",
        tags: [
            { name: "服务通知", type: "primary" },
            { name: "货运服务", type: "success" },
        ],
    },
];

// 模拟文档列表数据
const mockDocumentList = [
    {
        id: 1,
        title: "数据采集报告",
        date: "2024-01-15",
        downloads: 128,
        icon: "Document",
        iconColor: "#4285f4",
    },
    {
        id: 2,
        title: "插件配置指南",
        date: "2024-01-14",
        downloads: 89,
        icon: "Setting",
        iconColor: "#34a853",
    },
    {
        id: 3,
        title: "系统架构文档",
        date: "2024-01-13",
        downloads: 156,
        icon: "Files",
        iconColor: "#fbbc04",
    },
    {
        id: 4,
        title: "API接口文档",
        date: "2024-01-12",
        downloads: 203,
        icon: "Connection",
        iconColor: "#ea4335",
    },
    {
        id: 5,
        title: "数据采集报告",
        date: "2024-01-15",
        downloads: 128,
        icon: "Document",
        iconColor: "#4285f4",
    },
    {
        id: 6,
        title: "插件配置指南",
        date: "2024-01-14",
        downloads: 89,
        icon: "Setting",
        iconColor: "#34a853",
    },
    {
        id: 7,
        title: "系统架构文档",
        date: "2024-01-13",
        downloads: 156,
        icon: "Files",
        iconColor: "#fbbc04",
    },
    {
        id: 8,
        title: "API接口文档",
        date: "2024-01-12",
        downloads: 203,
        icon: "Connection",
        iconColor: "#ea4335",
    },
    {
        id: 9,
        title: "API接口文档",
        date: "2024-01-12",
        downloads: 203,
        icon: "Connection",
        iconColor: "#ea4335",
    },
];

/**
 * 获取插件列表
 * GET /api/plugins
 * @param {Object} params - 查询参数
 * @param {string} params.searchText - 搜索文本
 * @param {string} params.status - 状态筛选 (running, stopped, error)
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Object} 分页数据
 */
export const getPlugins = (params = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredData = [...mockPlugins];

            // 搜索过滤
            if (params.searchText) {
                filteredData = filteredData.filter(
                    (plugin) =>
                        plugin.name
                            .toLowerCase()
                            .includes(params.searchText.toLowerCase()) ||
                        plugin.description
                            .toLowerCase()
                            .includes(params.searchText.toLowerCase())
                );
            }

            // 状态过滤
            if (params.status) {
                filteredData = filteredData.filter(
                    (plugin) => plugin.status === params.status
                );
            }

            // 分页
            const total = filteredData.length;
            const start = (params.page - 1) * params.pageSize;
            const end = start + params.pageSize;
            const data = filteredData.slice(start, end);

            resolve({
                code: 200,
                message: "success",
                data: {
                    list: data,
                    total: total,
                    page: params.page,
                    pageSize: params.pageSize,
                },
            });
        }, 300);
    });
};

/**
 * 获取插件状态统计
 * GET /api/plugins/status
 * @returns {Object} 状态统计数据
 */
export const getPluginStatus = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                message: "success",
                data: mockStatusData,
            });
        }, 300);
    });
};
/**
 * 获取数据展示卡片数据
 * GET /api/plugins/stats
 * @returns {Object} 数据展示卡片数据
 */
export const getStatsData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockStatsData_1 = [
                {
                    title: "活跃插件",
                    value: "16",
                    icon: "Download",
                    color: "#4285f4",
                    trend: "全部正在运行",
                    subtitle: "",
                },
                {
                    title: "今日采集",
                    value: "248",
                    icon: "DataBoard",
                    color: "#34a853",
                    trend: "较昨日增长12%",
                    subtitle: "",
                },
                {
                    title: "文档数量",
                    value: "1,296",
                    icon: "Document",
                    color: "#4285f4",
                    trend: "已分类管理",
                    subtitle: "",
                },
                {
                    title: "采集状态",
                    value: "100%",
                    icon: "TrendCharts",
                    color: "#fbbc04",
                    trend: "2个源略有故障",
                    subtitle: "",
                },
            ];
            resolve({
                code: 200,
                message: "success",
                data: mockStatsData_1,
            });
        }, 300);
    });
};

/**
 * 获取性能分析数据
 * GET /api/plugins/performance
 * @returns {Object} 性能分析数据
 */
export const getPerformanceData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                message: "success",
                data: mockPerformanceData,
            });
        }, 300);
    });
};

/**
 * 获取最近采集数据
 * GET /api/plugins/recent-collection
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Object} 最近采集数据
 */
export const getRecentCollectionData = (params = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟分页
            const total = mockRecentData.length;
            const start = (params.page - 1) * params.pageSize;
            const end = start + params.pageSize;
            const data = mockRecentData.slice(start, end);

            resolve({
                code: 200,
                message: "success",
                data: {
                    list: data,
                    total: total,
                    page: params.page,
                    pageSize: params.pageSize,
                },
            });
        }, 300);
    });
};

/**
 * 获取文档列表
 * GET /api/plugins/documents
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Object} 文档列表数据
 */
export const getDocumentList = (params = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟分页
            const total = mockDocumentList.length;
            const start = (params.page - 1) * params.pageSize;
            const end = start + params.pageSize;
            const data = mockDocumentList.slice(start, end);

            resolve({
                code: 200,
                message: "success",
                data: {
                    list: data,
                    total: total,
                    page: params.page,
                    pageSize: params.pageSize,
                },
            });
        }, 300);
    });
};
