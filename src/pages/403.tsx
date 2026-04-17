import { history } from '@umijs/max';
import { Button, Card, Result } from 'antd';
import React from 'react';

const ForbiddenPage: React.FC = () => (
  <Card variant="borderless">
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该页面。"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          返回首页
        </Button>
      }
    />
  </Card>
);

export default ForbiddenPage;
