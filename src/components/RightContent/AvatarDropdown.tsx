import {
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { message, Spin } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import ChangePasswordForm from '@/pages/system/components/ChangePasswordForm';
import { outLogin } from '@/services/auth/api';
import { changePassword } from '@/services/business';
import HeaderDropdown from '../HeaderDropdown';
import styles from './AvatarDropdown.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const searchParams = new URLSearchParams({
      redirect: pathname + search,
    });
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: searchParams.toString(),
      });
    }
  };
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut();
      return;
    }
    if (key === 'password') {
      setPasswordVisible(true);
      return;
    }
    history.push(`/account/${key}`);
  };

  const handleChangePassword = async (values: API.ChangePasswordParams) => {
    try {
      await changePassword(values);
      message.success('密码修改成功，请重新登录');
      setPasswordVisible(false);
      // 修改成功后强制退出登录
      setTimeout(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
      }, 1500);
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || '密码修改失败');
    }
  };

  const loading = (
    <span className={styles.action}>
      <Spin size="small" className={styles.spin} />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            key: 'password',
            icon: <LockOutlined />,
            label: '修改密码',
          },
          {
            type: 'divider' as const,
          },
        ]
      : [
          {
            key: 'password',
            icon: <LockOutlined />,
            label: '修改密码',
          },
          {
            type: 'divider' as const,
          },
        ]),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <ChangePasswordForm
        visible={passwordVisible}
        onCancel={() => setPasswordVisible(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
};
