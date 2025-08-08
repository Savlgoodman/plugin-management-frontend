/**
 * 字体管理工具
 */

// 主要字体配置
export const FONTS = {
    PRIMARY: "方正公文小标宋",
    PRIMARY_EN: "FZXiaoBiaoSong-B05",
    FALLBACK: [
        "Helvetica Neue",
        "Helvetica",
        "PingFang SC",
        "Hiragino Sans GB",
        "Microsoft YaHei",
        "微软雅黑",
        "Arial",
        "sans-serif",
    ],
};

// 生成完整的字体家族字符串
export const getFontFamily = () => {
    return `"${FONTS.PRIMARY}", "${FONTS.PRIMARY_EN}", ${FONTS.FALLBACK.map(
        (font) => `"${font}"`
    ).join(", ")}`;
};

// 检测字体是否可用
export const isFontAvailable = (fontName) => {
    // 创建一个临时的canvas来检测字体
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 使用默认字体渲染文本
    context.font = "12px monospace";
    const defaultWidth = context.measureText("测试文字").width;

    // 使用目标字体渲染文本
    context.font = `12px "${fontName}", monospace`;
    const testWidth = context.measureText("测试文字").width;

    // 如果宽度不同，说明字体可用
    return defaultWidth !== testWidth;
};

// 字体加载检测
export const checkFontLoad = () => {
    const isAvailable = isFontAvailable(FONTS.PRIMARY);

    if (isAvailable) {
        console.log(`✅ 字体 "${FONTS.PRIMARY}" 加载成功`);
        document.documentElement.style.setProperty("--font-status", "loaded");
    } else {
        console.warn(`⚠️ 字体 "${FONTS.PRIMARY}" 未找到，使用备用字体`);
        document.documentElement.style.setProperty("--font-status", "fallback");
    }

    return isAvailable;
};

// 动态应用字体
export const applyFont = (element = document.body) => {
    element.style.fontFamily = getFontFamily();
};

export default {
    FONTS,
    getFontFamily,
    isFontAvailable,
    checkFontLoad,
    applyFont,
};
