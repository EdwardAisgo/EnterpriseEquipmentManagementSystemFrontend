import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';

const { TextArea } = Input;

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

interface RepairFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  order: RepairOrder | null;
}

const RepairForm: React.FC<RepairFormProps> = ({ visible, onCancel, onSubmit, order }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={`处理工单 - ${order?.Device?.name ?? order?.equipmentName ?? ''}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          完成维修
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="repairContent"
          label="维修内容"
          rules={[{ required: true, message: '请输入维修内容' }]}
        >
          <TextArea rows={4} placeholder="请详细描述维修内容" />
        </Form.Item>
        <Form.Item
          name="partsReplaced"
          label="更换的备件"
        >
          <Input placeholder="请输入更换的备件" />
        </Form.Item>
        <Form.Item
          name="repairCost"
          label="维修费用"
          rules={[{ required: true, message: '请输入维修费用' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入维修费用" />
        </Form.Item>
        <Form.Item
          name="notes"
          label="备注"
        >
          <TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RepairForm;
