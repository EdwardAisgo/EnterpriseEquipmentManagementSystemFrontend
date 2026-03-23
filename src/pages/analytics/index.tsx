import { Card, Row, Col, DatePicker, Select, Space } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据
const maintenanceCostData = [
  { month: '1月', cost: 5000 },
  { month: '2月', cost: 3000 },
  { month: '3月', cost: 4500 },
  { month: '4月', cost: 6000 },
  { month: '5月', cost: 4000 },
  { month: '6月', cost: 5500 },
];

const equipmentStatusData = [
  { name: '正常运行', value: 60 },
  { name: '维护中', value: 20 },
  { name: '故障中', value: 10 },
  { name: '已报废', value: 10 },
];

const failureRateData = [
  { month: '1月', rate: 2 },
  { month: '2月', rate: 3 },
  { month: '3月', rate: 1 },
  { month: '4月', rate: 4 },
  { month: '5月', rate: 2 },
  { month: '6月', rate: 1.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsManagement: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [equipmentType, setEquipmentType] = useState<string>('all');
  
  const costChartRef = useRef<HTMLDivElement>(null);
  const statusChartRef = useRef<HTMLDivElement>(null);
  const rateChartRef = useRef<HTMLDivElement>(null);
  
  const costChartInstance = useRef<echarts.ECharts | null>(null);
  const statusChartInstance = useRef<echarts.ECharts | null>(null);
  const rateChartInstance = useRef<echarts.ECharts | null>(null);

  const handleDateChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleTypeChange = (value: string) => {
    setEquipmentType(value);
  };

  useEffect(() => {
    // 初始化月度维护成本图表
    if (costChartRef.current) {
      costChartInstance.current = echarts.init(costChartRef.current);
      const costOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['维护成本']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: maintenanceCostData.map(item => item.month)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '维护成本',
            type: 'bar',
            data: maintenanceCostData.map(item => item.cost),
            itemStyle: {
              color: '#8884d8'
            }
          }
        ]
      };
      costChartInstance.current.setOption(costOption);
    }

    // 初始化设备状态分布图表
    if (statusChartRef.current) {
      statusChartInstance.current = echarts.init(statusChartRef.current);
      const statusOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            radius: '50%',
            data: equipmentStatusData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function(params: any) {
                return COLORS[params.dataIndex % COLORS.length];
              }
            },
            label: {
              formatter: '{b}: {d}%'
            }
          }
        ]
      };
      statusChartInstance.current.setOption(statusOption);
    }

    // 初始化设备故障率趋势图表
    if (rateChartRef.current) {
      rateChartInstance.current = echarts.init(rateChartRef.current);
      const rateOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['故障率(%)']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: failureRateData.map(item => item.month)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '故障率(%)',
            type: 'line',
            data: failureRateData.map(item => item.rate),
            itemStyle: {
              color: '#82ca9d'
            },
            symbol: 'circle',
            symbolSize: 8
          }
        ]
      };
      rateChartInstance.current.setOption(rateOption);
    }

    // 响应式调整
    const handleResize = () => {
      costChartInstance.current?.resize();
      statusChartInstance.current?.resize();
      rateChartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      costChartInstance.current?.dispose();
      statusChartInstance.current?.dispose();
      rateChartInstance.current?.dispose();
    };
  }, []);

  return (
    <div>
      <Card
        title="数据统计分析"
        extra={
          <Space>
            <RangePicker onChange={handleDateChange} />
            <Select defaultValue="all" style={{ width: 120 }} onChange={handleTypeChange}>
              <Option value="all">全部设备</Option>
              <Option value="production">生产设备</Option>
              <Option value="packaging">包装设备</Option>
              <Option value="processing">加工设备</Option>
            </Select>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Card title="月度维护成本">
              <div ref={costChartRef} style={{ width: '100%', height: 300 }} />
            </Card>
          </Col>
          <Col span={24} md={12}>
            <Card title="设备状态分布">
              <div ref={statusChartRef} style={{ width: '100%', height: 300 }} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="设备故障率趋势">
              <div ref={rateChartRef} style={{ width: '100%', height: 300 }} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AnalyticsManagement;