import { request } from '@umijs/max';

/** 获取设备状态统计 GET /api/report/device-status */
export async function getDeviceStatusReport() {
  return request('/api/report/device-status', {
    method: 'GET',
  });
}

/** 获取部门设备统计 GET /api/report/department-devices */
export async function getDepartmentDeviceReport() {
  return request('/api/report/department-devices', {
    method: 'GET',
  });
}

/** 获取维护类型统计 GET /api/report/maintenance-type */
export async function getMaintenanceTypeReport() {
  return request('/api/report/maintenance-type', {
    method: 'GET',
  });
}

/** 获取年度维护成本统计 GET /api/report/maintenance-cost/:year */
export async function getMaintenanceCostReport(year: number | string) {
  return request(`/api/report/maintenance-cost/${year}`, {
    method: 'GET',
  });
}

/** 获取即将到期的设备质保 GET /api/report/warranty-expiring */
export async function getWarrantyExpiringReport() {
  return request('/api/report/warranty-expiring', {
    method: 'GET',
  });
}
