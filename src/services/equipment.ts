import { request } from '@umijs/max';

export async function getDevices(params?: any) {
  return request('/api/device', {
    method: 'GET',
    params,
  });
}

export async function createDevice(data: any) {
  return request('/api/device', {
    method: 'POST',
    data,
  });
}

export async function updateDevice(id: string | number, data: any) {
  return request(`/api/device/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDevice(id: string | number) {
  return request(`/api/device/${id}`, {
    method: 'DELETE',
  });
}

export async function scrapDevice(id: string | number, scrapReason: string) {
  return request(`/api/device/${id}/scrap`, {
    method: 'PUT',
    data: { scrapReason },
  });
}
