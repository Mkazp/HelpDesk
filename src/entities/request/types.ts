export type RequestStatus = 'new' | 'in_progress' | 'pending' | 'completed' | 'overdue' | 'rejected';
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';
export type RequestCategory =
  | 'waste_management'
  | 'ecology'
  | 'infrastructure'
  | 'complaint'
  | 'consultation'
  | 'other';

export interface Request {
  id: string;
  number: string;
  citizenId: string;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  priority: RequestPriority;
  source: string;
  region: string;
  responsibleEmployee: string;
  createdAt: string;
  dueDate: string;
  updatedAt: string;
  attachmentsCount: number;
  commentsCount: number;
}

export interface RequestListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RequestStatus | string;
  region?: string;
  category?: RequestCategory | string;
  priority?: RequestPriority | string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: keyof Request;
  sortOrder?: 'asc' | 'desc';
}

export interface RequestStatusUpdateInput {
  status: RequestStatus;
}
