import { Button, Form, Input, Select, Modal } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

interface RoleFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  role: Role | null;
}

const RoleForm: React.FC<RoleFormProps> = ({ visible, onCancel, onSubmit, role }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
  }, [role, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={role ? '更新角色' : '新增角色'}
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
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <TextArea rows={3} placeholder="请输入角色描述" />
        </Form.Item>
        <Form.Item
          name="permissions"
          label="权限"
          rules={[{ required: true, message: '请选择权限' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择权限"
            style={{ width: '100%' }}
          >
            <Option value="设备管理">设备管理</Option>
            <Option value="运行监控">运行监控</Option>
            <Option value="维护保养">维护保养</Option>
            <Option value="故障维修">故障维修</Option>
            <Option value="数据统计">数据统计</Option>
            <Option value="系统管理">系统管理</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;