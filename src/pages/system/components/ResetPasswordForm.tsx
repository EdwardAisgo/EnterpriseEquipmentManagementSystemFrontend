import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

interface ResetPasswordFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { newPassword: string }) => void;
  username: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  username,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values as { newPassword: string });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={`重置用户 [${username}] 的密码`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认重置
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少 6 位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordForm;
