import {
  HourglassOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, Col, message, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { createRunningData, getRunningData } from '@/services/business';
import { getDevices } from '@/services/equipment';
import { getMonitoringStats } from '@/services/report';
import RunningDataForm from './components/RunningDataForm';
import styles from './index.less';

const Monitoring: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runningData, setRunningData] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

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
    } catch (_error) {
      message.error('获取运行数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await getMonitoringStats();
      setStats(res.stats || null);
    } catch (_error) {
      message.error('获取监控统计数据失败');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchRunningData();
    fetchStats();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await createRunningData(values);
      message.success('运行数据记录成功');
      setVisible(false);
      fetchRunningData();
    } catch (_error) {
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
      valueType: 'date',
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
      <Row gutter={16} className={styles.statsRow}>
        <Col span={8}>
          <Card bordered={false} loading={statsLoading}>
            <Statistic
              title="设备完好率"
              value={
                stats && stats.totalDevices > 0
                  ? Math.round((stats.normalCount / stats.totalDevices) * 100)
                  : 0
              }
              prefix={<PlayCircleOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} loading={statsLoading}>
            <Statistic
              title="今日总运行时长"
              value={stats?.todayRunningHours ?? 0}
              precision={1}
              prefix={<HourglassOutlined />}
              suffix="h"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} loading={statsLoading}>
            <Statistic
              title="故障待修设备数"
              value={stats?.pendingRepairCount ?? 0}
              prefix={<WarningOutlined />}
              suffix="台"
            />
          </Card>
        </Col>
      </Row>

      <div className={styles.toolbar}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        >
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
