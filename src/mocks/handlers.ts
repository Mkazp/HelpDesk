import { HttpResponse, http } from 'msw';
import { mockDb } from '../shared/api/mock/db';
import { paginate, sortByKey, normalizeSearch } from '../shared/api/mock/filters';
import type { Citizen, CitizenUpdateInput } from '../entities/citizen';
import type { Request, RequestStatus } from '../entities/request';
import {
  formatRequestCategory,
  formatRequestPriority,
  formatRequestStatus,
} from '../shared/lib';

function matchesCitizenSearch(citizen: Citizen, search: string) {
  if (!search) {
    return true;
  }

  const haystack = [
    citizen.fullName,
    citizen.email,
    citizen.phone,
    citizen.documentNumber,
    citizen.city,
    citizen.region,
    ...citizen.requests,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(search);
}

function matchesRequestSearch(request: Request, search: string) {
  if (!search) {
    return true;
  }

  const haystack = [
    request.number,
    request.title,
    request.description,
    request.source,
    request.responsibleEmployee,
    request.region,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(search);
}

function monthLabel(offset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - offset);
  return new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
}

function matchesCitizenStatus(citizen: Citizen, status: string) {
  if (!status) {
    return true;
  }

  if (status === 'vulnerable') {
    return citizen.socialStatus === status;
  }

  return citizen.employmentStatus === status;
}

export const handlers = [
  http.get('/api/citizens', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20');
    const search = normalizeSearch(url.searchParams.get('search') ?? undefined);
    const status = url.searchParams.get('status') ?? '';
    const region = url.searchParams.get('region') ?? '';
    const category = url.searchParams.get('category') ?? '';
    const priority = url.searchParams.get('priority') ?? '';
    const createdFrom = url.searchParams.get('createdFrom') ?? '';
    const createdTo = url.searchParams.get('createdTo') ?? '';
    const sortBy = url.searchParams.get('sortBy') as keyof Citizen | undefined;
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc' | null) ?? 'desc';

    const filtered = mockDb.citizens.filter((citizen) => {
      const matchesStatus = matchesCitizenStatus(citizen, status);
      const matchesRegion = region ? citizen.region === region : true;
      const matchesCategory = category ? citizen.educationLevel === category : true;
      const matchesPriority = priority ? citizen.familyStatus === priority : true;
      const createdAt = new Date(citizen.createdAt).getTime();
      const matchesCreatedFrom = createdFrom ? createdAt >= new Date(createdFrom).getTime() : true;
      const matchesCreatedTo = createdTo ? createdAt <= new Date(createdTo).getTime() : true;

      return (
        matchesCitizenSearch(citizen, search) &&
        matchesStatus &&
        matchesRegion &&
        matchesCategory &&
        matchesPriority &&
        matchesCreatedFrom &&
        matchesCreatedTo
      );
    });

    const sorted = sortByKey(filtered, sortBy, sortOrder);
    return HttpResponse.json(paginate(sorted, page, pageSize));
  }),

  http.get('/api/citizens/:id', ({ params }) => {
    const citizen = mockDb.citizenById.get(String(params.id));
    return citizen ? HttpResponse.json(citizen) : HttpResponse.json(null, { status: 404 });
  }),

  http.put('/api/citizens/:id', async ({ params, request }) => {
    const body = (await request.json()) as CitizenUpdateInput;
    const citizen = mockDb.citizenById.get(String(params.id));

    if (!citizen) {
      return HttpResponse.json(null, { status: 404 });
    }

    Object.assign(citizen, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json(citizen);
  }),

  http.get('/api/requests', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20');
    const search = normalizeSearch(url.searchParams.get('search') ?? undefined);
    const status = url.searchParams.get('status') ?? '';
    const region = url.searchParams.get('region') ?? '';
    const category = url.searchParams.get('category') ?? '';
    const priority = url.searchParams.get('priority') ?? '';
    const createdFrom = url.searchParams.get('createdFrom') ?? '';
    const createdTo = url.searchParams.get('createdTo') ?? '';
    const sortBy = url.searchParams.get('sortBy') as keyof Request | undefined;
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc' | null) ?? 'desc';

    const filtered = mockDb.requests.filter((requestItem) => {
      const matchesStatus = status ? requestItem.status === status : true;
      const matchesRegion = region ? requestItem.region === region : true;
      const matchesCategory = category ? requestItem.category === category : true;
      const matchesPriority = priority ? requestItem.priority === priority : true;
      const createdAt = new Date(requestItem.createdAt).getTime();
      const matchesCreatedFrom = createdFrom ? createdAt >= new Date(createdFrom).getTime() : true;
      const matchesCreatedTo = createdTo ? createdAt <= new Date(createdTo).getTime() : true;

      return (
        matchesRequestSearch(requestItem, search) &&
        matchesStatus &&
        matchesRegion &&
        matchesCategory &&
        matchesPriority &&
        matchesCreatedFrom &&
        matchesCreatedTo
      );
    });

    const sorted = sortByKey(filtered, sortBy, sortOrder);
    return HttpResponse.json(paginate(sorted, page, pageSize));
  }),

  http.get('/api/requests/:id', ({ params }) => {
    const requestItem = mockDb.requestById.get(String(params.id));
    return requestItem ? HttpResponse.json(requestItem) : HttpResponse.json(null, { status: 404 });
  }),

  http.patch('/api/requests/:id/status', async ({ params, request }) => {
    const body = (await request.json()) as { status: RequestStatus };
    const requestItem = mockDb.requestById.get(String(params.id));

    if (!requestItem) {
      return HttpResponse.json(null, { status: 404 });
    }

    requestItem.status = body.status;
    requestItem.updatedAt = new Date().toISOString();
    return HttpResponse.json(requestItem);
  }),

  http.get('/api/dashboard/stats', () => {
    const totalRequests = mockDb.requests.length;
    const openRequests = mockDb.requests.filter((requestItem) =>
      ['new', 'in_progress', 'pending', 'overdue'].includes(requestItem.status),
    ).length;
    const completedRequests = mockDb.requests.filter((requestItem) => requestItem.status === 'completed').length;
    const overdueRequests = mockDb.requests.filter((requestItem) => requestItem.status === 'overdue').length;

    return HttpResponse.json({
      totalCitizens: mockDb.citizens.length,
      totalRequests,
      openRequests,
      completedRequests,
      overdueRequests,
    });
  }),

  http.get('/api/dashboard/requests-chart', () => {
    const buckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));

      return {
        key: monthKey(date),
        label: monthLabel(5 - index),
        value: 0,
      };
    });

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket] as const));

    mockDb.requests.forEach((requestItem) => {
      const bucket = bucketByKey.get(monthKey(new Date(requestItem.createdAt)));
      if (bucket) {
        bucket.value += 1;
      }
    });

    return HttpResponse.json(buckets.map(({ key: _key, ...bucket }) => bucket));
  }),

  http.get('/api/dashboard/requests-by-status', () => {
    const statusOrder: RequestStatus[] = ['new', 'in_progress', 'pending', 'completed', 'overdue', 'rejected'];
    return HttpResponse.json(
      statusOrder.map((status) => ({
        label: formatRequestStatus(status),
        value: mockDb.requests.filter((requestItem) => requestItem.status === status).length,
      })),
    );
  }),

  http.get('/api/dashboard/requests-by-category', () => {
    const categories = ['waste_management', 'ecology', 'infrastructure', 'complaint', 'consultation', 'other'];

    return HttpResponse.json(
      categories.map((category) => ({
        label: formatRequestCategory(category),
        value: mockDb.requests.filter((requestItem) => requestItem.category === category).length,
      })),
    );
  }),
];
