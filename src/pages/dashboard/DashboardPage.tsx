import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getRequestsByCategory,
  getRequestsByStatus,
  getRequestsChartData,
  getRequests,
} from '../../shared/api/mock';
import { StatsCard } from '../../widgets/stats-card';
import { RequestsCategoryChart, RequestsStatusChart, RequestsTrendChart } from '../../widgets/charts';
import { Table } from '../../shared/ui/table';
import { RequestPriorityBadge, RequestStatusBadge } from '../../entities/request';
import { formatDate, formatRequestCategory } from '../../shared/lib';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const statsQuery = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: getDashboardStats });
  const trendQuery = useQuery({ queryKey: ['dashboard', 'trend'], queryFn: getRequestsChartData });
  const statusQuery = useQuery({ queryKey: ['dashboard', 'status'], queryFn: getRequestsByStatus });
  const categoryQuery = useQuery({ queryKey: ['dashboard', 'category'], queryFn: getRequestsByCategory });
  const recentRequestsQuery = useQuery({
    queryKey: ['dashboard', 'recent-requests'],
    queryFn: () => getRequests({ page: 1, pageSize: 8, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  return (
    <section className={styles.page}>
      <div className={styles.statsGrid}>
        <StatsCard label="Граждане" value={statsQuery.data?.totalCitizens ?? 0} tone="primary" caption="Всего записей в реестре" />
        <StatsCard label="Обращения" value={statsQuery.data?.totalRequests ?? 0} tone="neutral" caption="Все обращения в очереди" />
        <StatsCard label="Открытые" value={statsQuery.data?.openRequests ?? 0} tone="warning" caption="Новые, в работе, ожидающие и просроченные" />
        <StatsCard label="Завершённые" value={statsQuery.data?.completedRequests ?? 0} tone="success" caption="Обращения, закрытые успешно" />
        <StatsCard label="Просроченные" value={statsQuery.data?.overdueRequests ?? 0} tone="danger" caption="Обращения, требующие внимания" />
      </div>

      <div className={styles.chartsGrid}>
        <RequestsTrendChart data={trendQuery.data ?? []} />
        <RequestsStatusChart data={statusQuery.data ?? []} />
      </div>

      <div className={styles.bottomGrid}>
        <RequestsCategoryChart data={categoryQuery.data ?? []} />

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Последние обращения</h3>
              <p className={styles.sectionSubtitle}>Самая свежая активность в очереди тестовых обращений.</p>
            </div>
          </div>

          <Table compact>
            <table className={styles.recentTable}>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Ответственный</th>
                  <th>Статус</th>
                  <th>Приоритет</th>
                  <th>Создано</th>
                </tr>
              </thead>
              <tbody>
                {(recentRequestsQuery.data?.data ?? []).map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className={styles.primary}>{request.number}</div>
                      <div className={styles.secondary}>{formatRequestCategory(request.category)}</div>
                    </td>
                    <td>{request.responsibleEmployee}</td>
                    <td>
                      <RequestStatusBadge status={request.status} />
                    </td>
                    <td>
                      <RequestPriorityBadge priority={request.priority} />
                    </td>
                    <td>{formatDate(request.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        </section>
      </div>
    </section>
  );
}
