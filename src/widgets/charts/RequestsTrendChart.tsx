import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '../../shared/api/mock';
import styles from './RequestsTrendChart.module.css';

export interface RequestsTrendChartProps {
  data: ChartPoint[];
}

export function RequestsTrendChart({ data }: RequestsTrendChartProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Динамика обращений</h3>
        <p className={styles.subtitle}>Недавний поток поступающих обращений.</p>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#e6edf5" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fill="url(#trendFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
