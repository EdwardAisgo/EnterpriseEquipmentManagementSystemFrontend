import { Button, Form, Input, DatePicker, InputNumber, Select, Modal } from 'antd';
import React from 'react';

const { Option } = Select;

interface MaintenancePlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  devices: any[];
}

const MaintenancePlanForm: React.FC<MaintenancePlanFormProps> = ({ visible, onCancel, onSubmit, devices }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const nextMaintenance = new Date(values.lastMaintenance);
      switch (values.cycleUnit) {
        case 'day':
          nextMaintenance.setDate(nextMaintenance.getDate() + values.cycle);
          break;
        case 'week':
          nextMaintenance.setDate(nextMaintenance.getDate() + values.cycle * 7);
          break;
        case 'month':
          nextMaintenance.setMonth(nextMaintenance.getMonth() + values.cycle);
          break;
        case 'year':
          nextMaintenance.setFullYear(nextMaintenance.getFullYear() + values.cycle);
          break;
      }

      onSubmit({
        ...values,
        nextMaintenance: nextMaintenance.toISOString(),
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title="新增维护计划"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="deviceId"
          label="选择设备"
          rules={[{ required: true, message: '请选择设备' }]}
        >
          <Select placeholder="请选择设备">
            {devices.map(device => (
              <Option key={device.id} value={device.id}>
                {device.deviceCode} - {device.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="maintenanceType"
          label="维护类型"
          rules={[{ required: true, message: '请选择维护类型' }]}
        >
          <Select placeholder="请选择维护类型">
            <Option value="日常维护">日常维护</Option>
            <Option value="定期维护">定期维护</Option>
            <Option value="专项维护">专项维护</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="cycle"
          label="维护周期"
          rules={[{ required: true, message: '请输入维护周期' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入维护周期" />
        </Form.Item>
        <Form.Item
          name="cycleUnit"
          label="周期单位"
          rules={[{ required: true, message: '请选择周期单位' }]}
        >
          <Select placeholder="请选择周期单位">
            <Option value="day">天</Option>
            <Option value="week">周</Option>
            <Option value="month">月</Option>
            <Option value="year">年</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="lastMaintenance"
          label="上次维护时间"
          rules={[{ required: true, message: '请选择上次维护时间' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="responsiblePerson"
          label="负责人"
          rules={[{ required: true, message: '请输入负责人' }]}
        >
          <Input placeholder="请输入负责人" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaintenancePlanForm;
