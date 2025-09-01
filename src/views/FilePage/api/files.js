import request from "../../../utils/request.js";
import axios from "axios";

// 创建专用于文件下载的 axios 实例，支持更长超时时间
const downloadRequest = axios.create({
    baseURL: "/api",
    timeout: 300000, // 5分钟超时，适合大文件下载
});

// 为下载请求添加认证头
downloadRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
        config.headers["access-token"] = token;
    }
    return config;
});

/**
 * 获取可下载模式的插件列表
 * @returns {Promise<Object>} 可下载插件列表数据
 */
export const getDownloadablePlugins = async () => {
    try {
        const response = await request.get("/file/downloadable-plugins");
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取可下载插件列表失败:", error);
        return {
            success: false,
            data: { plugins: [], total: 0 },
            message: error.message || "获取可下载插件列表失败",
        };
    }
};

/**
 * 获取插件列表（用于转换）
 * @returns {Promise<Object>} 插件列表数据
 */
export const fetchPluginsList = async () => {
    try {
        const response = await request.get("/plugin/list");
        return {
            success: true,
            data: response.data || [],
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取插件列表失败:", error);
        return {
            success: false,
            data: [],
            message: error.message || "获取插件列表失败",
        };
    }
};

/**
 * 转换数据表为文件下载表
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 转换结果
 */
export const convertTable = async (pluginId) => {
    try {
        const response = await request.post("/file/convert-table", {
            plugin_id: pluginId,
        });
        return {
            success: true,
            data: response.data || {},
            message: response.message || "转换成功",
        };
    } catch (error) {
        console.error("转换数据表失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "转换数据表失败",
        };
    }
};

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

        console.log("正在获取表字段，表名:", tableName);

        const response = await request.get("/doc/columns", {
            params: {
                table_name: tableName,
            },
        });

        console.log("表字段响应:", response);

        // 处理响应数据，提取字段名称
        const columnsData = response.data || response || [];

        if (Array.isArray(columnsData)) {
            // 提取每个字段对象的 name 属性
            const columnNames = columnsData
                .map((column) => {
                    if (typeof column === "object" && column.name) {
                        return column.name;
                    } else if (typeof column === "string") {
                        return column;
                    }
                    return null;
                })
                .filter((name) => name !== null);

            console.log("提取的字段名称:", columnNames);
            return columnNames;
        } else {
            console.warn("字段数据格式异常:", columnsData);
            return [];
        }
    } catch (error) {
        console.error("获取表字段失败:", error);
        console.error("错误详情:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        throw new Error(`获取表字段失败: ${error.message}`);
    }
};

/**
 * 创建下载配置
 * @param {Object} config - 配置信息
 * @returns {Promise<Object>} 创建结果
 */
export const createDownloadConfig = async (config) => {
    try {
        const response = await request.post("/file/download-config", config);
        return {
            success: true,
            data: response.data || {},
            message: response.message || "配置创建成功",
        };
    } catch (error) {
        console.error("创建下载配置失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "创建下载配置失败",
        };
    }
};

/**
 * 获取下载配置
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 配置信息
 */
export const getDownloadConfig = async (pluginId) => {
    try {
        const response = await request.get(`/file/download-config/${pluginId}`);
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取下载配置失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "获取下载配置失败",
        };
    }
};

/**
 * 更新下载配置
 * @param {number} pluginId - 插件ID
 * @param {Object} config - 配置信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateDownloadConfig = async (pluginId, config) => {
    try {
        const response = await request.put(
            `/file/download-config/${pluginId}`,
            config
        );
        return {
            success: true,
            data: response.data || {},
            message: response.message || "更新成功",
        };
    } catch (error) {
        console.error("更新下载配置失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "更新下载配置失败",
        };
    }
};

/**
 * 删除下载配置
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteDownloadConfig = async (pluginId) => {
    try {
        const response = await request.delete(
            `/file/download-config/${pluginId}`
        );
        return {
            success: true,
            data: response.data || {},
            message: response.message || "删除成功",
        };
    } catch (error) {
        console.error("删除下载配置失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "删除下载配置失败",
        };
    }
};

/**
 * 启动文件下载任务
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 启动结果
 */
export const startDownload = async (pluginId) => {
    try {
        const response = await request.post("/file/start-download", {
            plugin_id: pluginId,
        });
        return {
            success: true,
            data: response.data || {},
            message: response.message || "启动成功",
        };
    } catch (error) {
        console.error("启动下载任务失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "启动下载任务失败",
        };
    }
};

/**
 * 停止文件下载任务
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 停止结果
 */
export const stopDownload = async (pluginId) => {
    try {
        const response = await request.post(`/file/stop-download/${pluginId}`);
        return {
            success: true,
            data: response.data || {},
            message: response.message || "停止成功",
        };
    } catch (error) {
        console.error("停止下载任务失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "停止下载任务失败",
        };
    }
};

/**
 * 获取下载状态
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 状态信息
 */
export const getDownloadStatus = async (pluginId) => {
    try {
        const response = await request.get(`/file/download-status/${pluginId}`);
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取下载状态失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "获取下载状态失败",
        };
    }
};

/**
 * 获取下载进度 - 暂时禁用，功能需重新设计
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 进度信息
 */
// export const getDownloadProgress = async (pluginId) => {
//     try {
//         const response = await request.get(
//             `/file/download-progress/${pluginId}`
//         );
//         return {
//             success: true,
//             data: response.data || {},
//             message: response.message || "获取成功",
//         };
//     } catch (error) {
//         console.error("获取下载进度失败:", error);
//         return {
//             success: false,
//             data: {},
//             message: error.message || "获取下载进度失败",
//         };
//     }
// };

/**
 * 获取下载日志
 * @param {number} pluginId - 插件ID
 * @param {number} lines - 日志行数
 * @returns {Promise<Object>} 日志信息
 */
export const getDownloadLogs = async (pluginId, lines = 100) => {
    try {
        const response = await request.get(`/file/download-logs/${pluginId}`, {
            params: { lines },
        });
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取下载日志失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "获取下载日志失败",
        };
    }
};

/**
 * 获取正在下载的插件列表
 * @returns {Promise<Object>} 下载中的插件列表
 */
export const getDownloadingPlugins = async () => {
    try {
        const response = await request.get("/file/downloading-plugins");
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取下载中插件列表失败:", error);
        return {
            success: false,
            data: { downloading_plugins: [], total_downloading: 0 },
            message: error.message || "获取下载中插件列表失败",
        };
    }
};

/**
 * 分页获取文件记录
 * @param {number} pluginId - 插件ID
 * @param {number} skip - 跳过记录数
 * @param {number} limit - 返回记录数
 * @returns {Promise<Object>} 文件记录数据
 */
export const getFileRecords = async (pluginId, skip = 0, limit = 100) => {
    try {
        const response = await request.get(`/file/file-records/${pluginId}`, {
            params: { skip, limit },
        });
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取成功",
        };
    } catch (error) {
        console.error("获取文件记录失败:", error);
        return {
            success: false,
            data: { records: [], pagination: {}, plugin_info: {} },
            message: error.message || "获取文件记录失败",
        };
    }
};

/**
 * 重置失败的下载记录
 * @param {number} pluginId - 插件ID
 * @returns {Promise<Object>} 重置结果
 */
export const resetFailedRecords = async (pluginId) => {
    try {
        const response = await request.post(`/file/reset-failed/${pluginId}`);
        return {
            success: true,
            data: response.data || {},
            message: response.message || "重置成功",
        };
    } catch (error) {
        console.error("重置失败记录失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "重置失败记录失败",
        };
    }
};

/**
 * 创建批量下载ZIP文件
 * @param {number} pluginId - 插件ID
 * @param {Array<number>} recordIds - 记录ID列表
 * @returns {Promise<Object>} 创建结果
 */
export const createBatchDownload = async (pluginId, recordIds) => {
    try {
        const response = await request.post("/file/batch-download", {
            plugin_id: pluginId,
            record_ids: recordIds,
        });
        return {
            success: true,
            data: response.data || {},
            message: response.message || "创建成功",
        };
    } catch (error) {
        console.error("创建批量下载失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "创建批量下载失败",
        };
    }
};

/**
 * 获取下载令牌
 * @param {number} pluginId - 插件ID
 * @param {string} zipFilename - ZIP文件名
 * @returns {Promise<Object>} 令牌信息
 */
export const getDownloadToken = async (pluginId, zipFilename) => {
    try {
        const response = await request.get(
            `/file/download-token/${pluginId}/${zipFilename}`
        );
        return {
            success: true,
            data: response.data || {},
            message: response.message || "获取令牌成功",
        };
    } catch (error) {
        console.error("获取下载令牌失败:", error);
        return {
            success: false,
            data: {},
            message: error.message || "获取下载令牌失败",
        };
    }
};

/**
 * 简单的ZIP文件下载方法 - 使用原有的短超时时间
 * @param {number} pluginId - 插件ID
 * @param {string} zipFilename - ZIP文件名
 * @returns {Promise<Object>} 下载操作结果
 */
export const downloadZip = async (pluginId, zipFilename) => {
    try {
        const response = await request.get(
            `/file/download-zip/${pluginId}/${zipFilename}`,
            {
                responseType: "blob",
            }
        );

        // 检查响应数据
        if (!response.data || response.data.size === 0) {
            throw new Error("下载的文件为空或无效");
        }

        console.log("下载文件大小:", response.data.size, "bytes");

        let blob = response.data;
        if (!blob.type || blob.type === "application/octet-stream") {
            blob = new Blob([blob], { type: "application/zip" });
        }

        // 使用createObjectURL + 隐藏链接下载
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = zipFilename;
        link.style.display = "none";

        // 安全地添加到DOM并触发点击
        try {
            document.body.appendChild(link);
            link.click();

            // 延迟清理，避免DOM操作冲突
            setTimeout(() => {
                try {
                    if (document.body && document.body.contains(link)) {
                        document.body.removeChild(link);
                    }
                    window.URL.revokeObjectURL(url);
                } catch (cleanupError) {
                    console.warn("清理下载资源时出错:", cleanupError);
                }
            }, 200);

            return {
                success: true,
                message: "下载成功",
            };
        } catch (domError) {
            console.error("DOM操作失败:", domError);
            // 如果DOM操作失败，尝试直接设置location.href
            window.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);

            return {
                success: true,
                message: "下载已启动",
            };
        }
    } catch (error) {
        console.error("下载ZIP文件失败:", error);

        let errorMessage = "下载ZIP文件失败";
        if (error.response?.status === 404) {
            errorMessage = "ZIP文件不存在或已过期";
        } else if (error.response?.status === 403) {
            errorMessage = "没有权限下载该文件";
        } else if (error.message) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

/**
 * 支持进度显示和重试的ZIP文件下载方法
 * @param {number} pluginId - 插件ID
 * @param {string} zipFilename - ZIP文件名
 * @param {Function} onProgress - 进度回调函数
 * @param {number} retryCount - 重试次数
 */
export const downloadZipWithProgress = async (
    pluginId,
    zipFilename,
    onProgress = null,
    retryCount = 3
) => {
    let lastError;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            console.log(
                `开始下载尝试 ${attempt}/${retryCount}: ${zipFilename}`
            );

            const response = await downloadRequest.get(
                `/file/download-zip/${pluginId}/${zipFilename}`,
                {
                    responseType: "blob",
                    onDownloadProgress: (progressEvent) => {
                        if (onProgress && progressEvent.total) {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            onProgress({
                                loaded: progressEvent.loaded,
                                total: progressEvent.total,
                                progress: progress,
                                attempt: attempt,
                                maxAttempts: retryCount,
                            });
                        }
                    },
                    timeout: 300000, // 5分钟
                }
            );

            // 检查响应数据
            if (!response.data || response.data.size === 0) {
                throw new Error("下载的文件为空或无效");
            }

            console.log(
                `尝试 ${attempt} 下载成功，文件大小:`,
                response.data.size,
                "bytes"
            );

            let blob = response.data;
            if (!blob.type || blob.type === "application/octet-stream") {
                blob = new Blob([blob], { type: "application/zip" });
            }

            // 使用createObjectURL + 隐藏链接下载
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = zipFilename;
            link.style.display = "none";

            // 安全地添加到DOM并触发点击
            try {
                document.body.appendChild(link);
                link.click();

                // 延迟清理，避免DOM操作冲突
                setTimeout(() => {
                    try {
                        if (document.body && document.body.contains(link)) {
                            document.body.removeChild(link);
                        }
                        window.URL.revokeObjectURL(url);
                    } catch (cleanupError) {
                        console.warn("清理下载资源时出错:", cleanupError);
                    }
                }, 200);

                return {
                    success: true,
                    message: `下载成功 (尝试 ${attempt}/${retryCount})`,
                };
            } catch (domError) {
                console.error("DOM操作失败:", domError);
                // 如果DOM操作失败，尝试直接设置location.href
                window.location.href = url;
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);

                return {
                    success: true,
                    message: `下载已启动 (尝试 ${attempt}/${retryCount})`,
                };
            }
        } catch (error) {
            lastError = error;
            console.error(`下载尝试 ${attempt} 失败:`, error);

            // 如果不是最后一次尝试，等待一段时间后重试
            if (attempt < retryCount) {
                const waitTime = attempt * 2000; // 递增等待时间：2秒、4秒、6秒...
                console.log(
                    `等待 ${waitTime}ms 后进行第 ${attempt + 1} 次尝试...`
                );
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }
    }

    // 所有尝试都失败了
    console.error(`所有 ${retryCount} 次下载尝试都失败了:`, lastError);

    let errorMessage = "下载失败";
    if (
        lastError?.code === "ECONNABORTED" ||
        lastError?.message?.includes("timeout")
    ) {
        errorMessage = `下载超时 (已尝试 ${retryCount} 次)，文件较大请稍后重试`;
    } else if (lastError?.response?.status === 404) {
        errorMessage = "ZIP文件不存在或已过期";
    } else if (lastError?.response?.status === 403) {
        errorMessage = "没有权限下载该文件";
    } else if (lastError?.response?.status >= 500) {
        errorMessage = "服务器错误，请稍后重试";
    } else if (lastError?.message?.includes("Network Error")) {
        errorMessage = "网络连接失败，请检查网络连接";
    } else if (lastError?.message) {
        errorMessage = `${lastError.message} (已尝试 ${retryCount} 次)`;
    }

    return {
        success: false,
        message: errorMessage,
    };
};

/**
 * 简化的ZIP文件下载方法 - 使用原有的短超时时间
 */
export const downloadZipSimple = async (pluginId, zipFilename) => {
    return await downloadZip(pluginId, zipFilename);
};

/**
 * 通过新窗口下载ZIP文件 - 使用原有的短超时时间
 */
export const downloadZipInNewWindow = async (pluginId, zipFilename) => {
    return await downloadZip(pluginId, zipFilename);
};

/**
 * 下载单个文件
 * @param {number} pluginId - 插件ID
 * @param {number} recordId - 记录ID
 * @returns {Promise<Object>} 下载操作结果
 */
export const downloadSingleFile = async (pluginId, recordId) => {
    try {
        console.log(
            `开始下载单个文件: pluginId=${pluginId}, recordId=${recordId}`
        );

        const response = await downloadRequest.get(
            `/download-file/${pluginId}/${recordId}`,
            {
                responseType: "blob",
                timeout: 300000, // 5分钟超时
            }
        );

        // 检查响应数据
        if (!response.data || response.data.size === 0) {
            throw new Error("下载的文件为空或无效");
        }

        console.log("单个文件下载成功，文件大小:", response.data.size, "bytes");

        // 从响应头获取文件名
        let filename = "download";
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
            const matches = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (matches && matches[1]) {
                filename = matches[1].replace(/['"]/g, "");
            }
        }

        // 创建 blob 对象
        const blob = new Blob([response.data]);

        // 使用createObjectURL + 隐藏链接下载
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";

        // 安全地添加到DOM并触发点击
        try {
            document.body.appendChild(link);
            link.click();

            // 延迟清理，避免DOM操作冲突
            setTimeout(() => {
                try {
                    if (document.body && document.body.contains(link)) {
                        document.body.removeChild(link);
                    }
                    window.URL.revokeObjectURL(url);
                } catch (cleanupError) {
                    console.warn("清理下载资源时出错:", cleanupError);
                }
            }, 200);

            return {
                success: true,
                message: "文件下载成功",
            };
        } catch (domError) {
            console.error("DOM操作失败:", domError);
            // 如果DOM操作失败，尝试直接设置location.href
            window.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);

            return {
                success: true,
                message: "文件下载已启动",
            };
        }
    } catch (error) {
        console.error("下载单个文件失败:", error);

        let errorMessage = "下载文件失败";
        if (
            error?.code === "ECONNABORTED" ||
            error?.message?.includes("timeout")
        ) {
            errorMessage = "下载超时，文件较大请稍后重试";
        } else if (error?.response?.status === 404) {
            errorMessage = "文件不存在或已被删除";
        } else if (error?.response?.status === 403) {
            errorMessage = "没有权限下载该文件";
        } else if (error?.response?.status >= 500) {
            errorMessage = "服务器错误，请稍后重试";
        } else if (error?.message?.includes("Network Error")) {
            errorMessage = "网络连接失败，请检查网络连接";
        } else if (error?.message) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};
