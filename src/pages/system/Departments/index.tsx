import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '@/services/business';
import DepartmentForm from '../components/DepartmentForm';

type Department = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

const DepartmentManagement: React.FC = () => {
  const [deptVisible, setDeptVisible] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = async (params?: any) => {
    setLoading(true);
    try {
      const res = await getDepartments(params);
      setDepartments(res.departments || []);
    } catch (error) {
      message.error('获取部门列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDeptSubmit = async (values: any) => {
    try {
      if (currentDept) {
        await updateDepartment(currentDept.id, values);
        message.success('更新部门成功');
      } else {
        await createDepartment(values);
        message.success('新增部门成功');
      }
      setDeptVisible(false);
      fetchDepartments();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const deptColumns: ProColumns<Department>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentDept(record);
              setDeptVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确定要删除该部门吗？',
                onOk: async () => {
                  try {
                    await deleteDepartment(record.id);
                    message.success('删除成功');
                    fetchDepartments();
                  } catch (error: any) {
                    message.error(error.message || '删除失败');
                  }
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<Department>
        columns={deptColumns}
        dataSource={departments}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentDept(null);
              setDeptVisible(true);
            }}
          >
            新增部门
          </Button>,
        ]}
        onSubmit={(params) => fetchDepartments(params)}
        onReset={() => fetchDepartments()}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <DepartmentForm
        visible={deptVisible}
        onCancel={() => setDeptVisible(false)}
        onSubmit={handleDeptSubmit}
        department={currentDept}
      />
    </PageContainer>
  );
};

export default DepartmentManagement;
