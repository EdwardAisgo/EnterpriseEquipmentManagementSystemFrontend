import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createUser,
  deleteUser,
  getDepartments,
  getRoles,
  getUsers,
  resetPassword,
  updateUser,
} from '@/services/business';
import ResetPasswordForm from '../components/ResetPasswordForm';
import UserForm from '../components/UserForm';

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

const UserManagement: React.FC = () => {
  const [userVisible, setUserVisible] = useState(false);
  const [resetPwdVisible, setResetPwdVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const fetchUsers = async (params?: any) => {
    setLoading(true);
    try {
      const res = await getUsers(params);
      setUsers(res.users || []);
    } catch (_error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.departments || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.roles || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleUserSubmit = async (values: any) => {
    try {
      if (currentUser) {
        await updateUser(currentUser.id, values);
        message.success('更新用户成功');
      } else {
        await createUser(values);
        message.success('新增用户成功');
      }
      setUserVisible(false);
      fetchUsers();
    } catch (error: any) {
      const data = error?.data || error?.response?.data;
      const errorMessage =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors[0]?.msg : null) ||
        error?.message ||
        '操作失败';
      message.error(errorMessage);
    }
  };

  const handleResetPassword = async (values: { newPassword: string }) => {
    if (!currentUser) return;
    try {
      await resetPassword(currentUser.id, values);
      message.success('密码重置成功');
      setResetPwdVisible(false);
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || '密码重置失败');
    }
  };

  const handleDeleteUser = async (record: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${record.username} 吗？`,
      onOk: async () => {
        try {
          await deleteUser(record.id);
          message.success('删除成功');
          fetchUsers();
        } catch (error: any) {
          const data = error?.data || error?.response?.data;
          const errorMessage = data?.message || error?.message || '删除失败';
          message.error(errorMessage);
        }
      },
    });
  };

  const userColumns: ProColumns<User>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      search: false,
    },
    {
      title: '角色',
      dataIndex: ['Role', 'name'],
      key: 'roleId',
      render: (_, record: any) => record.Role?.name || '-',
      valueType: 'select',
      fieldProps: {
        options: roles.map((d) => ({ label: d.name, value: d.id })),
      },
    },
    {
      title: '部门',
      dataIndex: ['Department', 'name'],
      key: 'departmentId',
      render: (_, record: any) => record.Department?.name || '-',
      valueType: 'select',
      fieldProps: {
        options: departments.map((d) => ({ label: d.name, value: d.id })),
      },
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
              setCurrentUser(record);
              setUserVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<LockOutlined />}
            onClick={() => {
              setCurrentUser(record);
              setResetPwdVisible(true);
            }}
          >
            重置密码
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<User>
        columns={userColumns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentUser(null);
              setUserVisible(true);
            }}
          >
            新增用户
          </Button>,
        ]}
        onSubmit={(params) => fetchUsers(params)}
        onReset={() => fetchUsers()}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <UserForm
        visible={userVisible}
        onCancel={() => setUserVisible(false)}
        onSubmit={handleUserSubmit}
        user={currentUser}
      />

      <ResetPasswordForm
        visible={resetPwdVisible}
        onCancel={() => setResetPwdVisible(false)}
        onSubmit={handleResetPassword}
        username={currentUser?.username || ''}
      />
    </PageContainer>
  );
};

export default UserManagement;
