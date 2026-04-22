import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from '@/services/business';
import { getAllMenus } from '@/services/menu';
import RoleForm from '../components/RoleForm';

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
};

const RoleManagement: React.FC = () => {
  const [roleVisible, setRoleVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [menuNameMap, setMenuNameMap] = useState<Record<string, string>>({});

  const fetchRoles = async (params?: any) => {
    setLoading(true);
    try {
      const res = await getRoles(params);
      setRoles(res.roles || []);
    } catch (_error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getAllMenus();
        const menuTree = res.menus || [];
        setMenus(menuTree);
        const map: Record<string, string> = {};
        const walk = (nodes: any[]) => {
          (nodes || []).forEach((n) => {
            if (n?.id && n?.name) map[String(n.id)] = String(n.name);
            if (Array.isArray(n?.children)) walk(n.children);
          });
        };
        walk(menuTree);
        setMenuNameMap(map);
      } catch (error: any) {
        message.error(error?.data?.message || error?.message || '获取菜单失败');
      }
    };
    fetchMenus();
  }, []);

  const handleRoleSubmit = async (values: any) => {
    try {
      if (currentRole) {
        await updateRole(currentRole.id, values);
        message.success('更新角色成功');
      } else {
        await createRole(values);
        message.success('新增角色成功');
      }
      setRoleVisible(false);
      fetchRoles();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || '操作失败');
    }
  };

  const handleDeleteRole = async (record: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 ${record.name} 吗？`,
      onOk: async () => {
        try {
          await deleteRole(record.id);
          message.success('删除成功');
          fetchRoles();
        } catch (error: any) {
          message.error(error?.data?.message || error?.message || '删除失败');
        }
      },
    });
  };

  const roleColumns: ProColumns<Role>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      search: false,
      render: (permissions: any) => {
        const permissionList: string[] = Array.isArray(permissions)
          ? permissions
          : [];
        return (
          <Space size={[0, 8]} wrap>
            {permissionList.map((permission) => {
              const label = menuNameMap[permission] || permission;
              return (
                <Tag key={permission} color="blue">
                  {label}
                </Tag>
              );
            })}
          </Space>
        );
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
              setCurrentRole(record);
              setRoleVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<Role>
        columns={roleColumns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRole(null);
              setRoleVisible(true);
            }}
          >
            新增角色
          </Button>,
        ]}
        onSubmit={(params) => fetchRoles(params)}
        onReset={() => fetchRoles()}
        options={false}
        pagination={{ pageSize: 10 }}
      />

      <RoleForm
        visible={roleVisible}
        onCancel={() => setRoleVisible(false)}
        onSubmit={handleRoleSubmit}
        role={currentRole}
        menus={menus}
      />
    </PageContainer>
  );
};

export default RoleManagement;
