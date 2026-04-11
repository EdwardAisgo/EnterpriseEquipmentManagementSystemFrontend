import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

const { TextArea } = Input;

interface Department {
  id: string;
  name: string;
  description: string;
}

interface DepartmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  department: Department | null;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  department,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (department) {
      form.setFieldsValue(department);
    } else {
      form.resetFields();
    }
  }, [department, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={department ? '更新部门' : '新增部门'}
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
          label="部门名称"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <TextArea rows={4} placeholder="请输入部门描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
