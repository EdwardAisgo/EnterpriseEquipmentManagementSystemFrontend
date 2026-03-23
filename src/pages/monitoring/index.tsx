import { Button, Card, Col, Row, Statistic, message, Space, Select } from 'antd';
import { PlusOutlined, DashboardOutlined, ThunderboltOutlined, HourglassOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import RunningDataForm from './components/RunningDataForm';
import { getRunningData, createRunningData } from '@/services/business';
import { getDevices } from '@/services/equipment';

const Monitoring: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runningData, setRunningData] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.devices || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRunningData = async () => {
    setLoading(true);
    try {
      const res = await getRunningData();
      setRunningData(res.runningData || []);
    } catch (error) {
      message.error('获取运行数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchRunningData();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await createRunningData(values);
      message.success('运行数据记录成功');
      setVisible(false);
      fetchRunningData();
    } catch (error) {
      message.error('记录失败');
    }
  };

  const columns: ProColumns<any>[] = [
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
      title: '运行日期',
      dataIndex: 'date',
      key: 'date',
      valueType: 'dateTime',
    },
    {
      title: '运行时长(h)',
      dataIndex: 'runningHours',
      key: 'runningHours',
    },
    {
      title: '生产量',
      dataIndex: 'production',
      key: 'production',
    },
    {
      title: '能耗(kWh)',
      dataIndex: 'energyConsumption',
      key: 'energyConsumption',
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="今日总运行时长"
              value={128.5}
              precision={1}
              prefix={<HourglassOutlined />}
              suffix="h"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="今日总产量"
              value={15420}
              prefix={<DashboardOutlined />}
              suffix="pcs"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="今日总能耗"
              value={856.2}
              precision={1}
              prefix={<ThunderboltOutlined />}
              suffix="kWh"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
          上报运行数据
        </Button>
      </div>

      <ProTable
        columns={columns}
        dataSource={runningData}
        loading={loading}
        rowKey="id"
        search={false}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <RunningDataForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleAdd}
        devices={devices}
      />
    </Card>
  );
};

export default Monitoring;