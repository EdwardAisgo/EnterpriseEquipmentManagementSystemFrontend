import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Badge, Button, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createMaintenancePlan,
  getMaintenancePlans,
  updateMaintenancePlan,
} from '@/services/business';
import { getDevices } from '@/services/equipment';
import MaintenancePlanForm from '../components/MaintenancePlanForm';
import styles from './index.less';

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

const PlanManagement: React.FC = () => {
  const [planVisible, setPlanVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MaintenancePlan | null>(null);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>(
    [],
  );
  const [planId, setPlanId] = useState<string | number>('');
  const [devices, setDevices] = useState<any[]>([]);

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

  useEffect(() => {
    fetchDevices();
    fetchPlans();
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

  const handleUpdatePlan = async (values: any) => {
    try {
      await updateMaintenancePlan(planId, values);
      message.success('维护计划更新成功');
      setPlanVisible(false);
      fetchPlans();
    } catch (error) {
      message.error('维护计划更新失败');
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
      render: (text) => {
        const typeMap = {
          preventive: '预防性维护',
          corrective: '纠正性维护',
          predictive: '预测性维护',
        };
        return typeMap[text as keyof typeof typeMap] || text;
      },
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
            <Badge
              status="error"
              text="需要维护"
              className={styles.alertBadge}
            />
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
            type="link"
            onClick={() => {
              setCurrentPlan(record);
              setPlanVisible(true);
              setIsViewMode(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => {
              setCurrentPlan(record);
              setPlanId(record?.id);
              setPlanVisible(true);
              setIsViewMode(false);
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={planColumns}
        dataSource={maintenancePlans}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentPlan(null);
              setPlanId('');
              setIsViewMode(false);
              setPlanVisible(true);
            }}
          >
            制定维护计划
          </Button>,
        ]}
        search={false}
        options={false}
      />

      <MaintenancePlanForm
        visible={planVisible}
        onCancel={() => {
          setPlanVisible(false);
          setCurrentPlan(null);
          setPlanId('');
          setIsViewMode(false);
        }}
        onSubmit={planId ? handleUpdatePlan : handleAddPlan}
        values={currentPlan}
        devices={devices}
        isViewMode={isViewMode}
      />
    </PageContainer>
  );
};

export default PlanManagement;
