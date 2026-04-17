import { request } from '@umijs/max';

export type MenuItem = {
  id: string;
  name: string;
  path: string;
  icon?: string | null;
  parentId?: string | null;
  hideInMenu?: boolean;
  children?: MenuItem[];
};

export async function getMyMenus() {
  return request<{ menus: MenuItem[] }>('/api/menus/me', {
    method: 'GET',
  });
}

export async function getAllMenus() {
  return request<{ menus: MenuItem[] }>('/api/menus/all', {
    method: 'GET',
  });
}

export async function syncMenus(menus: MenuItem[]) {
  return request<{ success: boolean; count: number }>('/api/menus/sync', {
    method: 'POST',
    data: { menus },
  });
}

