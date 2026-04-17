import { Button, Form, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUsers } from '@/services/business';

const { Option } = Select;

interface RepairOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  applicant: string;
  applyDate: string;
  faultDescription: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedTo?: string;
  repairDate?: string;
  repairContent?: string;
  partsReplaced?: string;
  repairCost?: number;
  notes?: string;
  Device?: { name?: string };
}

interface AssignFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  order: RepairOrder | null;
}

const AssignForm: React.FC<AssignFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  order,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      getUsers({ roleId: 3 }).then((res) => {
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
      title={`分配工单 - ${order?.Device?.name ?? order?.equipmentName ?? ''}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          分配
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="assignedTo"
          label="分配给"
          rules={[{ required: true, message: '请选择维修人员' }]}
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
      </Form>
    </Modal>
  );
};

export default AssignForm;
