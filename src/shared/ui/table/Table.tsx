import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib';
import styles from './Table.module.css';

export interface TableProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  compact?: boolean;
}

export function Table({ children, className, compact = false, ...props }: TableProps) {
  return (
    <div className={cn(styles.tableShell, compact && styles.compact, className)} {...props}>
      {children}
    </div>
  );
}
