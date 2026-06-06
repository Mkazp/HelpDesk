import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import type { Citizen } from '../../entities/citizen';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Table } from '../../shared/ui/table';
import { formatCitizenEmploymentStatus, formatDate, formatNumber, cn } from '../../shared/lib';
import styles from './CitizenTable.module.css';

export interface CitizenTableProps {
  data: Citizen[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  selectedCitizenId?: string | null;
  sortBy?: keyof Citizen;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (column: keyof Citizen) => void;
  onPageChange: (page: number) => void;
  onSelectCitizen: (citizen: Citizen) => void;
  onOpenDetails: (citizenId: string) => void;
}

function SortIndicator({
  active,
  order,
}: {
  active: boolean;
  order?: 'asc' | 'desc';
}) {
  return <span className={cn(styles.sortIndicator, active && styles.activeSort)}>{active ? (order === 'asc' ? '↑' : '↓') : '↕'}</span>;
}

export function CitizenTable({
  data,
  total,
  page,
  pageSize,
  loading,
  selectedCitizenId,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onSelectCitizen,
  onOpenDetails,
}: CitizenTableProps) {
  const columns: Array<ColumnDef<Citizen>> = [
    {
      accessorKey: 'fullName',
      header: () => (
        <button type="button" className={styles.headerButton} onClick={() => onSortChange('fullName')}>
          Гражданин <SortIndicator active={sortBy === 'fullName'} order={sortBy === 'fullName' ? sortOrder : undefined} />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className={styles.primaryCell}>{row.original.fullName}</div>
          <div className={styles.secondaryCell}>{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'region',
      header: () => (
        <button type="button" className={styles.headerButton} onClick={() => onSortChange('region')}>
          Регион <SortIndicator active={sortBy === 'region'} order={sortBy === 'region' ? sortOrder : undefined} />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className={styles.primaryCell}>{row.original.region}</div>
          <div className={styles.secondaryCell}>{row.original.city}</div>
        </div>
      ),
    },
    {
      accessorKey: 'employmentStatus',
      header: 'Статус',
      cell: ({ row }) => <Badge variant="primary">{formatCitizenEmploymentStatus(row.original.employmentStatus)}</Badge>,
    },
    {
      accessorKey: 'age',
      header: () => (
        <button type="button" className={styles.headerButton} onClick={() => onSortChange('age')}>
          Возраст <SortIndicator active={sortBy === 'age'} order={sortBy === 'age' ? sortOrder : undefined} />
        </button>
      ),
      cell: ({ row }) => row.original.age,
    },
    {
      accessorKey: 'requests',
      header: 'Обращения',
      cell: ({ row }) => formatNumber(row.original.requests.length),
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <button type="button" className={styles.headerButton} onClick={() => onSortChange('updatedAt')}>
          Обновлено <SortIndicator active={sortBy === 'updatedAt'} order={sortBy === 'updatedAt' ? sortOrder : undefined} />
        </button>
      ),
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={() => onSelectCitizen(row.original)}>
            Выбрать
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onOpenDetails(row.original.id)}>
            Открыть
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={styles.wrapper}>
      <Table>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.loading}>Загрузка граждан...</div>
                </td>
              </tr>
            ) : null}
            {!loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.empty}>По текущим фильтрам граждан не найдено.</div>
                </td>
              </tr>
            ) : null}
            {!loading
              ? table.getRowModel().rows.map((row) => {
                  const isSelected = row.original.id === selectedCitizenId;
                  return (
                    <tr
                      key={row.id}
                      className={cn(styles.row, isSelected && styles.selected)}
                      onClick={() => onSelectCitizen(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </Table>

      <div className={styles.footer}>
        <div className={styles.summary}>
          Страница {page} из {totalPages} · {formatNumber(total)} записей
        </div>
        <div className={styles.pagination}>
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Назад
          </Button>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Вперёд
          </Button>
        </div>
      </div>
    </div>
  );
}
