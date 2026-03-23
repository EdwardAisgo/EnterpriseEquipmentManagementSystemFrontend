import { Button, Form, Select, Modal } from 'antd';
import React from 'react';

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

const AssignForm: React.FC<AssignFormProps> = ({ visible, onCancel, onSubmit, order }) => {
  const [form] = Form.useForm();

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
          <Select placeholder="请选择维修人员">
            <Option value="张三">张三</Option>
            <Option value="李四">李四</Option>
            <Option value="王五">王五</Option>
            <Option value="孙七">孙七</Option>
            <Option value="吴九">吴九</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignForm;
