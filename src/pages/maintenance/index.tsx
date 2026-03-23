import { Button, Card, Input, Select, message, Space, Modal, Alert, Badge, Tabs } from 'antd';
import { PlusOutlined, CalendarOutlined, BellOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import MaintenancePlanForm from './components/MaintenancePlanForm';
import MaintenanceRecordForm from './components/MaintenanceRecordForm';
import { getMaintenances, createMaintenance, getMaintenancePlans, createMaintenancePlan } from '@/services/business';
import { getDevices } from '@/services/equipment';

const { Search } = Input;
const { Option } = Select;

type MaintenancePlan = {
  id: string;
  deviceId: number;
  maintenanceType: string;
  cycle: number;
  cycleUnit: 'day' | 'week' | 'month' | 'year';
  lastMaintenance: string;
  nextMaintenance: string;
  responsiblePerson: string;
  status: 'active' | 'inactive';
  alert: boolean;
  Device: {
    deviceCode: string;
    name: string;
  };
};

type MaintenanceRecord = {
  id: string;
  deviceId: number;
  maintenanceDate: string;
  maintenanceContent: string;
  maintenancePerson: string;
  cost: number;
  notes: string;
  Device: {
    deviceCode: string;
    name: string;
  };
};

const MaintenanceManagement: React.FC = () => {
  const [planVisible, setPlanVisible] = useState(false);
  const [recordVisible, setRecordVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MaintenancePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('plan');

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.devices || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getMaintenancePlans();
      setMaintenancePlans(res.maintenancePlans || res.plans || []);
    } catch (error) {
      message.error('获取维护计划失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getMaintenances();
      setMaintenanceRecords(res.maintenances || []);
    } catch (error) {
      message.error('获取维护记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchPlans();
    fetchRecords();
  }, []);

  const handleAddPlan = async (values: any) => {
    try {
      await createMaintenancePlan(values);
      message.success('维护计划创建成功');
      setPlanVisible(false);
      fetchPlans();
    } catch (error) {
      message.error('维护计划创建失败');
    }
  };

  const handleAddRecord = async (values: any) => {
    try {
      await createMaintenance(values);
      message.success('维护记录添加成功');
      setRecordVisible(false);
      fetchRecords();
    } catch (error) {
      message.error('维护记录添加失败');
    }
  };

  const planColumns: ProColumns<MaintenancePlan>[] = [
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
      title: '维护类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
    },
    {
      title: '维护周期',
      dataIndex: ['cycle', 'cycleUnit'],
      key: 'cycle',
      render: (_, record) => {
        const unitMap = {
          day: '天',
          week: '周',
          month: '月',
          year: '年',
        };
        return `${record.cycle} ${unitMap[record.cycleUnit]}`;
      },
    },
    {
      title: '上次维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      valueType: 'date',
    },
    {
      title: '下次维护',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
      valueType: 'date',
      render: (text, record) => (
        <div>
          <span>{text}</span>
          {record.alert && (
            <Badge status="error" text="需要维护" style={{ marginLeft: 8 }} />
          )}
        </div>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        active: { text: '活跃', status: 'Success' },
        inactive: { text: ' inactive', status: 'Default' },
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<CalendarOutlined />}
            onClick={() => {
              setCurrentPlan(record);
              setRecordVisible(true);
            }}
          >
            记录维护
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns: ProColumns<MaintenanceRecord>[] = [
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
      title: '维护日期',
      dataIndex: 'startDate',
      key: 'startDate',
      valueType: 'date',
    },
    {
      title: '维护内容',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '维护人员',
      dataIndex: 'technician',
      key: 'technician',
    },
    {
      title: '维护费用',
      dataIndex: 'cost',
      key: 'cost',
      valueType: 'money',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'plan',
            label: '维护计划',
            children: (
              <>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setPlanVisible(true)}>
                    制定维护计划
                  </Button>
                </div>
                <ProTable
                  columns={planColumns}
                  dataSource={maintenancePlans}
                  loading={loading}
                  rowKey="id"
                  search={false}
                  options={false}
                />
              </>
            ),
          },
          {
            key: 'record',
            label: '维护记录',
            children: (
              <>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setRecordVisible(true)}>
                    添加维护记录
                  </Button>
                </div>
                <ProTable
                  columns={recordColumns}
                  dataSource={maintenanceRecords}
                  loading={loading}
                  rowKey="id"
                  search={false}
                  options={false}
                />
              </>
            ),
          },
        ]}
      />

      <MaintenancePlanForm
        visible={planVisible}
        onCancel={() => setPlanVisible(false)}
        onSubmit={handleAddPlan}
        devices={devices}
      />

      <MaintenanceRecordForm
        visible={recordVisible}
        onCancel={() => setRecordVisible(false)}
        onSubmit={handleAddRecord}
        devices={devices}
      />
    </Card>
  );
};

export default MaintenanceManagement;
