import { Button, Form, Input, Modal, Tree } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const { TextArea } = Input;

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
};

type RoleFormProps = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  role: Role | null;
  menus: any[];
};

const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  role,
  menus,
}) => {
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const treeData = useMemo(() => {
    const toTree = (items: any[]): any[] =>
      (items || [])
        .filter((m) => m && !m.hideInMenu)
        .map((m) => ({
          title: m.name,
          key: String(m.id),
          children: toTree(m.children || []),
        }));
    return toTree(menus || []);
  }, [menus]);

  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
      setCheckedKeys(Array.isArray(role.permissions) ? role.permissions : []);
      return;
    }
    form.resetFields();
    setCheckedKeys([]);
  }, [role, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...values,
      permissions: checkedKeys.map(String),
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
        <Form.Item label="权限菜单" required>
          <Tree
            checkable
            selectable={false}
            defaultExpandAll
            checkedKeys={checkedKeys}
            onCheck={(keys) => {
              const nextKeys = Array.isArray(keys) ? keys : keys.checked;
              setCheckedKeys(nextKeys);
            }}
            treeData={treeData}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;
