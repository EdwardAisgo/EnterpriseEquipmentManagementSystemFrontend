import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

const { TextArea } = Input;

interface ScrapFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values?: any;
}

const ScrapForm: React.FC<ScrapFormProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="设备报废"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" danger onClick={handleSubmit}>
          确定报废
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="scrapReason"
          label="报废原因"
          rules={[{ required: true, message: '请输入报废原因' }]}
        >
          <TextArea rows={4} placeholder="请输入设备报废原因" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScrapForm;
