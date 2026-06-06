import type { ReactNode } from 'react';
import { cn } from '../../lib';
import styles from './Tabs.module.css';

export interface TabsItem {
  value: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabsItem[];
  value: string;
  onValueChange: (value: string) => void;
}

export function Tabs({ items, value, onValueChange }: TabsProps) {
  const activeItem = items.find((item) => item.value === value) ?? items[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.list} role="tablist" aria-label="Content sections">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            className={cn(styles.tab, item.value === value && styles.active)}
            role="tab"
            aria-selected={item.value === value}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.panel}>{activeItem?.content}</div>
    </div>
  );
}
