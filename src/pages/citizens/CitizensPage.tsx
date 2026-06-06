import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCitizens, updateCitizen } from '../../shared/api/mock';
import { CitizenCard, CitizenShortInfo } from '../../entities/citizen';
import { CitizenFilters, type CitizenFiltersValue } from '../../features/citizen-filters';
import { CitizenSearch } from '../../features/citizen-search';
import { CitizenForm } from '../../features/citizen-form';
import { Modal } from '../../shared/ui/modal';
import { CitizenTable } from '../../widgets/citizen-table';
import { regions } from '../../shared/api/mock/constants';
import { useDebouncedValue, formatNumber } from '../../shared/lib';
import { useUiStore } from '../../app/model';
import type { Citizen, CitizenUpdateInput } from '../../entities/citizen';
import styles from './CitizensPage.module.css';

const initialFilters: CitizenFiltersValue = {
  region: '',
  status: '',
  category: '',
  priority: '',
  createdFrom: '',
  createdTo: '',
};

export function CitizensPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedCitizenId = useUiStore((state) => state.selectedCitizenId);
  const setSelectedCitizenId = useUiStore((state) => state.setSelectedCitizenId);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Citizen>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editCitizen, setEditCitizen] = useState<Citizen | null>(null);
  const debouncedSearch = useDebouncedValue(search, 250);

  const query = useQuery({
    queryKey: ['citizens', page, debouncedSearch, filters, sortBy, sortOrder],
    queryFn: () =>
      getCitizens({
        page,
        pageSize: 12,
        search: debouncedSearch,
        status: filters.status,
        region: filters.region,
        category: filters.category,
        priority: filters.priority,
        createdFrom: filters.createdFrom || undefined,
        createdTo: filters.createdTo || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const selectedCitizen = useMemo(
    () => query.data?.data.find((citizen) => citizen.id === selectedCitizenId) ?? query.data?.data[0] ?? null,
    [query.data?.data, selectedCitizenId],
  );

  useEffect(() => {
    if (!selectedCitizen && query.data?.data[0]) {
      setSelectedCitizenId(query.data.data[0].id);
    }
  }, [query.data?.data, selectedCitizen, setSelectedCitizenId]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CitizenUpdateInput }) => updateCitizen(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['citizens'] });
      setEditCitizen(null);
    },
  });

  const handleSortChange = (column: keyof Citizen) => {
    if (sortBy === column) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      setPage(1);
      return;
    }

    setSortBy(column);
    setSortOrder('desc');
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFiltersChange = (value: CitizenFiltersValue) => {
    setFilters(value);
    setPage(1);
  };

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Реестр граждан</p>
          <h2 className={styles.title}>Карточки граждан и связанных обращений</h2>
        </div>
        <div className={styles.countBox}>
          <span className={styles.countLabel}>Найдено записей</span>
          <strong className={styles.countValue}>{formatNumber(query.data?.total ?? 0)}</strong>
        </div>
      </div>

      <div className={styles.controls}>
        <CitizenSearch value={search} onChange={handleSearchChange} />
        <CitizenFilters
          value={filters}
          regions={regions}
          onChange={handleFiltersChange}
          onReset={() => {
            setFilters(initialFilters);
            setPage(1);
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.tableColumn}>
          <CitizenTable
            data={query.data?.data ?? []}
            total={query.data?.total ?? 0}
            page={query.data?.page ?? page}
            pageSize={query.data?.pageSize ?? 12}
            loading={query.isLoading}
            selectedCitizenId={selectedCitizen?.id ?? null}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onPageChange={setPage}
            onSelectCitizen={(citizen) => setSelectedCitizenId(citizen.id)}
            onOpenDetails={(citizenId) => navigate(`/citizens/${citizenId}`)}
          />
        </div>

        <aside className={styles.sideColumn}>
          {selectedCitizen ? (
            <>
              <CitizenCard
                citizen={selectedCitizen}
                onOpenDetails={() => navigate(`/citizens/${selectedCitizen.id}`)}
                onEdit={() => setEditCitizen(selectedCitizen)}
              />
              <CitizenShortInfo citizen={selectedCitizen} />
            </>
          ) : (
            <div className={styles.emptyState}>Выберите строку, чтобы посмотреть краткую карточку гражданина.</div>
          )}
        </aside>
      </div>

      <Modal
        open={Boolean(editCitizen)}
        title="Редактирование гражданина"
        description="Обновите персональные данные и сохраните текущие связи."
        onClose={() => setEditCitizen(null)}
      >
        {editCitizen ? (
          <CitizenForm
            citizen={editCitizen}
            submitLabel="Сохранить гражданина"
            onSubmit={async (values) => {
              await updateMutation.mutateAsync({ id: editCitizen.id, data: values });
            }}
          />
        ) : null}
      </Modal>
    </section>
  );
}
