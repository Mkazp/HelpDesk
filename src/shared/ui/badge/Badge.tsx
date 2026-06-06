import type { HTMLAttributes } from 'react';
import { cn } from '../../lib';
import styles from './Badge.module.css';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'primary';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)} {...props} />;
}
