import { request } from '@umijs/max';

export type OperationLog = {
  id: number;
  userId?: number | null;
  username?: string | null;
  displayName?: string | null;
  name?: string | null;
  roleName?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  entityName?: string | null;
  details?: any;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

export async function getLogs(params: any) {
  return request<{
    data: OperationLog[];
    total: number;
    success: boolean;
    current: number;
    pageSize: number;
  }>('/api/logs', {
    method: 'GET',
    params,
  });
}
