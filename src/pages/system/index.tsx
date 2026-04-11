import {
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  PlusOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Input,
  Modal,
  message,
  Select,
  Space,
  Tabs,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '@/services/business';
import RoleForm from './components/RoleForm';
import UserForm from './components/UserForm';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
};

type Log = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
};

const SystemManagement: React.FC = () => {
  const [userVisible, setUserVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.users || []);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 模拟角色数据
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '管理员',
      description: '系统管理员，拥有所有权限',
      permissions: [
        '设备管理',
        '运行监控',
        '维护保养',
        '故障维修',
        '数据统计',
        '系统管理',
      ],
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      name: '普通员工',
      description: '普通员工，只能查看设备信息和提交报修申请',
      permissions: ['设备管理', '故障维修'],
      createdAt: '2023-01-01',
    },
    {
      id: '3',
      name: '维修人员',
      description: '维修人员，负责设备维护和故障维修',
      permissions: ['运行监控', '维护保养', '故障维修'],
      createdAt: '2023-01-01',
    },
  ]);

  // 模拟日志数据
  const [logs, setLogs] = useState<Log[]>([
    {
      id: '1',
      user: 'admin',
      action: '登录',
      target: '系统',
      timestamp: '2023-07-01 10:00:00',
      ip: '192.168.1.1',
    },
    {
      id: '2',
      user: 'user1',
      action: '提交报修申请',
      target: '设备EQ001',
      timestamp: '2023-07-01 11:00:00',
      ip: '192.168.1.2',
    },
    {
      id: '3',
      user: 'admin',
      action: '分配工单',
      target: '工单1',
      timestamp: '2023-07-01 12:00:00',
      ip: '192.168.1.1',
    },
  ]);

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
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag
          color={
            role === 'admin' ? 'red' : role === 'manager' ? 'blue' : 'green'
          }
        >
          {role === 'admin' ? '管理员' : role === 'manager' ? '经理' : '员工'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
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

  const roleColumns: ProColumns<Role>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: any) => {
        const permissionList: string[] = Array.isArray(permissions)
          ? permissions
          : [];
        return (
          <div>
            {permissionList.map((permission) => (
              <span key={permission} className="tag">
                {permission}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentRole(record);
              setRoleVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              // 确认删除
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除角色 ${record.name} 吗？`,
                onOk: () => {
                  setRoles(roles.filter((role) => role.id !== record.id));
                  message.success('角色删除成功');
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

  const logColumns: ProColumns<Log>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '目标',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
  ];

  const handleAddUser = async (values: any) => {
    try {
      await createUser(values);
      message.success('用户创建成功');
      setUserVisible(false);
      fetchUsers();
    } catch (error: any) {
      const data = error?.data || error?.response?.data;
      const errorMessage =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors[0]?.msg : null) ||
        error?.message ||
        '用户创建失败';
      message.error(errorMessage);
    }
  };

  const handleUpdateUser = async (values: any) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, values);
      message.success('用户更新成功');
      setUserVisible(false);
      fetchUsers();
    } catch (error: any) {
      const data = error?.data || error?.response?.data;
      const errorMessage =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors[0]?.msg : null) ||
        error?.message ||
        '用户更新失败';
      message.error(errorMessage);
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

  const handleAddRole = (values: any) => {
    const newRole: Role = {
      id: String(roles.length + 1),
      ...values,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRoles([...roles, newRole]);
    setRoleVisible(false);
    message.success('角色创建成功');
  };

  const handleUpdateRole = (values: any) => {
    if (!currentRole) return;
    const updatedRoles = roles.map((role) =>
      role.id === currentRole.id
        ? {
            ...role,
            ...values,
          }
        : role,
    );
    setRoles(updatedRoles);
    setRoleVisible(false);
    message.success('角色更新成功');
  };

  const handleBackup = () => {
    message.success('数据备份成功');
  };

  const handleRestore = () => {
    message.success('数据恢复成功');
  };

  return (
    <div>
      <Card title="系统管理">
        <Tabs defaultActiveKey="users">
          <TabPane
            tab={
              <>
                <UserOutlined /> 用户管理
              </>
            }
            key="users"
          >
            <div
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setCurrentUser(null);
                  setUserVisible(true);
                }}
              >
                新增用户
              </Button>
            </div>
            <ProTable<User>
              columns={userColumns}
              dataSource={users}
              loading={loading}
              rowKey="id"
              search={false}
              options={false}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab={
              <>
                <TeamOutlined /> 角色管理
              </>
            }
            key="roles"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCurrentRole(null);
                    setRoleVisible(true);
                  }}
                >
                  新增角色
                </Button>
              }
            >
              <ProTable
                columns={roleColumns}
                dataSource={roles}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                search={{
                  labelWidth: 'auto',
                }}
              />
            </Card>
          </TabPane>
          <TabPane
            tab={
              <>
                <LockOutlined /> 权限管理
              </>
            }
            key="permissions"
          >
            <Card>
              <p>权限管理功能正在开发中...</p>
            </Card>
          </TabPane>
          <TabPane
            tab={
              <>
                <LogoutOutlined /> 日志管理
              </>
            }
            key="logs"
          >
            <Card>
              <ProTable
                columns={logColumns}
                dataSource={logs}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                search={{
                  labelWidth: 'auto',
                }}
              />
            </Card>
          </TabPane>
          <TabPane
            tab={
              <>
                <DatabaseOutlined /> 数据备份
              </>
            }
            key="backup"
          >
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleBackup}
                >
                  备份数据
                </Button>
                <Button icon={<UploadOutlined />} onClick={handleRestore}>
                  恢复数据
                </Button>
              </Space>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <UserForm
        visible={userVisible}
        onCancel={() => setUserVisible(false)}
        onSubmit={currentUser ? handleUpdateUser : handleAddUser}
        user={currentUser}
      />

      <RoleForm
        visible={roleVisible}
        onCancel={() => setRoleVisible(false)}
        onSubmit={currentRole ? handleUpdateRole : handleAddRole}
        role={currentRole}
      />
    </div>
  );
};

export default SystemManagement;
