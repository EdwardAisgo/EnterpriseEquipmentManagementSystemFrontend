import { Button, DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getUsers } from '@/services/business';
import styles from './MaintenancePlanForm.less';

const { Option } = Select;

interface MaintenancePlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  devices: any[];
  values?: any;
  isViewMode?: boolean;
}

const MaintenancePlanForm: React.FC<MaintenancePlanFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  devices,
  values,
  isViewMode = false,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (visible && values) {
      form.setFieldsValue({
        ...values,
        lastMaintenance: values.lastMaintenance
          ? dayjs(values.lastMaintenance)
          : undefined,
      });
    } else if (visible && !values) {
      form.resetFields();
    }
    if (!visible) {
      form.resetFields();
    }
  }, [visible, values, form]);

  useEffect(() => {
    if (visible) {
      getUsers().then((res) => {
        setUsers(res.users || []);
      });
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const lastMaintenanceStr = values.lastMaintenance
        ? values.lastMaintenance.format('YYYY-MM-DD')
        : undefined;
      const nextMaintenance = new Date(lastMaintenanceStr + 'T00:00:00');
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
          nextMaintenance.setFullYear(
            nextMaintenance.getFullYear() + values.cycle,
          );
          break;
      }
      const nextMaintenanceStr = `${nextMaintenance.getFullYear()}-${String(
        nextMaintenance.getMonth() + 1,
      ).padStart(2, '0')}-${String(nextMaintenance.getDate()).padStart(
        2,
        '0',
      )}`;

      onSubmit({
        ...values,
        lastMaintenance: lastMaintenanceStr,
        nextMaintenance: nextMaintenanceStr,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={
        isViewMode ? '查看维护计划' : values ? '编辑维护计划' : '新增维护计划'
      }
      open={visible}
      onCancel={onCancel}
      footer={
        isViewMode
          ? [
              <Button key="close" onClick={onCancel}>
                关闭
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={onCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>
                {values ? '更新' : '确定'}
              </Button>,
            ]
      }
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
            disabled={isViewMode}
          >
            {devices.map((device) => (
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
          <Select placeholder="请选择维护类型" disabled={isViewMode}>
            <Option value="preventive">预防性维护</Option>
            <Option value="corrective">纠正性维护</Option>
            <Option value="predictive">预测性维护</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="cycle"
          label="维护周期"
          rules={[{ required: true, message: '请输入维护周期' }]}
        >
          <InputNumber
            className={styles.fullWidth}
            placeholder="请输入维护周期"
            disabled={isViewMode}
          />
        </Form.Item>
        <Form.Item
          name="cycleUnit"
          label="周期单位"
          rules={[{ required: true, message: '请选择周期单位' }]}
        >
          <Select placeholder="请选择周期单位" disabled={isViewMode}>
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
          <DatePicker className={styles.fullWidth} disabled={isViewMode} />
        </Form.Item>
        <Form.Item
          name="responsiblePerson"
          label="负责人"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select
            placeholder="请选择负责人"
            showSearch
            filterOption={(input, option) =>
              String(option?.children ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={isViewMode}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.name}>
                {user.name} ({user.username})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MaintenancePlanForm;
