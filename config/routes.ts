/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/analytics',
    name: '数据统计',
    icon: 'barChart',
    routes: [
      {
        path: '/analytics',
        redirect: '/analytics/overview',
        hideInMenu: true,
      },
      {
        path: '/analytics/overview',
        name: '统计概览',
        icon: 'pieChart',
        component: './analytics/Overview',
      },
    ],
  },
  {
    path: '/equipment',
    name: '设备台账',
    icon: 'tool',
    routes: [
      {
        path: '/equipment',
        redirect: '/equipment/list',
        hideInMenu: true,
      },
      {
        path: '/equipment/list',
        name: '设备列表',
        icon: 'unorderedList',
        component: './equipment/List',
      },
      {
        path: '/equipment/device-types',
        name: '设备类型',
        icon: 'tags',
        component: './equipment/DeviceTypes',
      },
    ],
  },
  {
    path: '/monitoring',
    name: '运行监控',
    icon: 'dashboard',
    component: './monitoring',
  },
  {
    path: '/maintenance',
    name: '维护保养',
    icon: 'build',
    routes: [
      {
        path: '/maintenance',
        redirect: '/maintenance/plans',
        hideInMenu: true,
      },
      {
        path: '/maintenance/plans',
        name: '维护计划',
        icon: 'calendar',
        component: './maintenance/Plans',
      },
      {
        path: '/maintenance/records',
        name: '保养记录',
        icon: 'history',
        component: './maintenance/Records',
      },
    ],
  },
  {
    path: '/repair',
    name: '故障维修',
    icon: 'warning',
    routes: [
      {
        path: '/repair',
        redirect: '/repair/orders',
        hideInMenu: true,
      },
      {
        path: '/repair/orders',
        name: '维修工单',
        icon: 'fileText',
        component: './repair/Orders',
      },
    ],
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    routes: [
      {
        path: '/system',
        redirect: '/system/users',
        hideInMenu: true,
      },
      {
        path: '/system/users',
        name: '用户管理',
        icon: 'user',
        component: './system/Users',
      },
      {
        path: '/system/departments',
        name: '部门管理',
        icon: 'team',
        component: './system/Departments',
      },
      {
        path: '/system/roles',
        name: '角色管理',
        icon: 'lock',
        component: './system/Roles',
      },
      {
        path: '/system/logs',
        name: '日志管理',
        icon: 'profile',
        component: './system/logs',
      },
      {
        path: '/system/backup',
        name: '数据备份',
        icon: 'database',
        component: './system/Backup',
      },
    ],
  },
  {
    path: '/',
    redirect: '/analytics',
  },
  {
    path: '/403',
    layout: false,
    component: './403',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
