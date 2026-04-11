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

如使用后端提供的演示数据脚本导入数据（后端目录执行 `node import-frontend-data.js`），可使用：

- admin / admin123
- user / user123

## 常见问题

- 接口 404：确认后端已启动且代理生效；前端请求均以 `/api` 开头。
- 接口 401/403：确认已登录且 token 有效；可尝试退出重新登录。
- 代理不生效：确认使用 `npm run start:dev` 启动，并检查 `config/proxy.ts` 的 `target`。
