# 插件管理 API 接口文档

## 📖 概述

本文档详细描述了 Easy Spider 插件管理系统的 REST API 接口。这些接口用于插件的导入、查询、管理和状态控制。

### 基础信息

-   **基础 URL**: `/api`
-   **认证方式**: JWT Bearer Token
-   **内容类型**: `application/json`
-   **字符编码**: UTF-8

### 认证说明

所有 API 接口都需要在请求头中包含有效的 JWT token：

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🔌 API 接口详情

### 1. 导入插件文件

通过上传 JSON 文件的方式导入插件配置。

#### 请求信息

-   **接口路径**: `POST /api/plugin/import`
-   **请求方式**: POST
-   **内容类型**: `multipart/form-data`

#### 请求参数

| 参数名 | 类型 | 是否必填 | 描述                    |
| ------ | ---- | -------- | ----------------------- |
| file   | File | 是       | JSON 格式的插件配置文件 |

#### 文件格式要求

上传的 JSON 文件必须包含以下必要字段：

```json
{
    "name": "插件名称",
    "url": "插件URL地址",
    "saveName": "保存名称",
    "description": "插件描述（可选）"
    // ... 其他插件配置数据
}
```

#### 请求示例

```bash
curl -X POST \
  'http://localhost:8000/api/plugin/import' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@plugin_config.json'
```

#### 返回结果

**成功响应 (200)**:

```json
{
    "code": 200,
    "message": "插件 'Example Plugin' 导入成功",
    "data": {
        "plugin_id": 1,
        "file_path": "execute/tasks/1.json"
    }
}
```

**失败响应 (400)**:

```json
{
    "code": 400,
    "message": "文件格式错误，请上传JSON文件",
    "data": null
}
```

**失败响应 (400) - 缺少字段**:

```json
{
    "code": 400,
    "message": "缺少必要字段: name, url",
    "data": null
}
```

**服务器错误 (500)**:

```json
{
    "code": 500,
    "message": "导入插件时发生错误: 数据库连接失败",
    "data": null
}
```

---

### 2. 通过 JSON 数据导入插件

直接通过 JSON 数据导入插件配置，适用于程序化调用。

#### 请求信息

-   **接口路径**: `POST /api/plugin/import-json`
-   **请求方式**: POST
-   **内容类型**: `application/json`

#### 请求参数

请求体为 JSON 格式，包含以下字段：

| 字段名      | 类型   | 是否必填 | 最大长度 | 描述          |
| ----------- | ------ | -------- | -------- | ------------- |
| name        | string | 是       | 255      | 插件名称      |
| url         | string | 是       | 512      | 插件 URL 地址 |
| saveName    | string | 是       | 255      | 保存名称      |
| description | string | 否       | -        | 插件描述      |

#### 请求示例

```bash
curl -X POST \
  'http://localhost:8000/api/plugin/import-json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "示例插件",
    "url": "https://example.com/plugin",
    "saveName": "example_plugin",
    "description": "这是一个示例插件配置"
  }'
```

#### 返回结果

**成功响应 (200)**:

```json
{
    "code": 200,
    "message": "插件 '示例插件' 导入成功",
    "data": {
        "plugin_id": 2,
        "file_path": "execute/tasks/2.json"
    }
}
```

**失败响应格式同上一接口**

---

### 3. 获取插件列表

获取系统中所有插件的列表信息。

#### 请求信息

-   **接口路径**: `GET /api/plugin/list`
-   **请求方式**: GET
-   **内容类型**: `application/json`

#### 请求参数

无需请求参数

#### 请求示例

```bash
curl -X GET \
  'http://localhost:8000/api/plugin/list' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### 返回结果

**成功响应 (200)**:

```json
{
    "code": 200,
    "message": "获取插件列表成功",
    "data": [
        {
            "id": 1,
            "name": "示例插件1",
            "url": "https://example.com/plugin1",
            "saveName": "example_plugin_1",
            "update_time": "2025-01-26T10:30:00.000000+00:00",
            "is_activate": true
        },
        {
            "id": 2,
            "name": "示例插件2",
            "url": "https://example.com/plugin2",
            "saveName": "example_plugin_2",
            "update_time": "2025-01-26T11:15:00.000000+00:00",
            "is_activate": false
        }
    ]
}
```

**服务器错误 (500)**:

```json
{
    "code": 500,
    "message": "获取插件列表失败: 数据库查询错误",
    "data": null
}
```

#### 返回字段说明

| 字段名      | 类型    | 描述                      |
| ----------- | ------- | ------------------------- |
| id          | integer | 插件 ID                   |
| name        | string  | 插件名称                  |
| url         | string  | 插件 URL 地址             |
| saveName    | string  | 保存名称                  |
| update_time | string  | 更新时间（ISO 8601 格式） |
| is_activate | boolean | 是否启用插件              |

---

### 4. 根据 ID 获取插件信息

根据插件 ID 获取特定插件的详细信息。

#### 请求信息

-   **接口路径**: `GET /api/plugin/{plugin_id}`
-   **请求方式**: GET
-   **内容类型**: `application/json`

#### 路径参数

| 参数名    | 类型    | 是否必填 | 描述                |
| --------- | ------- | -------- | ------------------- |
| plugin_id | integer | 是       | 插件 ID，必须大于 0 |

#### 请求示例

```bash
curl -X GET \
  'http://localhost:8000/api/plugin/1' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### 返回结果

**成功响应 (200)**:

```json
{
    "code": 200,
    "message": "获取插件信息成功",
    "data": {
        "id": 1,
        "name": "示例插件",
        "url": "https://example.com/plugin",
        "saveName": "example_plugin",
        "update_time": "2025-01-26T10:30:00.000000+00:00",
        "is_activate": true
    }
}
```

**插件不存在 (404)**:

```json
{
    "code": 404,
    "message": "插件不存在",
    "data": null
}
```

**服务器错误 (500)**:

```json
{
    "code": 500,
    "message": "获取插件信息失败: 数据库连接超时",
    "data": null
}
```

---

### 5. 更新插件启用状态

启用或禁用指定的插件。

#### 请求信息

-   **接口路径**: `PUT /api/plugin/{plugin_id}/status`
-   **请求方式**: PUT
-   **内容类型**: `application/json`

#### 路径参数

| 参数名    | 类型    | 是否必填 | 描述                |
| --------- | ------- | -------- | ------------------- |
| plugin_id | integer | 是       | 插件 ID，必须大于 0 |

#### 查询参数

| 参数名      | 类型    | 是否必填 | 描述                                  |
| ----------- | ------- | -------- | ------------------------------------- |
| is_activate | boolean | 是       | 是否启用插件（true=启用，false=禁用） |

#### 请求示例

**启用插件**:

```bash
curl -X PUT \
  'http://localhost:8000/api/plugin/1/status?is_activate=true' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**禁用插件**:

```bash
curl -X PUT \
  'http://localhost:8000/api/plugin/1/status?is_activate=false' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### 返回结果

**启用成功 (200)**:

```json
{
    "code": 200,
    "message": "插件启用成功",
    "data": null
}
```

**禁用成功 (200)**:

```json
{
    "code": 200,
    "message": "插件禁用成功",
    "data": null
}
```

**插件不存在 (404)**:

```json
{
    "code": 404,
    "message": "插件不存在或更新失败",
    "data": null
}
```

**服务器错误 (500)**:

```json
{
    "code": 500,
    "message": "更新插件状态失败: 数据库写入错误",
    "data": null
}
```

---

## 🔧 业务流程说明

### 插件导入流程

1. **获取插件配置**: 准备包含`name`、`url`、`saveName`等必要字段的 JSON 配置
2. **调用导入接口**: 使用`/plugin/import`或`/plugin/import-json`接口
3. **系统处理**:
    - 获取数据库中最后一个插件 ID
    - 为新插件分配 ID（最后 ID + 1）
    - 将插件信息保存到数据库
    - 更新配置文件中的 ID 字段
    - 将配置保存为`{id}.json`格式到`execute/tasks/`目录
4. **返回结果**: 包含新插件 ID 和文件保存路径

### 文件存储结构

导入的插件文件按以下规则存储：

```
execute/
└── tasks/
    ├── 1.json    # 插件ID为1的配置文件
    ├── 2.json    # 插件ID为2的配置文件
    └── ...
```

---

## 📋 错误码说明

| 错误码 | 描述           | 常见原因                                 |
| ------ | -------------- | ---------------------------------------- |
| 200    | 操作成功       | -                                        |
| 400    | 请求参数错误   | 缺少必要字段、文件格式错误、参数类型错误 |
| 401    | 未授权         | JWT token 无效或过期                     |
| 404    | 资源不存在     | 指定的插件 ID 不存在                     |
| 500    | 服务器内部错误 | 数据库连接失败、文件系统错误等           |

---

## 🧪 测试示例

### 使用 Postman 测试

1. **设置全局变量**:

    - `base_url`: `http://localhost:8000/api`
    - `auth_token`: 您的 JWT token

2. **导入插件测试**:

    ```
    POST {{base_url}}/plugin/import-json
    Headers:
      Authorization: Bearer {{auth_token}}
      Content-Type: application/json
    Body:
    {
      "name": "测试插件",
      "url": "https://test.com/plugin",
      "saveName": "test_plugin"
    }
    ```

3. **查看插件列表**:
    ```
    GET {{base_url}}/plugin/list
    Headers:
      Authorization: Bearer {{auth_token}}
    ```

### 使用 Python 请求示例

```python
import requests
import json

# 配置
BASE_URL = "http://localhost:8000/api"
TOKEN = "your-jwt-token-here"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# 导入插件
plugin_data = {
    "name": "Python测试插件",
    "url": "https://example.com/python-plugin",
    "saveName": "python_test_plugin"
}

response = requests.post(
    f"{BASE_URL}/plugin/import-json",
    headers=HEADERS,
    json=plugin_data
)

print(f"导入结果: {response.json()}")

# 获取插件列表
response = requests.get(f"{BASE_URL}/plugin/list", headers=HEADERS)
print(f"插件列表: {response.json()}")
```

---

## 📝 注意事项

1. **认证要求**: 所有接口都需要有效的 JWT token
2. **文件格式**: 上传的插件文件必须是有效的 JSON 格式
3. **字段验证**: `name`、`url`、`saveName`为必填字段
4. **ID 分配**: 插件 ID 自动递增，不可手动指定
5. **文件存储**: 插件配置文件存储在`execute/tasks/`目录下
6. **状态管理**: 新导入的插件默认为启用状态（`is_activate=true`）
7. **并发安全**: 系统支持并发操作，ID 分配线程安全

---

## 📞 技术支持

如有问题请联系：

-   邮箱: support@easyspider.com
-   文档更新时间: 2025-01-26
