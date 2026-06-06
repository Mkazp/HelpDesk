import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartPoint } from '../../shared/api/mock';
import styles from './RequestsStatusChart.module.css';

export interface RequestsStatusChartProps {
  data: ChartPoint[];
}

const colors = ['#2563eb', '#0f766e', '#ca8a04', '#16a34a', '#dc2626', '#64748b'];

export function RequestsStatusChart({ data }: RequestsStatusChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.label,
  }));

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Распределение по статусам</h3>
        <p className={styles.subtitle}>Текущее состояние обработки обращений.</p>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={60} outerRadius={95} paddingAngle={4}>
              {chartData.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
