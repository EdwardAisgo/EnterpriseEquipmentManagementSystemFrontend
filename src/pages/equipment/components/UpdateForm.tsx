import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getDepartments } from '@/services/business';
import { getDeviceTypes } from '@/services/equipment';
import styles from './UpdateForm.less';

const { Option } = Select;

interface Equipment {
  id: string;
  deviceCode: string;
  name: string;
  type: string;
  deviceTypeId?: number;
  model: string;
  departmentId?: number;
  purchaseDate: string;
  purchasePrice: number;
  location: string;
  status: 'normal' | 'maintenance' | 'fault' | 'scrapped';
  scrapDate?: string;
  scrapReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Equipment | null;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  values,
}) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<any[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      getDepartments().then((res) => {
        setDepartments(res.departments || []);
      });
      getDeviceTypes().then((res) => {
        setDeviceTypes(res.deviceTypes || []);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible && values) {
      form.setFieldsValue({
        ...values,
        deviceTypeId: values.deviceTypeId,
        purchaseDate: values.purchaseDate ? dayjs(values.purchaseDate) : null,
        purchasePrice: values.purchasePrice
          ? values.purchasePrice / 10000
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [values, visible, form]);

  const handleSubmit = () => {
    form.validateFields().then((fieldsValue) => {
      onSubmit({
        ...fieldsValue,
        purchaseDate: fieldsValue.purchaseDate
          ? fieldsValue.purchaseDate.format('YYYY-MM-DD')
          : undefined,
      });
    });
  };

  return (
    <Modal
      title="更新设备"
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
          name="deviceCode"
          label="设备编号"
          rules={[{ required: true, message: '请输入设备编号' }]}
        >
          <Input placeholder="请输入设备编号" />
        </Form.Item>
        <Form.Item
          name="name"
          label="设备名称"
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input placeholder="请输入设备名称" />
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="所属部门"
          rules={[{ required: true, message: '请选择所属部门' }]}
        >
          <Select placeholder="请选择所属部门">
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="deviceTypeId"
          label="设备类型"
          rules={[{ required: true, message: '请选择设备类型' }]}
        >
          <Select placeholder="请选择设备类型">
            {deviceTypes.map((dt) => (
              <Option key={dt.id} value={dt.id}>
                {dt.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="model"
          label="设备型号"
          rules={[{ required: true, message: '请输入设备型号' }]}
        >
          <Input placeholder="请输入设备型号" />
        </Form.Item>
        <Form.Item
          name="purchaseDate"
          label="采购时间"
          rules={[{ required: true, message: '请选择采购时间' }]}
        >
          <DatePicker className={styles.fullWidth} />
        </Form.Item>
        <Form.Item
          name="purchasePrice"
          label="采购价格（万元）"
          rules={[{ required: true, message: '请输入采购价格' }]}
        >
          <InputNumber
            className={styles.fullWidth}
            placeholder="请输入采购价格（万元）"
          />
        </Form.Item>
        <Form.Item
          name="location"
          label="存放位置"
          rules={[{ required: true, message: '请输入存放位置' }]}
        >
          <Input placeholder="请输入存放位置" />
        </Form.Item>
        <Form.Item
          name="status"
          label="设备状态"
          rules={[{ required: true, message: '请选择设备状态' }]}
        >
          <Select placeholder="请选择设备状态">
            <Option value="normal">正常运行</Option>
            <Option value="maintenance">维护中</Option>
            <Option value="fault">故障中</Option>
            <Option value="scrapped">已报废</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
