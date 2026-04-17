import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createMaintenance,
  getMaintenances,
  updateMaintenance,
} from '@/services/business';
import { getDevices } from '@/services/equipment';
import MaintenanceRecordForm from '../components/MaintenanceRecordForm';

type MaintenanceRecord = {
  id: string;
  deviceId: number;
  startDate: string;
  description: string;
  technician: string;
  maintenanceType: string;
  cost: number;
  notes: string;
  Device: {
    deviceCode: string;
    name: string;
  };
};

const RecordManagement: React.FC = () => {
  const [recordVisible, setRecordVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MaintenanceRecord | null>(
    null,
  );
  const [isViewModeForRecord, setIsViewModeForRecord] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [recordId, setRecordId] = useState<string | number>('');
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.devices || []);
    } catch (error) {
      console.error(error);
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
    fetchRecords();
  }, []);

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

  const handleUpdateRecord = async (values: any) => {
    try {
      await updateMaintenance(recordId, values);
      message.success('维护记录更新成功');
      setRecordVisible(false);
      fetchRecords();
    } catch (error) {
      message.error('维护记录更新失败');
    }
  };

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
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setCurrentRecord(record);
              setRecordVisible(true);
              setIsViewModeForRecord(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => {
              setCurrentRecord(record);
              setRecordId(record?.id);
              setRecordVisible(true);
              setIsViewModeForRecord(false);
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
        columns={recordColumns}
        dataSource={maintenanceRecords}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRecord(null);
              setRecordId('');
              setIsViewModeForRecord(false);
              setRecordVisible(true);
            }}
          >
            添加维护记录
          </Button>,
        ]}
        search={false}
        options={false}
      />

      <MaintenanceRecordForm
        visible={recordVisible}
        onCancel={() => {
          setRecordVisible(false);
          setCurrentRecord(null);
          setRecordId('');
          setIsViewModeForRecord(false);
        }}
        onSubmit={recordId ? handleUpdateRecord : handleAddRecord}
        values={currentRecord}
        devices={devices}
        isViewMode={isViewModeForRecord}
      />
    </PageContainer>
  );
};

export default RecordManagement;
