# 文档管理 API 文档

## 概述
本API文档描述了文档管理页面所需的所有接口。所有接口均采用RESTful设计风格，返回JSON格式数据。当前为虚拟数据实现，便于前端开发，后期可无缝切换到真实后端。

## 基础信息
- **协议**: HTTPS
- **数据格式**: JSON
- **状态码**:
  - `200`: 成功
  - `400`: 请求参数错误
  - `404`: 资源不存在
  - `500`: 服务器内部错误

## API 接口

### 1. 获取统计卡片数据
获取文档管理页面顶部的统计卡片数据。

- **URL**: `/api/documents/stats`
- **Method**: `GET`
- **请求参数**: 无
- **成功响应**:
```json
[
  {
    "title": "总文档数",
    "value": "1,296",
    "icon": "Document",
    "color": "#4285f4",
    "trend": "已分类管理",
    "subtitle": ""
  },
  {
    "title": "本周新增",
    "value": "48",
    "icon": "Plus",
    "color": "#34a853",
    "trend": "较上周增长15%",
    "subtitle": ""
  },
  {
    "title": "文档分类",
    "value": "16",
    "icon": "Grid",
    "color": "#ff9500",
    "trend": "16个插件分类",
    "subtitle": ""
  },
  {
    "title": "下载次数",
    "value": "3,842",
    "icon": "Download",
    "color": "#5856d6",
    "trend": "今日下载124次",
    "subtitle": ""
  }
]
```
- **响应字段说明**:
  - `title`: 卡片标题
  - `value`: 显示值
  - `icon`: 图标名称
  - `color`: 主题颜色
  - `trend`: 趋势描述
  - `subtitle`: 副标题

### 2. 获取文档分类数据
获取所有文档分类信息。

- **URL**: `/api/documents/categories`
- **Method**: `GET`
- **请求参数**: 无
- **成功响应**:
```json
[
  {
    "id": "news-crawler",
    "name": "新闻采集器",
    "plugin": "新闻采集器",
    "count": 428,
    "percentage": 85,
    "color": "#4285f4",
    "icon": "Reading"
  },
  {
    "id": "ecommerce-spider",
    "name": "电商数据爬虫",
    "plugin": "电商数据爬虫",
    "count": 312,
    "percentage": 62,
    "color": "#ea4335",
    "icon": "ShoppingBag"
  }
]
```
- **响应字段说明**:
  - `id`: 分类唯一标识
  - `name`: 分类名称
  - `plugin`: 插件名称
  - `count`: 文档数量
  - `percentage`: 完成百分比
  - `color`: 主题颜色
  - `icon`: 图标名称

### 3. 获取文档列表数据
获取文档列表数据，支持搜索、分类和日期范围筛选。

- **URL**: `/api/documents/list`
- **Method**: `GET`
- **请求参数**:
  - `searchText` (string, optional): 搜索文本
  - `category` (string, optional): 分类筛选
  - `startDate` (string, optional): 开始日期 (YYYY-MM-DD)
  - `endDate` (string, optional): 结束日期 (YYYY-MM-DD)
- **成功响应**:
```json
{
  "total": 1296,
  "data": [
    {
      "id": 1,
      "name": "央视新闻：2024年政府工作报告解读",
      "extension": ".html",
      "type": "html",
      "category": "新闻采集器",
      "documentDate": "2024-01-15",
      "collectDate": "2024-01-16",
      "size": 2048576,
      "downloadCount": 45
    }
  ]
}
```
- **响应字段说明**:
  - `total`: 总文档数量
  - `data`: 文档数据数组
    - `id`: 文档唯一标识
    - `name`: 文档名称
    - `extension`: 文件扩展名
    - `type`: 文档类型
    - `category`: 所属分类
    - `documentDate`: 文档日期
    - `collectDate`: 采集日期
    - `size`: 文件大小(字节)
    - `downloadCount`: 下载次数

### 4. 刷新文档列表
刷新文档列表缓存。

- **URL**: `/api/documents/refresh`
- **Method**: `POST`
- **请求参数**: 无
- **成功响应**: 200 OK

### 5. 批量下载文档
批量下载指定文档。

- **URL**: `/api/documents/batch-download`
- **Method**: `POST`
- **请求参数**:
  - `documentIds` (array): 文档ID数组
- **成功响应**: 200 OK

### 6. 删除文档
删除指定文档。

- **URL**: `/api/documents/{id}`
- **Method**: `DELETE`
- **路径参数**:
  - `id` (number): 文档ID
- **成功响应**: 200 OK
- **错误响应**: 404 文档不存在