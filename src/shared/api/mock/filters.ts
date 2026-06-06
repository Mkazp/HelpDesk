export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

export function paginate<T>(items: T[], page = 1, pageSize = 20): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  return {
    data: items.slice(start, start + safePageSize),
    total: items.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

export function sortByKey<T extends object>(items: T[], sortBy?: keyof T, sortOrder: 'asc' | 'desc' = 'desc') {
  if (!sortBy) {
    return items;
  }

  return [...items].sort((left, right) => {
    const a = (left as Record<string, unknown>)[String(sortBy)];
    const b = (right as Record<string, unknown>)[String(sortBy)];
    const leftValue = typeof a === 'string' || typeof a === 'number' ? a : String(a ?? '');
    const rightValue = typeof b === 'string' || typeof b === 'number' ? b : String(b ?? '');

    if (leftValue === rightValue) {
      return 0;
    }

    const direction = sortOrder === 'asc' ? 1 : -1;
    return leftValue > rightValue ? direction : -direction;
  });
}
