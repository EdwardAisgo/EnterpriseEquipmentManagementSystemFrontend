import {
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createBackup,
  deleteBackup,
  getBackups,
  restoreBackup,
} from '@/services/business';

const BackupManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await getBackups();
      setBackups(res.backups || []);
    } catch (_error) {
      message.error('获取备份列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleBackup = async () => {
    setLoading(true);
    try {
      await createBackup();
      message.success('数据备份成功');
      fetchBackups();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || '数据备份失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (fileName: string) => {
    Modal.confirm({
      title: '确认恢复',
      content: `恢复操作将覆盖当前所有数据，确定要恢复备份 ${fileName} 吗？`,
      onOk: async () => {
        setLoading(true);
        try {
          await restoreBackup(fileName);
          message.success('数据恢复成功');
          fetchBackups();
        } catch (error: any) {
          message.error(
            error?.data?.message || error?.message || '数据恢复失败',
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleDeleteBackup = async (fileName: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除备份文件 ${fileName} 吗？`,
      onOk: async () => {
        try {
          await deleteBackup(fileName);
          message.success('备份删除成功');
          fetchBackups();
        } catch (error: any) {
          message.error(
            error?.data?.message || error?.message || '备份删除失败',
          );
        }
      },
    });
  };

  const backupColumns: ProColumns<any>[] = [
    {
      title: '备份文件名',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: any, record: any) => {
        const value = record?.createdAt ?? record?.date;
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '-';
        return d.toLocaleString();
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<UploadOutlined />}
            onClick={() => handleRestore(record.fileName)}
          >
            恢复
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBackup(record.fileName)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={backupColumns}
        dataSource={backups}
        loading={loading}
        rowKey="fileName"
        search={false}
        toolBarRender={() => [
          <Button
            key="backup"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleBackup}
            loading={loading}
          >
            立即执行备份
          </Button>,
        ]}
        options={false}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default BackupManagement;
