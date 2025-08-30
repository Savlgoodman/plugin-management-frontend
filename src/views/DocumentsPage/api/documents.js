/**
 * 文档管理页面 API 接口
 * 使用项目统一的request工具进行HTTP请求
 */
import request from "../../../utils/request.js";

/**
 * 获取所有文档分类
 * @returns {Promise<Array>} 分类数据数组
 */
export const getCategories = async () => {
    try {
        const response = await request.get("/doc/docs");

        // 将后端返回的数据格式转换为组件需要的格式
        return response.data.map((category) => ({
            id: category.id,
            name: category.name,
            plugin: category.name,
            count: category.count,
            percentage: 100,
            color: getColorBySource(category.source),
            icon: getIconBySource(category.source),
            table_name: category.table_name,
        }));
    } catch (error) {
        console.error("获取分类失败:", error);
        throw new Error("获取分类失败");
    }
};

/**
 * 根据数据源获取颜色
 * @param {number} source - 数据源ID
 * @returns {string} 颜色值
 */
function getColorBySource(source) {
    const colors = {
        1: "#4285f4", // 蓝色
        2: "#ea4335", // 红色
        3: "#34a853", // 绿色
        4: "#fbbc04", // 黄色
        5: "#ff9500", // 橙色
        6: "#5856d6", // 紫色
    };
    return colors[source] || "#666666";
}

/**
 * 根据数据源获取图标
 * @param {number} source - 数据源ID
 * @returns {string} 图标名称
 */
function getIconBySource(source) {
    const icons = {
        1: "Reading",
        2: "ShoppingBag",
        3: "ChatDotSquare",
        4: "TrendCharts",
        5: "Cloudy",
        6: "House",
    };
    return icons[source] || "Document";
}

/**
 * 获取表字段信息
 * @param {string} tableName - 表名
 * @returns {Promise<Array>} 字段信息数组
 */
export const getTableColumns = async (tableName) => {
    try {
        if (!tableName) {
            throw new Error("表名不能为空");
        }

        const response = await request.get("/doc/columns", {
            params: {
                table_name: tableName,
            },
        });

        return response.data || [];
    } catch (error) {
        console.error("获取表字段失败:", error);
        throw new Error("获取表字段失败");
    }
};

/**
 * 获取表数据
 * @param {string} tableName - 表名
 * @param {string} columns - 需要展示的字段名称，使用逗号分隔
 * @param {number} skip - 跳过的记录数
 * @param {number} limit - 返回的记录数
 * @returns {Promise<Object>} 包含数据、总数、跳过数和限制数的对象
 */
export const getTableData = async (
    tableName,
    columns,
    skip = 0,
    limit = 20
) => {
    try {
        if (!tableName) {
            throw new Error("表名不能为空");
        }

        const params = {
            table_name: tableName,
            skip: skip,
            limit: limit,
        };

        if (columns && columns.trim()) {
            params.columns = columns;
        }

        const response = await request.get("/doc/data", {
            params: params,
        });

        return {
            data: response.data?.data || [],
            total: response.data?.total || 0,
            skip: response.data?.skip || 0,
            limit: response.data?.limit || limit,
        };
    } catch (error) {
        console.error("获取表数据失败:", error);
        throw new Error("获取表数据失败");
    }
};

/**
 * 刷新文档列表
 * @returns {Promise<void>}
 */
export const refreshDocuments = async () => {
    try {
        // 这里可以添加刷新逻辑，比如清除缓存等
        await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟刷新延时
        return Promise.resolve();
    } catch (error) {
        console.error("刷新文档失败:", error);
        throw new Error("刷新文档失败");
    }
};

/**
 * 批量下载文档
 * @param {Array} documentIds - 文档ID数组
 * @returns {Promise<void>}
 */
export const batchDownloadDocuments = async (documentIds) => {
    try {
        if (!Array.isArray(documentIds) || documentIds.length === 0) {
            throw new Error("文档ID数组不能为空");
        }

        // 这里应该实现实际的批量下载逻辑
        // const response = await request.post("/doc/batch-download", { ids: documentIds });

        return Promise.resolve();
    } catch (error) {
        console.error("批量下载失败:", error);
        throw new Error("批量下载失败");
    }
};

/**
 * 删除文档
 * @param {number|string} documentId - 文档ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (documentId) => {
    try {
        if (!documentId) {
            throw new Error("文档ID不能为空");
        }

        // 这里应该实现实际的删除逻辑
        // const response = await request.delete(`/doc/documents/${documentId}`);

        // 暂时不实现删除功能，返回成功
        await new Promise((resolve) => setTimeout(resolve, 300)); // 模拟删除延时
        return Promise.resolve();
    } catch (error) {
        console.error("删除文档失败:", error);
        throw new Error("删除文档失败");
    }
};

/**
 * 预览文档
 * @param {number|string} documentId - 文档ID
 * @returns {Promise<string>} 预览URL或内容
 */
export const previewDocument = async (documentId) => {
    try {
        if (!documentId) {
            throw new Error("文档ID不能为空");
        }

        // 这里应该实现实际的预览逻辑
        // const response = await request.get(`/doc/preview/${documentId}`);

        return Promise.resolve(`/api/doc/preview/${documentId}`);
    } catch (error) {
        console.error("预览文档失败:", error);
        throw new Error("预览文档失败");
    }
};

/**
 * 下载文档
 * @param {number|string} documentId - 文档ID
 * @returns {Promise<string>} 下载URL
 */
export const downloadDocument = async (documentId) => {
    try {
        if (!documentId) {
            throw new Error("文档ID不能为空");
        }

        // 这里应该实现实际的下载逻辑
        // const response = await request.get(`/doc/download/${documentId}`);

        return Promise.resolve(`/api/doc/download/${documentId}`);
    } catch (error) {
        console.error("下载文档失败:", error);
        throw new Error("下载文档失败");
    }
};

/**
 * 导出文档数据
 * @param {Object} filters - 筛选条件
 * @returns {Promise<string>} 导出文件URL
 */
export const exportDocuments = async (filters = {}) => {
    try {
        // 这里应该实现实际的导出逻辑
        // const response = await request.post("/doc/export", filters);

        return Promise.resolve("/api/doc/export/documents.xlsx");
    } catch (error) {
        console.error("导出文档失败:", error);
        throw new Error("导出文档失败");
    }
};

/**
 * 异步更新所有文档计数
 * 批量更新所有文档记录的计数，不阻塞主线程
 * @returns {Promise<Object>} 更新任务信息
 */
export const updateDocumentCounts = async () => {
    try {
        const response = await request.post("/doc/update-counts");

        return {
            taskStarted: response.data?.task_started || false,
            isAsync: response.data?.is_async || false,
            startTime: response.data?.start_time || null,
            message: response.message || "文档计数更新任务已启动",
        };
    } catch (error) {
        console.error("更新文档计数失败:", error);
        throw new Error("更新文档计数失败");
    }
};
