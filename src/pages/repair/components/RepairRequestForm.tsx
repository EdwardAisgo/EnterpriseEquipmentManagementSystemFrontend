import { Button, Form, Input, Select, Modal, Upload, DatePicker } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import React from 'react';

const { TextArea } = Input;
const { Option } = Select;

interface RepairRequestFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  devices: any[];
}

const RepairRequestForm: React.FC<RepairRequestFormProps> = ({ visible, onCancel, onSubmit, devices }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Modal
      title="提交报修申请"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          提交
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="equipmentId"
          label="选择设备"
          rules={[{ required: true, message: '请选择设备' }]}
        >
          <Select placeholder="请选择设备">
            {devices.map((device) => (
              <Option key={device.id} value={device.id}>
                {device.deviceCode} - {device.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="reporter"
          label="报修人"
          rules={[{ required: true, message: '请输入报修人' }]}
        >
          <Input placeholder="请输入报修人" />
        </Form.Item>
        <Form.Item
          name="reportDate"
          label="报修日期"
          rules={[{ required: true, message: '请选择报修日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="faultDescription"
          label="故障描述"
          rules={[{ required: true, message: '请输入故障描述' }]}
        >
          <TextArea rows={4} placeholder="请详细描述故障情况" />
        </Form.Item>
        <Form.Item
          name="images"
          label="故障图片"
        >
          <Upload {...uploadProps} listType="picture-card">
            <div>
              <FileImageOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RepairRequestForm;
