import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Tooltip, Typography } from 'antd';
import React from 'react';
import { getLogs, type OperationLog } from '@/services/log';

const LogManagement: React.FC = () => {
  const buildTargetText = (record: OperationLog) => {
    const target = record.entityName || record.entityType || '-';
    return `${target}`;
  };

  const buildDetailText = (record: OperationLog) => {
    const details =
      record.details === undefined || record.details === null
        ? ''
        : typeof record.details === 'string'
          ? record.details
          : JSON.stringify(record.details);
    const ip = record.ip ? `IP: ${record.ip}` : '';
    return [record.action, details, ip].filter(Boolean).join(' | ') || '-';
  };

  const columns: ProColumns<OperationLog>[] = [
    {
      title: '操作用户',
      dataIndex: 'name',
      width: 140,
      render: (_, record) => record.name || '-',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      search: false,
      width: 140,
    },
    {
      title: '操作对象',
      key: 'target',
      search: false,
      width: 320,
      render: (_, record) => buildTargetText(record),
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
      search: false,
    },
    {
      title: '操作详情',
      key: 'details',
      search: false,
      width: 520,
      render: (_, record) => {
        const detailText = buildDetailText(record);
        return (
          <Tooltip
            placement="topLeft"
            title={
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {detailText}
              </pre>
            }
          >
            <Typography.Text
              ellipsis
              style={{ maxWidth: 500, display: 'inline-block' }}
            >
              {detailText}
            </Typography.Text>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<OperationLog>
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await getLogs(params);
            return {
              data: res.data,
              success: res.success,
              total: res.total,
            };
          }}
          pagination={{ pageSize: 10 }}
          search={{ labelWidth: 'auto' }}
          options={false}
          scroll={{ x: 1200 }}
        />
      </Card>
    </PageContainer>
  );
};

export default LogManagement;
