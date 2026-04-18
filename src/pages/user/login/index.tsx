import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { login } from '@/services/auth/api';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    bg: {
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #001529 100%)',
      zIndex: 0,
    },
    container: {
      display: 'flex',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    leftPanel: {
      flex: '1 1 55%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      zIndex: 1,
    },
    rightPanel: {
      flex: '1 1 45%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 48px',
      zIndex: 1,
      overflow: 'hidden',
    },
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-20px)' },
    },
    '@keyframes floatSlow': {
      '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
      '50%': { transform: 'translateY(-10px) rotate(5deg)' },
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
      '50%': { opacity: 0.6, transform: 'scale(1.2)' },
    },
    circle1: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      top: '10%',
      left: '10%',
      animation: 'float 6s ease-in-out infinite',
      zIndex: 0,
    },
    circle2: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
      top: '20%',
      right: '15%',
      animation: 'floatSlow 8s ease-in-out infinite',
      zIndex: 0,
    },
    circle3: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      bottom: '10%',
      left: '15%',
      animation: 'float 10s ease-in-out infinite',
      zIndex: 0,
    },
    circle4: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      bottom: '25%',
      right: '10%',
      animation: 'pulse 4s ease-in-out infinite',
      zIndex: 0,
    },
    line1: {
      position: 'absolute',
      width: 300,
      height: 2,
      background:
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      top: '35%',
      left: '5%',
      animation: 'floatSlow 12s ease-in-out infinite',
      zIndex: 0,
    },
    line2: {
      position: 'absolute',
      width: 200,
      height: 2,
      background:
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      bottom: '35%',
      right: '8%',
      animation: 'float 9s ease-in-out infinite',
      zIndex: 0,
    },
    brandContent: {
      zIndex: 2,
      textAlign: 'center',
      padding: '0 40px',
    },
    logoImg: {
      width: 120,
      height: 120,
      marginBottom: 24,
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
    },
    brandTitle: {
      fontSize: 36,
      fontWeight: 700,
      color: '#fff',
      marginBottom: 16,
      letterSpacing: 2,
      textShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    brandSubtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.75)',
      lineHeight: 1.6,
      maxWidth: 400,
      margin: '0 auto',
    },
    formCard: {
      width: '100%',
      maxWidth: 420,
      background: '#fff',
      borderRadius: 16,
      padding: '40px 32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      overflow: 'hidden',
    },
    formWrapper: {
      width: '100%',
      overflow: 'hidden',
    },
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    '@media (max-width: 768px)': {
      leftPanel: {
        display: 'none',
      },
      rightPanel: {
        flex: '1 1 100%',
      },
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
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
  const { styles } = useStyles();
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
    } catch (error) {
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

              <div style={{ marginBottom: 24 }}>
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a style={{ float: 'right' }}>忘记密码</a>
              </div>
            </LoginForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
