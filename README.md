# 企业设备管理系统前端（Web）

本项目为企业设备管理系统的前端管理端，基于 Ant Design Pro（@umijs/max）构建，提供设备台账、运行监控、维护计划与维护记录、故障维修工单、统计报表与系统管理等功能页面。

## 技术栈

- React 19 + TypeScript
- Ant Design 5 + @ant-design/pro-components
- @umijs/max（Ant Design Pro 工程体系）
- ECharts（可视化）
- 代码规范：Biome + TypeScript（`npm run lint`）

## 环境要求

- Node.js >= 20（与项目 `package.json` engines 保持一致）
- npm（或 pnpm/yarn，推荐 npm）

## 快速开始

### 1. 安装依赖

```bash
cd EnterpriseEquipmentManagementSystemFrontend
npm install
```

### 2. 启动后端（必须）

确保后端服务已启动在 `http://localhost:3001`（默认端口），并且数据库可用。

说明：当前版本前端侧边栏菜单由后端动态下发（`GET /api/menus/me`），因此必须确保后端与数据库可用。

### 3. 启动前端（开发）

推荐使用本项目的 dev 脚本（关闭 mock，启用 dev 环境）：

```bash
npm run start:dev
```

默认访问：`http://localhost:8000`

说明：开发环境通过代理将 `/api/*` 转发到后端（见 `config/proxy.ts`）。

### 4. 构建生产包

```bash
npm run build
```

产物输出到 `dist/`。

## 代理与联调

本地开发默认代理规则：

- `http://localhost:8000/api/**` → `http://localhost:3001/api/**`

代理配置位置：`config/proxy.ts`

如果后端端口不是 3001，请同步修改 `target`。

## 常用命令

```bash
# 代码检查（Biome + tsc）
npm run lint

# 仅 TypeScript 类型检查
npm run tsc

# 构建
npm run build
```

## 日期交互规范

前端与后端交互时，所有**业务日期字段**（如 `purchaseDate`、`lastMaintenance`、`applyDate` 等）统一以 **`YYYY-MM-DD`** 字符串格式提交与回显。

- **提交前**：表单中使用 Ant Design `DatePicker`，在 `onSubmit` 前通过 `dayjs.format('YYYY-MM-DD')` 将日期对象转换为纯日期字符串，避免 ISO 时间串带来的时区漂移。
- **回显时**：后端返回的日期字段已为 `YYYY-MM-DD` 格式；若需回显到 `DatePicker`，可通过 `dayjs(value)` 包裹（仅用于视图回显，提交时仍格式化为字符串）。
- 涉及文件示例：
  - `equipment/components/CreateForm.tsx`、`UpdateForm.tsx`
  - `maintenance/components/MaintenanceRecordForm.tsx`、`MaintenancePlanForm.tsx`
  - `repair/components/RepairRequestForm.tsx`
  - `monitoring/components/RunningDataForm.tsx`

## 目录结构

```
src/
├── app.tsx                    # 运行时配置（initialState、request 等）
├── requestErrorConfig.ts      # 统一错误处理
├── components/                # 公共组件
├── pages/                     # 页面
│   ├── equipment/             # 设备台账
│   ├── monitoring/            # 运行监控/运行数据
│   ├── maintenance/           # 维护计划/维护记录
│   ├── repair/                # 故障报修/工单
│   ├── analytics/             # 统计分析
│   └── system/                # 系统管理
└── services/                  # 接口请求封装
```

## 登录与账号

初始化数据库后（后端目录执行 `node sync-database.js`），可使用默认账号登录：

- admin / admin123

## 权限与菜单

- 动态菜单：登录后调用 `GET /api/menus/me` 获取“当前用户可见菜单树”，用于侧边栏渲染与页面访问拦截。
- 角色菜单授权：系统管理 → 角色管理中，可通过“菜单树”勾选权限，保存到后端 `Roles.permissions`（菜单 ID 列表）。
- 无权限访问：已登录但访问未授权路径会跳转到 `/403`。

## 日志管理

- 系统管理 → 日志管理为“日志查询”页面，数据来自后端 `GET /api/logs`（仅管理员可见）。
- 如需快速写入演示日志：后端目录执行 `node scripts/seed-operation-logs.js`。

## 常见问题

- 接口 404：确认后端已启动且代理生效；前端请求均以 `/api` 开头。
- 接口 401/403：确认已登录且 token 有效；可尝试退出重新登录。
- 代理不生效：确认使用 `npm run start:dev` 启动，并检查 `config/proxy.ts` 的 `target`。
