import { Button, Card, message, Space, Typography, Tabs, Tag } from 'antd';
import { PlusOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import RepairRequestForm from './components/RepairRequestForm';
import AssignForm from './components/AssignForm';
import RepairForm from './components/RepairForm';
import { getRepairOrders, createRepairOrder, updateRepairOrder } from '@/services/business';
import { getDevices } from '@/services/equipment';

const { TabPane } = Tabs;
const { Text } = Typography;

const RepairManagement: React.FC = () => {
  const [requestVisible, setRequestVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [repairVisible, setRepairVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [repairOrders, setRepairOrders] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.devices || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getRepairOrders();
      setRepairOrders(res.repairOrders || []);
    } catch (error) {
      message.error('获取维修工单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchOrders();
  }, []);

  const handleAddRequest = async (values: any) => {
    try {
      await createRepairOrder(values);
      message.success('报修申请提交成功');
      setRequestVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('报修申请提交失败');
    }
  };

  const handleAssign = async (values: any) => {
    if (!currentOrder) return;
    try {
      await updateRepairOrder(currentOrder.id, { ...values, status: 'assigned' });
      message.success('派单成功');
      setAssignVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('派单失败');
    }
  };

  const handleRepair = async (values: any) => {
    if (!currentOrder) return;
    try {
      await updateRepairOrder(currentOrder.id, { ...values, status: 'completed' });
      message.success('维修记录已保存');
      setRepairVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备编号',
      dataIndex: ['Device', 'deviceCode'],
      key: 'deviceCode',
    },
    {
      title: '设备名称',
      dataIndex: ['Device', 'name'],
      key: 'deviceName',
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      valueType: 'date',
    },
    {
      title: '故障描述',
      dataIndex: 'faultDescription',
      key: 'faultDescription',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        pending: { text: '待处理', status: 'Default' },
        assigned: { text: '已派单', status: 'Processing' },
        in_progress: { text: '维修中', status: 'Warning' },
        completed: { text: '已完成', status: 'Success' },
      },
    },
    {
      title: '维修人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="link"
              icon={<UserOutlined />}
              onClick={() => {
                setCurrentOrder(record);
                setAssignVisible(true);
              }}
            >
              派单
            </Button>
          )}
          {(record.status === 'assigned' || record.status === 'in_progress') && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setCurrentOrder(record);
                setRepairVisible(true);
              }}
            >
              维修
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 按状态筛选工单
  const pendingOrders = repairOrders.filter((order) => order.status === 'pending');
  const assignedOrders = repairOrders.filter((order) => order.status === 'assigned' || order.status === 'in_progress');
  const completedOrders = repairOrders.filter((order) => order.status === 'completed');

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setRequestVisible(true)}
        >
          报修申请
        </Button>
      </div>

      <ProTable
        columns={columns}
        dataSource={repairOrders}
        loading={loading}
        rowKey="id"
        search={false}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <RepairRequestForm
        visible={requestVisible}
        onCancel={() => setRequestVisible(false)}
        onSubmit={handleAddRequest}
        devices={devices}
      />

      {currentOrder && (
        <AssignForm
          visible={assignVisible}
          onCancel={() => setAssignVisible(false)}
          onSubmit={handleAssign}
          order={currentOrder}
        />
      )}

      {currentOrder && (
        <RepairForm
          visible={repairVisible}
          onCancel={() => setRepairVisible(false)}
          onSubmit={handleRepair}
          order={currentOrder}
        />
      )}
    </Card>
  );
};

export default RepairManagement;