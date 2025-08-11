# 系统设置 API 文档

## 概述
本API文档描述了系统设置页面所需的所有API接口。所有接口均采用RESTful设计风格，返回标准的JSON响应格式。

## 响应格式
所有API接口返回统一的响应格式：
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

## 接口列表

### 1. 获取系统信息
- **URL**: `/api/settings/system-info`
- **Method**: `GET`
- **Description**: 获取系统状态信息，包括服务器状态、数据库连接状态、存储空间等
- **Parameters**: 无
- **Response**:
```json
{
  "success": true,
  "data": {
    "serverStatus": "running",
    "lastUpdateTime": "2024-01-15 14:30:25",
    "dbStatus": "connected",
    "usedStorage": "45.2 GB",
    "totalStorage": "100 GB",
    "storageUsage": 45.2
  }
}
```

### 2. 获取基本设置
- **URL**: `/api/settings/basic`
- **Method**: `GET`
- **Description**: 获取系统的基本设置信息
- **Parameters**: 无
- **Response**:
```json
{
  "success": true,
  "data": {
    "systemName": "数据采集管理系统",
    "systemDesc": "用于管理和监控数据采集任务的综合平台",
    "version": "v2.3.1",
    "timezone": "Asia/Shanghai",
    "username": "admin",
    "name": "管理员"
  }
}
```

### 3. 获取系统日志
- **URL**: `/api/settings/logs`
- **Method**: `GET`
- **Description**: 获取系统日志列表，支持搜索和筛选
- **Query Parameters**:
  - `searchText` (string, optional): 关键词搜索
  - `logType` (string, optional): 日志类型筛选 (info, warning, error, debug)
  - `startDate` (string, optional): 开始时间 (YYYY-MM-DD HH:mm)
  - `endDate` (string, optional): 结束时间 (YYYY-MM-DD HH:mm)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "timestamp": "2024-01-15 14:30:25",
      "type": "info",
      "source": "系统核心",
      "message": "系统启动成功，服务正常运行中"
    },
    {
      "id": 2,
      "timestamp": "2024-01-15 14:28:12",
      "type": "warning",
      "source": "数据库连接池",
      "message": "数据库连接数达到80%阈值，建议优化查询性能"
    }
  ]
}
```

### 4. 保存系统设置
- **URL**: `/api/settings/system`
- **Method**: `POST`
- **Description**: 保存系统设置
- **Request Body**:
```json
{
  "systemName": "数据采集管理系统",
  "systemDesc": "用于管理和监控数据采集任务的综合平台",
  "timezone": "Asia/Shanghai"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "系统设置保存成功"
}
```

### 5. 保存用户设置
- **URL**: `/api/settings/user`
- **Method**: `POST`
- **Description**: 保存用户设置，包括个人信息和密码修改
- **Request Body**:
```json
{
  "name": "管理员",
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "用户设置保存成功，请重新登录"
}