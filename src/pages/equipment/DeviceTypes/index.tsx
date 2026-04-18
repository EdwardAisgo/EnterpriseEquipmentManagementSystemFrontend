import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createDeviceType,
  deleteDeviceType,
  getDeviceTypes,
  updateDeviceType,
} from '@/services/equipment';
import DeviceTypeForm from './components/DeviceTypeForm';

type DeviceTypeItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

const DeviceTypeManagement: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentType, setCurrentType] = useState<DeviceTypeItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeItem[]>([]);

  const fetchDeviceTypes = async () => {
    setLoading(true);
    try {
      const res = await getDeviceTypes();
      setDeviceTypes(res.deviceTypes || []);
    } catch (error) {
      message.error('获取设备类型列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (currentType) {
        await updateDeviceType(currentType.id, values);
        message.success('更新设备类型成功');
      } else {
        await createDeviceType(values);
        message.success('新增设备类型成功');
      }
      setVisible(false);
      fetchDeviceTypes();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const columns: ProColumns<DeviceTypeItem>[] = [
    {
      title: '类型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentType(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确定要删除该设备类型吗？',
                onOk: async () => {
                  try {
                    await deleteDeviceType(record.id);
                    message.success('删除成功');
                    fetchDeviceTypes();
                  } catch (error: any) {
                    message.error(error.message || '删除失败');
                  }
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<DeviceTypeItem>
        columns={columns}
        dataSource={deviceTypes}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentType(null);
              setVisible(true);
            }}
          >
            新增设备类型
          </Button>,
        ]}
        onSubmit={(params) => fetchDeviceTypes()}
        onReset={() => fetchDeviceTypes()}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <DeviceTypeForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleSubmit}
        deviceType={currentType}
      />
    </PageContainer>
  );
};

export default DeviceTypeManagement;
