/**
 * 文档管理页面 API 接口
 * 适配新的后端API接口
 */
import request from "../../../utils/request.js";

/**
 * 获取所有文档分类
 * @returns {Promise<Array>} 分类数据数组
 */
export const getCategories = () => {
    return request.get("/doc/docs").then((response) => {
        // 将后端返回的数据格式转换为组件需要的格式
        return response.data.map((category) => ({
            id: category.id,
            name: category.name,
            plugin: category.name,
            count: category.count,
            percentage: 100,
            color: getColorBySource(category.source),
            icon: getIconBySource(category.source),
            table_name: category.table_name
        }));
    });
};

/**
 * 根据数据源获取颜色
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
export const getTableColumns = (tableName) => {
    return request
        .get("/doc/columns", {
            params: {
                table_name: tableName
            }
        })
        .then((response) => {
            return response.data;
        });
};

/**
 * 获取表数据
 * @param {string} tableName - 表名
 * @param {string} columns - 需要展示的字段名称，使用逗号分隔
 * @param {number} skip - 跳过的记录数
 * @param {number} limit - 返回的记录数
 * @returns {Promise<Object>} 包含数据、总数、跳过数和限制数的对象
 */
export const getTableData = (tableName, columns, skip = 0, limit = 20) => {
    const params = {
        table_name: tableName,
        skip: skip,
        limit: limit,
    };

    if (columns) {
        params.columns = columns;
    }

    return request
        .get("/doc/data", {
            params: params
        })
        .then((response) => {
            return {
                data: response.data.data,
                total: response.data.total,
                skip: response.data.skip,
                limit: response.data.limit,
            };
        });
};

/**
 * 刷新文档列表
 * @returns {Promise<void>}
 */
export const refreshDocuments = () => {
    // 这里可以添加刷新逻辑
    return Promise.resolve();
};

/**
 * 批量下载文档
 * @param {Array} documentIds - 文档ID数组
 * @returns {Promise<void>}
 */
export const batchDownloadDocuments = (documentIds) => {
    return Promise.resolve();
};

/**
 * 删除文档
 * @param {number} documentId - 文档ID
 * @returns {Promise<void>}
 */
export const deleteDocument = (documentId) => {
    // 暂时不实现删除功能
    return Promise.resolve();
};
