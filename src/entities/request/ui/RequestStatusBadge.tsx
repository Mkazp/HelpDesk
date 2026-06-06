import { Badge, type BadgeVariant } from '../../../shared/ui/badge';
import type { RequestStatus } from '..';
import { formatRequestStatus } from '../../../shared/lib';

export interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const variantByStatus: Record<RequestStatus, BadgeVariant> = {
  new: 'primary',
  in_progress: 'warning',
  pending: 'neutral',
  completed: 'success',
  overdue: 'danger',
  rejected: 'neutral',
};

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  return <Badge variant={variantByStatus[status]}>{formatRequestStatus(status)}</Badge>;
}
