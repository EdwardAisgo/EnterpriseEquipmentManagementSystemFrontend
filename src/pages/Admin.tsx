import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Admin.less';

const Admin: React.FC = () => {
  return (
    <PageContainer content="此页面仅管理员可见">
      <Card>
        <Alert
          message="更快速、更强大的重型组件已发布。"
          type="success"
          showIcon
          banner
          className={styles.alertBanner}
        />
        <Typography.Title level={2} className={styles.centerTitle}>
          <SmileTwoTone /> Ant Design Pro{' '}
          <HeartTwoTone twoToneColor="#eb2f96" /> You
        </Typography.Title>
      </Card>
      <p className={styles.centerText}>
        想添加更多页面？请参考{' '}
        <a
          href="https://pro.ant.design/docs/block-cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          使用区块
        </a>
        。
      </p>
    </PageContainer>
  );
};

export default Admin;
