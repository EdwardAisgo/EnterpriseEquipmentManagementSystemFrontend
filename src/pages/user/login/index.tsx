import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { login } from '@/services/auth/api';
import Settings from '../../../../config/defaultSettings';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      className={styles.alertMargin}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values, type });
      if (msg.token) {
        localStorage.setItem('token', msg.token);
        message.success('登录成功！');
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      setUserLoginState({
        status: 'error',
        type: 'account',
      });
    } catch (_error) {
      message.error('登录失败，请重试！');
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          登录页
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>

      {/* 整页统一背景 */}
      <div className={styles.bg}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
        <div className={styles.circle4} />
        <div className={styles.line1} />
        <div className={styles.line2} />
      </div>

      {/* 左侧品牌区 */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <img src="/logo.svg" alt="logo" className={styles.logoImg} />
          <div className={styles.brandTitle}>企业设备管理系统</div>
          <div className={styles.brandSubtitle}>
            最好用、最易用、最轻量化、最安全的企业级设备管理系统
            <br />
            让设备管理更简单，让生产运营更高效
          </div>
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formWrapper}>
            <LoginForm
              containerStyle={{ overflow: 'hidden', padding: 0 }}
              contentStyle={{ width: '100%', minWidth: 0, overflow: 'visible' }}
              title="欢迎登录"
              subTitle="请使用您的账户密码登录系统"
              initialValues={{ autoLogin: true }}
              onFinish={async (values) => {
                await handleSubmit(values as API.LoginParams);
              }}
            >
              <Tabs
                activeKey={type}
                onChange={setType}
                centered
                items={[{ key: 'account', label: '账户密码登录' }]}
              />

              {status === 'error' && loginType === 'account' && (
                <LoginMessage content="账户或密码错误(admin/admin123)" />
              )}

              {type === 'account' && (
                <>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder="请输入用户名"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                    }}
                    placeholder="请输入密码"
                    rules={[{ required: true, message: '请输入密码！' }]}
                  />
                </>
              )}

              <div className={styles.autoLoginRow}>
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a className={styles.forgotPassword}>忘记密码</a>
              </div>
            </LoginForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
