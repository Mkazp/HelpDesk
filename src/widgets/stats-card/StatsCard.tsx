import { Badge } from '../../shared/ui/badge';
import { cn, formatNumber } from '../../shared/lib';
import styles from './StatsCard.module.css';

export interface StatsCardProps {
  label: string;
  value: number | string;
  delta?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  caption?: string;
}

export function StatsCard({ label, value, delta, tone = 'neutral', caption }: StatsCardProps) {
  return (
    <article className={cn(styles.card, styles[tone])}>
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        {delta ? <Badge variant={tone === 'neutral' ? 'primary' : tone}>{delta}</Badge> : null}
      </div>
      <div className={styles.value}>{typeof value === 'number' ? formatNumber(value) : value}</div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </article>
  );
}
