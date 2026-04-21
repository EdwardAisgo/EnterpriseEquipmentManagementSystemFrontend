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
import styles from './RunningDataForm.less';

const { TextArea } = Input;
const { Option } = Select;

interface RunningDataFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  devices: any[];
}

const RunningDataForm: React.FC<RunningDataFormProps> = ({
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
      title="上报运行数据"
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
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker className={styles.fullWidth} showTime />
        </Form.Item>
        <Form.Item
          name="runningHours"
          label="运行时长"
          rules={[{ required: true, message: '请输入运行时长' }]}
        >
          <InputNumber
            className={styles.fullWidth}
            placeholder="请输入运行时长（小时）"
          />
        </Form.Item>
        <Form.Item
          name="production"
          label="产量"
          rules={[{ required: true, message: '请输入产量' }]}
        >
          <InputNumber className={styles.fullWidth} placeholder="请输入产量" />
        </Form.Item>
        <Form.Item
          name="energyConsumption"
          label="能耗"
          rules={[{ required: true, message: '请输入能耗' }]}
        >
          <InputNumber className={styles.fullWidth} placeholder="请输入能耗" />
        </Form.Item>
        <Form.Item
          name="operator"
          label="操作员"
          rules={[{ required: true, message: '请选择操作员' }]}
        >
          <Select
            placeholder="请选择操作员"
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
        <Form.Item name="notes" label="备注">
          <TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RunningDataForm;
