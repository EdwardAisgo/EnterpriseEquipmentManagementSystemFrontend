import {
  CheckCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createRepairOrder,
  getRepairOrders,
  getUsers,
  updateRepairOrder,
} from '@/services/business';
import { getDevices } from '@/services/equipment';
import AssignForm from '../components/AssignForm';
import RepairForm from '../components/RepairForm';
import RepairRequestForm from '../components/RepairRequestForm';

const RepairOrders: React.FC = () => {
  const [requestVisible, setRequestVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [repairVisible, setRepairVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [repairOrders, setRepairOrders] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.devices || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getRepairOrders();
      setRepairOrders(res.repairOrders || []);
    } catch (_error) {
      message.error('获取维修工单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleAddRequest = async (values: any) => {
    try {
      await createRepairOrder(values);
      message.success('报修申请提交成功');
      setRequestVisible(false);
      fetchOrders();
    } catch (_error) {
      message.error('报修申请提交失败');
    }
  };

  const handleAssign = async (values: any) => {
    if (!currentOrder) return;
    try {
      await updateRepairOrder(currentOrder.id, {
        ...values,
        status: 'assigned',
      });
      message.success('派单成功');
      setAssignVisible(false);
      fetchOrders();
    } catch (_error) {
      message.error('派单失败');
    }
  };

  const handleRepair = async (values: any) => {
    if (!currentOrder) return;
    try {
      await updateRepairOrder(currentOrder.id, {
        ...values,
        status: 'completed',
        repairCost: values.repairCost ? values.repairCost * 10000 : undefined,
      });
      message.success('维修记录已保存');
      setRepairVisible(false);
      fetchOrders();
    } catch (_error) {
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
      title: '维修费用（万元）',
      dataIndex: 'repairCost',
      key: 'repairCost',
      render: (_: any, record: any) =>
        record.repairCost ? (record.repairCost / 10000).toFixed(2) : '-',
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
          {(record.status === 'assigned' ||
            record.status === 'in_progress') && (
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

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        dataSource={repairOrders}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setRequestVisible(true)}
          >
            报修申请
          </Button>,
        ]}
        search={false}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <RepairRequestForm
        visible={requestVisible}
        onCancel={() => setRequestVisible(false)}
        onSubmit={handleAddRequest}
        devices={devices}
        users={users}
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
    </PageContainer>
  );
};

export default RepairOrders;
