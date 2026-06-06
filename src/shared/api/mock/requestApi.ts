import type { Request, RequestListFilters, RequestStatus } from '../../../entities/request';
import type { PaginatedResult } from './filters';
import { requestJson } from '../http';

export async function getRequests(params: RequestListFilters = {}): Promise<PaginatedResult<Request>> {
  return requestJson<PaginatedResult<Request>>('/api/requests', { params });
}

export async function getRequestById(id: string): Promise<Request | null> {
  return requestJson<Request | null>(`/api/requests/${id}`);
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<Request | null> {
  return requestJson<Request | null>(`/api/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
