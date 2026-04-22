import {
  BarChartOutlined,
  BuildOutlined,
  CalendarOutlined,
  CrownOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  HistoryOutlined,
  LockOutlined,
  PieChartOutlined,
  ProfileOutlined,
  SettingOutlined,
  SmileOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import type { ReactNode } from 'react';
import { AvatarDropdown, AvatarName, Footer } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/auth/api';
import { getMyMenus } from '@/services/menu';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';
import type { RequestConfig } from '@umijs/max';
import styles from './app.less';

const loginPath = '/user/login';

const ICON_MAP: Record<string, ReactNode> = {
  barChart: <BarChartOutlined />,
  pieChart: <PieChartOutlined />,
  tool: <ToolOutlined />,
  unorderedList: <UnorderedListOutlined />,
  dashboard: <DashboardOutlined />,
  build: <BuildOutlined />,
  calendar: <CalendarOutlined />,
  history: <HistoryOutlined />,
  warning: <WarningOutlined />,
  fileText: <FileTextOutlined />,
  setting: <SettingOutlined />,
  user: <UserOutlined />,
  team: <TeamOutlined />,
  lock: <LockOutlined />,
  profile: <ProfileOutlined />,
  database: <DatabaseOutlined />,
  crown: <CrownOutlined />,
  smile: <SmileOutlined />,
  tags: <TagsOutlined />,
};

const withIconLabel = (label: ReactNode, icon?: ReactNode) => {
  if (!icon) return label;
  return (
    <span>
      {icon}
      <span className={styles.iconLabel}>{label}</span>
    </span>
  );
};

const getIconNode = (icon: any) => {
  if (!icon) return undefined;
  if (typeof icon === 'string') return ICON_MAP[icon];
  return icon as ReactNode;
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  menuData?: any[];
  allowedPaths?: string[];
  menuIconMap?: Record<string, ReactNode>;
}> {
  const toMenuData = (menus: any[], level = 0): any[] =>
    (menus || [])
      .filter((m) => m && !m.hideInMenu)
      .map((m) => {
        const iconNode = getIconNode(m.icon);
        const breadcrumbName = m.name;
        return {
          name: level > 0 ? withIconLabel(m.name, iconNode) : m.name,
          breadcrumbName,
          path: m.path,
          icon: level > 0 ? undefined : iconNode,
          children: toMenuData(m.children || [], level + 1),
        };
      });

  const collectPaths = (menus: any[]): string[] => {
    const out: string[] = [];
    const walk = (nodes: any[]) => {
      (nodes || []).forEach((n) => {
        if (n?.path) out.push(n.path);
        if (Array.isArray(n?.children)) walk(n.children);
      });
    };
    walk(menus || []);
    return out;
  };

  const buildIconMap = (menus: any[]) => {
    const map: Record<string, ReactNode> = {};
    const walk = (nodes: any[]) => {
      (nodes || []).forEach((n) => {
        if (n?.path) {
          const iconNode = getIconNode(n?.icon);
          if (iconNode) map[String(n.path)] = iconNode;
        }
        if (Array.isArray(n?.children)) walk(n.children);
      });
    };
    walk(menus || []);
    return map;
  };

  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.user;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    let menuData: any[] | undefined;
    let allowedPaths: string[] | undefined;
    let menuIconMap: Record<string, ReactNode> | undefined;
    if (currentUser) {
      try {
        const menusRes = await getMyMenus();
        menuIconMap = buildIconMap(menusRes.menus || []);
        menuData = toMenuData(menusRes.menus || []);
        allowedPaths = collectPaths(menusRes.menus || []);
      } catch (_error) {
        menuData = [];
        allowedPaths = [];
        menuIconMap = {};
      }
    }
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
      menuData,
      allowedPaths,
      menuIconMap,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      if (
        initialState?.currentUser &&
        initialState?.allowedPaths &&
        location.pathname !== loginPath
      ) {
        const allow = new Set([
          ...initialState.allowedPaths,
          '/',
          '/403',
          '/404',
          '/user/login',
        ]);
        if (!allow.has(location.pathname)) {
          history.push('/403');
        }
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    logo: '/logo.svg',
    breadcrumbRender: (routers) => routers,
    itemRender: (route: any, _params: any, routes: any[]) => {
      const isLast = routes.indexOf(route) === routes.length - 1;
      const label = route?.breadcrumbName ?? route?.name ?? '';
      const iconNode =
        initialState?.menuIconMap?.[route?.path] || getIconNode(route?.icon);
      const node =
        typeof label === 'string' ? withIconLabel(label, iconNode) : label;
      if (isLast || !route?.path) return node;
      return <Link to={route.path}>{node}</Link>;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    menu: {
      request: async () => {
        return initialState?.menuData || [];
      },
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,
};
