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
import { getDeviceTypes } from '@/services/equipment';

const { Option } = Select;

interface CreateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      getDeviceTypes().then((res) => {
        setDeviceTypes(res.deviceTypes || []);
      });
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        purchasePrice: values.purchasePrice
          ? values.purchasePrice * 10000
          : undefined,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title="新增设备"
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
      <Form form={form} layout="vertical" initialValues={{ status: 'normal' }}>
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
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchasePrice"
          label="采购价格（万元）"
          rules={[{ required: true, message: '请输入采购价格' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
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
            <Option value="normal">正常</Option>
            <Option value="maintenance">维护中</Option>
            <Option value="fault">故障</Option>
            <Option value="scrapped">已报废</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
