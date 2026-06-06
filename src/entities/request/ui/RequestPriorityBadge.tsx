import { Badge, type BadgeVariant } from '../../../shared/ui/badge';
import type { RequestPriority } from '..';
import { formatRequestPriority } from '../../../shared/lib';

export interface RequestPriorityBadgeProps {
  priority: RequestPriority;
}

const variantByPriority: Record<RequestPriority, BadgeVariant> = {
  low: 'neutral',
  medium: 'primary',
  high: 'warning',
  critical: 'danger',
};

export function RequestPriorityBadge({ priority }: RequestPriorityBadgeProps) {
  return <Badge variant={variantByPriority[priority]}>{formatRequestPriority(priority)}</Badge>;
}
