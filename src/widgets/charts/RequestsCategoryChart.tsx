import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../../shared/api/mock';
import styles from './RequestsCategoryChart.module.css';

export interface RequestsCategoryChartProps {
  data: ChartPoint[];
}

export function RequestsCategoryChart({ data }: RequestsCategoryChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.label,
  }));

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Распределение по категориям</h3>
        <p className={styles.subtitle}>Структура обращений по тематике.</p>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e6edf5" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
