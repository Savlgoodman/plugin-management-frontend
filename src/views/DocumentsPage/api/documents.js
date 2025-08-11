/**
 * 文档管理页面 API 接口
 * 提供虚拟数据接口，便于后期无缝切换到真实后端
 */

// 模拟状态数据
const mockStatsData = [
  {
    title: "总文档数",
    value: "1,296",
    icon: "Document",
    color: "#4285f4",
    trend: "已分类管理",
    subtitle: "",
  },
  {
    title: "本周新增",
    value: "48",
    icon: "Plus",
    color: "#34a853",
    trend: "较上周增长15%",
    subtitle: "",
  },
  {
    title: "文档分类",
    value: "16",
    icon: "Grid",
    color: "#ff9500",
    trend: "16个插件分类",
    subtitle: "",
  },
  {
    title: "下载次数",
    value: "3,842",
    icon: "Download",
    color: "#5856d6",
    trend: "今日下载124次",
    subtitle: "",
  },
];

// 模拟分类数据
const mockCategories = [
  {
    id: "news-crawler",
    name: "新闻采集器",
    plugin: "新闻采集器",
    count: 428,
    percentage: 85,
    color: "#4285f4",
    icon: "Reading",
  },
  {
    id: "ecommerce-spider",
    name: "电商数据爬虫",
    plugin: "电商数据爬虫",
    count: 312,
    percentage: 62,
    color: "#ea4335",
    icon: "ShoppingBag",
  },
  {
    id: "social-monitor",
    name: "社交媒体监控",
    plugin: "社交媒体监控",
    count: 285,
    percentage: 57,
    color: "#34a853",
    icon: "ChatDotSquare",
  },
  {
    id: "stock-collector",
    name: "股票信息采集",
    plugin: "股票信息采集",
    count: 156,
    percentage: 31,
    color: "#fbbc04",
    icon: "TrendCharts",
  },
  {
    id: "weather-collector",
    name: "天气数据采集",
    plugin: "天气数据采集",
    count: 89,
    percentage: 18,
    color: "#ff9500",
    icon: "Cloudy",
  },
  {
    id: "property-spider",
    name: "房产信息爬虫",
    plugin: "房产信息爬虫",
    count: 26,
    percentage: 5,
    color: "#5856d6",
    icon: "House",
  },
];

// 模拟文档列表数据
const mockDocuments = [
  {
    id: 1,
    name: "央视新闻：2024年政府工作报告解读",
    extension: ".html",
    type: "html",
    category: "新闻采集器",
    documentDate: "2024-01-15",
    collectDate: "2024-01-16",
    size: 2048576,
    downloadCount: 45,
  },
  {
    id: 2,
    name: "淘宝商品价格趋势分析数据",
    extension: ".json",
    type: "json",
    category: "电商数据爬虫",
    documentDate: "2024-01-14",
    collectDate: "2024-01-14",
    size: 1536000,
    downloadCount: 32,
  },
  {
    id: 3,
    name: "微博热搜话题统计报告",
    extension: ".csv",
    type: "csv",
    category: "社交媒体监控",
    documentDate: "2024-01-13",
    collectDate: "2024-01-13",
    size: 256000,
    downloadCount: 18,
  },
  {
    id: 4,
    name: "沪深300指数历史数据",
    extension: ".xlsx",
    type: "excel",
    category: "股票信息采集",
    documentDate: "2024-01-12",
    collectDate: "2024-01-12",
    size: 10485760,
    downloadCount: 8,
  },
  {
    id: 5,
    name: "北京市未来一周天气预报",
    extension: ".xml",
    type: "xml",
    category: "天气数据采集",
    documentDate: "2024-01-11",
    collectDate: "2024-01-11",
    size: 512000,
    downloadCount: 23,
  },
  {
    id: 6,
    name: "链家二手房价格统计表",
    extension: ".pdf",
    type: "pdf",
    category: "房产信息爬虫",
    documentDate: "2024-01-10",
    collectDate: "2024-01-10",
    size: 3145728,
    downloadCount: 15,
  },
  // 添加更多数据用于测试分页
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 7,
    name: `${
      [
        "新闻报道",
        "商品信息",
        "社交动态",
        "股票数据",
        "天气信息",
        "房产信息",
      ][i % 6]
    }${i + 7}`,
    extension: [".html", ".json", ".csv", ".xlsx", ".xml", ".pdf"][i % 6],
    type: ["html", "json", "csv", "excel", "xml", "pdf"][i % 6],
    category: [
      "新闻采集器",
      "电商数据爬虫",
      "社交媒体监控",
      "股票信息采集",
      "天气数据采集",
      "房产信息爬虫",
    ][i % 6],
    documentDate: `2024-01-${String(10 - (i % 10)).padStart(2, "0")}`,
    collectDate: `2024-01-${String(10 - (i % 10)).padStart(2, "0")}`,
    size: Math.floor(Math.random() * 10000000) + 100000,
    downloadCount: Math.floor(Math.random() * 100),
  })),
];

/**
 * 获取统计卡片数据
 * @returns {Promise<Array>} 统计数据数组
 */
export const getStatsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStatsData);
    }, 300);
  });
};

/**
 * 获取文档分类数据
 * @returns {Promise<Array>} 分类数据数组
 */
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

/**
 * 获取文档列表数据
 * @param {Object} params - 查询参数
 * @param {string} params.searchText - 搜索文本
 * @param {string} params.category - 分类筛选
 * @param {Array} params.dateRange - 日期范围
 * @returns {Promise<Array>} 文档数据数组
 */
export const getDocuments = ({ searchText, category, dateRange }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockDocuments;
      
      if (searchText) {
        filtered = filtered.filter((doc) =>
          doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      if (category) {
        filtered = filtered.filter((doc) => doc.category === category);
      }
      
      if (dateRange && dateRange.length === 2) {
        filtered = filtered.filter(
          (doc) =>
            doc.collectDate >= dateRange[0] && doc.collectDate <= dateRange[1]
        );
      }
      
      resolve(filtered);
    }, 500);
  });
};

/**
 * 刷新文档列表
 * @returns {Promise<void>}
 */
export const refreshDocuments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

/**
 * 批量下载文档
 * @param {Array} documentIds - 文档ID数组
 * @returns {Promise<void>}
 */
export const batchDownloadDocuments = (documentIds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

/**
 * 删除文档
 * @param {number} documentId - 文档ID
 * @returns {Promise<void>}
 */
export const deleteDocument = (documentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDocuments.findIndex((doc) => doc.id === documentId);
      if (index > -1) {
        mockDocuments.splice(index, 1);
        resolve();
      } else {
        reject(new Error("文档不存在"));
      }
    }, 500);
  });
};