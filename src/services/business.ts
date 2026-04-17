import { request } from '@umijs/max';

// Maintenance Records
export async function getMaintenances(params?: any) {
  return request('/api/maintenance', {
    method: 'GET',
    params,
  });
}

export async function createMaintenance(data: any) {
  return request('/api/maintenance', {
    method: 'POST',
    data,
  });
}

export async function updateMaintenance(id: string | number, data: any) {
  return request(`/api/maintenance/${id}`, {
    method: 'PUT',
    data,
  });
}

// Maintenance Plans
export async function getMaintenancePlans(params?: any) {
  return request('/api/maintenance-plans', {
    method: 'GET',
    params,
  });
}

export async function createMaintenancePlan(data: any) {
  return request('/api/maintenance-plans', {
    method: 'POST',
    data,
  });
}

export async function updateMaintenancePlan(id: string | number, data: any) {
  return request(`/api/maintenance-plans/${id}`, {
    method: 'PUT',
    data,
  });
}

// Repair Orders
export async function getRepairOrders(params?: any) {
  return request('/api/repair-orders', {
    method: 'GET',
    params,
  });
}

export async function createRepairOrder(data: any) {
  return request('/api/repair-orders', {
    method: 'POST',
    data,
  });
}

export async function updateRepairOrder(id: string | number, data: any) {
  return request(`/api/repair-orders/${id}`, {
    method: 'PUT',
    data,
  });
}

// Running Data
export async function getRunningData(params?: any) {
  return request('/api/running-data', {
    method: 'GET',
    params,
  });
}

export async function createRunningData(data: any) {
  return request('/api/running-data', {
    method: 'POST',
    data,
  });
}

// Users
export async function getUsers(params?: any) {
  return request('/api/users', {
    method: 'GET',
    params,
  });
}

export async function createUser(data: any) {
  return request('/api/users/register', {
    method: 'POST',
    data,
  });
}

export async function updateUser(id: string | number, data: any) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteUser(id: string | number) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

/** 修改个人密码 PUT /api/users/me/password */
export async function changePassword(data: API.ChangePasswordParams) {
  return request('/api/users/me/password', {
    method: 'PUT',
    data,
  });
}

/** 管理员重置密码 PUT /api/users/:id/reset-password */
export async function resetPassword(id: string | number, data: { newPassword: string }) {
  return request(`/api/users/${id}/reset-password`, {
    method: 'PUT',
    data,
  });
}

// Departments
export async function getDepartments(params?: any) {
  return request('/api/departments', {
    method: 'GET',
    params,
  });
}

export async function createDepartment(data: any) {
  return request('/api/departments', {
    method: 'POST',
    data,
  });
}

export async function updateDepartment(id: string | number, data: any) {
  return request(`/api/departments/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDepartment(id: string | number) {
  return request(`/api/departments/${id}`, {
    method: 'DELETE',
  });
}

// Roles
export async function getRoles(params?: any) {
  return request('/api/roles', {
    method: 'GET',
    params,
  });
}

export async function createRole(data: any) {
  return request('/api/roles', {
    method: 'POST',
    data,
  });
}

export async function updateRole(id: string | number, data: any) {
  return request(`/api/roles/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteRole(id: string | number) {
  return request(`/api/roles/${id}`, {
    method: 'DELETE',
  });
}

// Backup & Restore
export async function getBackups() {
  return request('/api/backup', {
    method: 'GET',
  });
}

export async function createBackup() {
  return request('/api/backup/create', {
    method: 'POST',
  });
}

export async function restoreBackup(fileName: string) {
  return request('/api/backup/restore', {
    method: 'POST',
    data: { fileName },
  });
}

export async function deleteBackup(fileName: string) {
  return request(`/api/backup/${fileName}`, {
    method: 'DELETE',
  });
}
