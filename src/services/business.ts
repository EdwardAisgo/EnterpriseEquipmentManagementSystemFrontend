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
