import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

const { TextArea } = Input;

interface DeviceTypeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  deviceType?: any;
}

const DeviceTypeForm: React.FC<DeviceTypeFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  deviceType,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (deviceType) {
        form.setFieldsValue({
          name: deviceType.name,
          description: deviceType.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, deviceType, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={deviceType ? '编辑设备类型' : '新增设备类型'}
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
          name="name"
          label="类型名称"
          rules={[{ required: true, message: '请输入类型名称' }]}
        >
          <Input placeholder="请输入类型名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceTypeForm;
