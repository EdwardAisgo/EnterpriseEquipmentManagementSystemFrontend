import { Button, Card, Input, Select, message, Space, Modal } from 'antd';
import { PlusOutlined, ExportOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ScrapForm from './components/ScrapForm';
import { getDevices, createDevice, updateDevice, deleteDevice, scrapDevice } from '@/services/equipment';

const { Search } = Input;
const { Option } = Select;

type EquipmentItem = {
  id: string;
  deviceCode: string;
  name: string;
  type: string;
  model: string;
  purchaseDate: string;
  purchasePrice: number;
  location: string;
  status: 'normal' | 'maintenance' | 'fault' | 'scrapped';
  scrapDate?: string;
  scrapReason?: string;
  createdAt: string;
  updatedAt: string;
};

const EquipmentManagement: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [scrapVisible, setScrapVisible] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentItem | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);

  const fetchEquipmentList = async () => {
    setLoading(true);
    try {
      const res = await getDevices();
      if (res.devices) {
        setEquipmentList(res.devices);
      }
    } catch (error) {
      message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await createDevice(values);
      message.success('添加成功');
      setVisible(false);
      fetchEquipmentList();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentEquipment) return;
    try {
      await updateDevice(currentEquipment.id, values);
      message.success('更新成功');
      setUpdateVisible(false);
      fetchEquipmentList();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleScrap = async (values: any) => {
    if (!currentEquipment) return;
    try {
      await scrapDevice(currentEquipment.id, values.scrapReason);
      message.success('报废处理成功');
      setScrapVisible(false);
      fetchEquipmentList();
    } catch (error) {
      message.error('报废处理失败');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除该设备吗？',
      onOk: async () => {
        try {
          await deleteDevice(id);
          message.success('删除成功');
          fetchEquipmentList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ProColumns<EquipmentItem>[] = [
    {
      title: '设备编号',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '采购时间',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: '采购价格',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      valueType: 'money',
    },
    {
      title: '存放位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        normal: { text: '正常运行', status: 'Success' },
        maintenance: { text: '维护中', status: 'Processing' },
        fault: { text: '故障中', status: 'Error' },
        scrapped: { text: '已报废', status: 'Default' },
      },
    },
    {
      title: '报废时间',
      dataIndex: 'scrapDate',
      key: 'scrapDate',
    },
    {
      title: '报废原因',
      dataIndex: 'scrapReason',
      key: 'scrapReason',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentEquipment(record);
              setUpdateVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
          {record.status !== 'scrapped' && (
            <Button
              type="link"
              danger
              onClick={() => {
                setCurrentEquipment(record);
                setScrapVisible(true);
              }}
            >
              报废
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search placeholder="搜索设备名称/编号" style={{ width: 300 }} />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">所有状态</Option>
            <Option value="normal">正常</Option>
            <Option value="maintenance">维护中</Option>
            <Option value="fault">故障</Option>
            <Option value="scrapped">已报废</Option>
          </Select>
        </Space>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            添加设备
          </Button>
          <Button icon={<ExportOutlined />}>导出数据</Button>
        </Space>
      </div>

      <ProTable<EquipmentItem>
        columns={columns}
        dataSource={equipmentList}
        loading={loading}
        rowKey="id"
        search={false}
        options={false}
        pagination={{
          pageSize: 10,
        }}
      />

      <CreateForm visible={visible} onCancel={() => setVisible(false)} onSubmit={handleAdd} />

      {currentEquipment && (
        <UpdateForm
          visible={updateVisible}
          onCancel={() => setUpdateVisible(false)}
          onSubmit={handleUpdate}
          values={currentEquipment}
        />
      )}

      {currentEquipment && (
        <ScrapForm
          visible={scrapVisible}
          onCancel={() => setScrapVisible(false)}
          onSubmit={handleScrap}
          values={currentEquipment}
        />
      )}
    </Card>
  );
};

export default EquipmentManagement;