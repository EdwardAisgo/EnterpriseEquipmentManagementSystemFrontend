# 企业设备管理系统前端

## 项目介绍

企业设备管理系统是一个基于 React + TypeScript + Ant Design 开发的现代化前端应用，用于管理企业设备的全生命周期，包括设备台账管理、运行监控、维护保养、故障维修、数据统计分析和系统管理等功能。

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **UI 组件库**: Ant Design 5
- **状态管理**: Umi.js + Model
- **数据可视化**: ECharts 5.4.3
- **构建工具**: Umi.js
- **代码规范**: ESLint + Prettier

## 功能模块

### 1. 设备台账管理模块
- 设备基本信息录入、查询、修改、删除
- 支持按设备名称、编号、状态等条件筛选
- 设备信息 Excel 报表导出
- 设备报废管理

### 2. 运行监控管理模块
- 设备日常运行数据记录（运行时长、产量、能耗等）
- 设备实时状态展示（正常运行、维护中、故障中等）
- 运行时长阈值提醒

### 3. 维护保养管理模块
- 设备维护计划制定
- 维护周期设置
- 维护提醒功能
- 维护记录管理

### 4. 故障维修管理模块
- 报修申请提交
- 工单分配
- 维修记录管理
- 工单状态跟踪

### 5. 数据统计分析模块
- 设备故障率统计
- 维护成本分析
- 维修费用统计
- 图表可视化展示（柱状图、饼图、折线图）

### 6. 系统管理模块
- 用户管理
- 角色管理
- 权限管理
- 日志管理
- 数据备份

## 环境准备

### 安装依赖

```bash
npm install
```

或

```bash
yarn
```

## 运行项目

### 开发环境

```bash
npm start
```

项目将在 http://localhost:8000 启动

### 构建生产环境

```bash
npm run build
```

构建产物将输出到 `dist` 目录

## 代码规范

### 检查代码风格

```bash
npm run lint
```

### 自动修复代码风格问题

```bash
npm run lint:fix
```

## 项目结构

```
src/
├── components/       # 公共组件
├── pages/            # 页面组件
│   ├── analytics/    # 数据统计分析
│   ├── equipment/    # 设备台账管理
│   ├── maintenance/  # 维护保养管理
│   ├── monitoring/   # 运行监控管理
│   ├── repair/       # 故障维修管理
│   └── system/       # 系统管理
├── models/           # 数据模型
├── services/         # API 服务
├── utils/            # 工具函数
└── app.tsx           # 应用入口
```

## 注意事项

1. 项目使用 ECharts 5.4.3 进行数据可视化，已替代原有的 Recharts
2. 开发环境需要 Node.js 16+ 版本
3. 生产环境部署前请确保配置正确的 API 地址

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License
# EnterpriseEquipmentManagementSystemFrontend
