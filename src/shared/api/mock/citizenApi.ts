import type { Citizen, CitizenListFilters, CitizenUpdateInput } from '../../../entities/citizen';
import type { PaginatedResult } from './filters';
import { requestJson } from '../http';

export async function getCitizens(params: CitizenListFilters = {}): Promise<PaginatedResult<Citizen>> {
  return requestJson<PaginatedResult<Citizen>>('/api/citizens', { params });
}

export async function getCitizenById(id: string): Promise<Citizen | null> {
  return requestJson<Citizen | null>(`/api/citizens/${id}`);
}

export async function updateCitizen(id: string, data: CitizenUpdateInput): Promise<Citizen | null> {
  return requestJson<Citizen | null>(`/api/citizens/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
