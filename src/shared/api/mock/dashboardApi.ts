import type { RequestCategory, RequestStatus } from '../../../entities/request';
import { requestJson } from '../http';

export interface DashboardStats {
  totalCitizens: number;
  totalRequests: number;
  openRequests: number;
  completedRequests: number;
  overdueRequests: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return requestJson<DashboardStats>('/api/dashboard/stats');
}

export async function getRequestsChartData(): Promise<ChartPoint[]> {
  return requestJson<ChartPoint[]>('/api/dashboard/requests-chart');
}

export async function getRequestsByStatus(): Promise<ChartPoint[]> {
  return requestJson<ChartPoint[]>('/api/dashboard/requests-by-status');
}

export async function getRequestsByCategory(): Promise<ChartPoint[]> {
  return requestJson<ChartPoint[]>('/api/dashboard/requests-by-category');
}
