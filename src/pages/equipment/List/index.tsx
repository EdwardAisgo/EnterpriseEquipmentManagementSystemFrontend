import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Card, Input, Modal, message, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createDevice,
  deleteDevice,
  getDevices,
  scrapDevice,
  updateDevice,
} from '@/services/equipment';
import CreateForm from '../components/CreateForm';
import ScrapForm from '../components/ScrapForm';
import UpdateForm from '../components/UpdateForm';
import styles from './index.less';

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

const EquipmentList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [scrapVisible, setScrapVisible] = useState(false);
  const [currentEquipment, setCurrentEquipment] =
    useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const fetchEquipmentList = async (
    params: { search?: string; status?: string } = {},
  ) => {
    setLoading(true);
    try {
      const res = await getDevices(params);
      if (res.devices) {
        setEquipmentList(res.devices);
      }
    } catch (_error) {
      message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  const handleSearch = (value: string) => {
    fetchEquipmentList({ search: value, status });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    fetchEquipmentList({ search, status: value });
  };

  const handleAdd = async (values: any) => {
    try {
      await createDevice({
        ...values,
        purchasePrice: values.purchasePrice
          ? values.purchasePrice * 10000
          : undefined,
      });
      message.success('添加成功');
      setVisible(false);
      fetchEquipmentList();
    } catch (error) {
      const err: any = error;
      const backendMessage =
        err?.data?.message || err?.response?.data?.message || err?.message;
      message.error(backendMessage || '添加失败');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentEquipment) return;
    try {
      await updateDevice(currentEquipment.id, {
        ...values,
        purchasePrice: values.purchasePrice
          ? values.purchasePrice * 10000
          : undefined,
      });
      message.success('更新成功');
      setUpdateVisible(false);
      fetchEquipmentList();
    } catch (error) {
      const err: any = error;
      const backendMessage =
        err?.data?.message || err?.response?.data?.message || err?.message;
      message.error(backendMessage || '更新失败');
    }
  };

  const handleScrap = async (values: any) => {
    if (!currentEquipment) return;
    try {
      await scrapDevice(currentEquipment.id, values.scrapReason);
      message.success('报废处理成功');
      setScrapVisible(false);
      await fetchEquipmentList();
    } catch (_error) {
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
          await fetchEquipmentList();
        } catch (_error) {
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
      dataIndex: 'DeviceType',
      key: 'deviceType',
      render: (_, record: any) => record.DeviceType?.name ?? record.type,
    },
    {
      title: '采购时间',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      valueType: 'date',
    },
    {
      title: '采购价格（万元）',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (_: any, record: EquipmentItem) =>
        record.purchasePrice ? (record.purchasePrice / 10000).toFixed(2) : '-',
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
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {record.status !== 'scrapped' && (
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
          )}
          {record.status === 'scrapped' && (
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
          {record.status === 'fault' && (
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
    <PageContainer>
      <Card>
        <div className={styles.toolbar}>
          <Space>
            <Search
              placeholder="搜索设备名称/编号"
              className={styles.searchInput}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
            />
            <Select
              defaultValue="all"
              className={styles.statusSelect}
              onChange={handleStatusChange}
            >
              <Option value="all">所有状态</Option>
              <Option value="normal">正常</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="fault">故障</Option>
              <Option value="scrapped">已报废</Option>
            </Select>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setVisible(true)}
            >
              添加设备
            </Button>
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
      </Card>

      <CreateForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleAdd}
      />

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
    </PageContainer>
  );
};

export default EquipmentList;
