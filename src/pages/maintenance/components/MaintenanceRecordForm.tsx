import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { getUsers } from '@/services/business';

const { TextArea } = Input;
const { Option } = Select;

interface MaintenanceRecordFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  devices: any[];
}

const MaintenanceRecordForm: React.FC<MaintenanceRecordFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  devices,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      getUsers().then((res) => {
        setUsers(res.users || []);
      });
    }
  }, [visible, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="记录维护信息"
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
          <Select
            placeholder="请选择设备"
            showSearch
            filterOption={(input, option) =>
              String(option?.children ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {devices.map((device) => (
              <Option key={device.id} value={device.id}>
                {device.deviceCode} - {device.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="maintenanceDate"
          label="维护日期"
          rules={[{ required: true, message: '请选择维护日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="maintenanceType"
          label="维护类型"
          rules={[{ required: true, message: '请选择维护类型' }]}
          initialValue="preventive"
        >
          <Select placeholder="请选择维护类型">
            <Option value="preventive">预防性维护</Option>
            <Option value="corrective">纠正性维护</Option>
            <Option value="predictive">预测性维护</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maintenanceContent"
          label="维护内容"
          rules={[{ required: true, message: '请输入维护内容' }]}
        >
          <TextArea rows={4} placeholder="请输入维护内容" />
        </Form.Item>
        <Form.Item
          name="maintenancePerson"
          label="维护人员"
          rules={[{ required: true, message: '请选择维护人员' }]}
        >
          <Select
            placeholder="请选择维护人员"
            showSearch
            filterOption={(input, option) =>
              String(option?.children ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {users.map((user) => (
              <Option key={user.id} value={user.name}>
                {user.name} ({user.username})
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="cost"
          label="维护费用"
          rules={[{ required: true, message: '请输入维护费用' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入维护费用" />
        </Form.Item>
        <Form.Item name="notes" label="备注">
          <TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaintenanceRecordForm;
