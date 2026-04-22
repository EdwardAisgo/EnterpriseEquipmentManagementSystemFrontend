import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Col,
  DatePicker,
  message,
  Row,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import {
  getDeviceStatusReport,
  getMaintenanceCostReport,
  getMaintenanceExpiringReport,
  getMaintenanceTypeReport,
} from '@/services/report';
import styles from './index.less';

const AnalyticsOverview: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number>(dayjs().year());
  const [expiringPlans, setExpiringPlans] = useState<any[]>([]);

  const costChartRef = useRef<HTMLDivElement>(null);
  const statusChartRef = useRef<HTMLDivElement>(null);
  const typeChartRef = useRef<HTMLDivElement>(null);

  const costChartInstance = useRef<echarts.ECharts | null>(null);
  const statusChartInstance = useRef<echarts.ECharts | null>(null);
  const typeChartInstance = useRef<echarts.ECharts | null>(null);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [statusRes, costRes, typeRes, expiringRes] = await Promise.all([
        getDeviceStatusReport(),
        getMaintenanceCostReport(year),
        getMaintenanceTypeReport(),
        getMaintenanceExpiringReport(),
      ]);

      setExpiringPlans(expiringRes.expiringPlans || []);

      if (statusChartInstance.current && statusRes.statusCounts) {
        const statusMap: Record<string, string> = {
          normal: '正常运行',
          maintenance: '维护中',
          fault: '故障中',
          scrapped: '已报废',
        };
        const statusData = statusRes.statusCounts.map((item: any) => ({
          name: statusMap[item.status] || item.status,
          value: parseInt(item.count, 10),
        }));
        statusChartInstance.current.setOption({
          series: [{ data: statusData }],
        });
      }

      if (costChartInstance.current && costRes.monthlyCosts) {
        const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
        const costs = Array(12).fill(0);
        costRes.monthlyCosts.forEach((item: any) => {
          costs[item.month - 1] = parseFloat(item.totalCost) / 10000;
        });
        costChartInstance.current.setOption({
          xAxis: { data: months },
          series: [{ data: costs }],
        });
      }

      if (typeChartInstance.current && typeRes.typeCounts) {
        const typeMap: Record<string, string> = {
          preventive: '预防性维护',
          corrective: '纠正性维护',
          predictive: '预测性维护',
        };
        const typeData = typeRes.typeCounts.map((item: any) => ({
          name: typeMap[item.maintenanceType] || item.maintenanceType,
          value: parseInt(item.count, 10),
        }));
        typeChartInstance.current.setOption({ series: [{ data: typeData }] });
      }
    } catch (_error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  const maintenanceColumns = [
    {
      title: '设备编号',
      dataIndex: ['Device', 'deviceCode'],
      key: 'deviceCode',
    },
    { title: '设备名称', dataIndex: ['Device', 'name'], key: 'name' },
    {
      title: '维护类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      render: (text: string) => {
        const typeMap: Record<string, string> = {
          preventive: '预防性维护',
          corrective: '纠正性维护',
          predictive: '预测性维护',
        };
        return typeMap[text] || text;
      },
    },
    {
      title: '设备状态',
      dataIndex: ['Device', 'status'],
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          normal: { text: '正常', color: 'green' },
          maintenance: { text: '维护中', color: 'blue' },
          fault: { text: '故障', color: 'red' },
          scrapped: { text: '已报废', color: 'grey' },
        };
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '计划维护日期',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '剩余天数',
      key: 'remainingDays',
      render: (_: any, record: any) => {
        const days = dayjs(record.nextMaintenance).diff(dayjs(), 'day');
        return (
          <span
            className={
              days <= 7
                ? styles.remainingDaysDanger
                : styles.remainingDaysWarning
            }
          >
            {days} 天
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    if (costChartRef.current) {
      costChartInstance.current = echarts.init(costChartRef.current);
      costChartInstance.current.setOption({
        title: { text: '月度维护成本趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '金额（万元）' },
        series: [
          {
            name: '维护成本',
            type: 'bar',
            data: [],
            itemStyle: { color: '#1890ff' },
          },
        ],
      });
    }
    if (statusChartRef.current) {
      statusChartInstance.current = echarts.init(statusChartRef.current);
      statusChartInstance.current.setOption({
        title: { text: '设备状态分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left', top: 'center' },
        series: [{ name: '设备状态', type: 'pie', radius: '50%', data: [] }],
      });
    }
    if (typeChartRef.current) {
      typeChartInstance.current = echarts.init(typeChartRef.current);
      typeChartInstance.current.setOption({
        title: { text: '维护类型占比', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left', top: 'center' },
        series: [
          { name: '维护类型', type: 'pie', radius: ['40%', '70%'], data: [] },
        ],
      });
    }
    const handleResize = () => {
      costChartInstance.current?.resize();
      statusChartInstance.current?.resize();
      typeChartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      costChartInstance.current?.dispose();
      statusChartInstance.current?.dispose();
      typeChartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [year]);

  return (
    <PageContainer>
      <Space
        direction="vertical"
        size="large"
        className={styles.spaceFullWidth}
      >
        <Card>
          <Space>
            <span>选择年份：</span>
            <DatePicker
              picker="year"
              defaultValue={dayjs()}
              onChange={(date) => date && setYear(date.year())}
              allowClear={false}
            />
          </Space>
        </Card>
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <div ref={costChartRef} className={styles.chartContainer} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <div ref={statusChartRef} className={styles.chartContainer} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <div ref={typeChartRef} className={styles.chartContainer} />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="待执行维护计划提醒 (30天内)">
                <Table
                  columns={maintenanceColumns}
                  dataSource={expiringPlans}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </Space>
    </PageContainer>
  );
};

export default AnalyticsOverview;
