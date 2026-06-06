import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getCitizenById, getRequestById, updateCitizen, updateRequestStatus } from '../../shared/api/mock';
import { CitizenForm } from '../../features/citizen-form';
import { Modal } from '../../shared/ui/modal';
import { Tabs } from '../../shared/ui/tabs';
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { CitizenProfile } from '../../widgets/citizen-profile';
import { RequestPriorityBadge, RequestStatusBadge } from '../../entities/request';
import { RequestStatusUpdate } from '../../features/request-status-update';
import {
  formatCitizenEducationLevel,
  formatCitizenFamilyStatus,
  formatCitizenSocialStatus,
  formatDate,
  formatDateTime,
  formatNumber,
} from '../../shared/lib';
import type { Request } from '../../entities/request';
import styles from './CitizenDetailsPage.module.css';

const tabValues = [
  'overview',
  'contacts',
  'documents',
  'requests',
  'family',
  'education',
  'employment',
  'history',
] as const;

type TabValue = (typeof tabValues)[number];

export function CitizenDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState<Request | null>(null);

  const citizenQuery = useQuery({
    queryKey: ['citizen', id],
    queryFn: () => (id ? getCitizenById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });

  const requestsQuery = useQuery({
    queryKey: ['citizen-requests', id, citizenQuery.data?.requests],
    queryFn: async () => {
      if (!citizenQuery.data) {
        return [] as Request[];
      }

      const results = await Promise.all(citizenQuery.data.requests.map((requestId) => getRequestById(requestId)));
      return results.filter((request): request is Request => Boolean(request));
    },
    enabled: Boolean(citizenQuery.data),
  });

  useEffect(() => {
    if (citizenQuery.error || (!citizenQuery.isLoading && !citizenQuery.data)) {
      navigate('/citizens');
    }
  }, [citizenQuery.data, citizenQuery.error, citizenQuery.isLoading, navigate]);

  const updateCitizenMutation = useMutation({
    mutationFn: async (values: Parameters<typeof updateCitizen>[1]) => {
      if (!id) {
        throw new Error('Citizen id is missing');
      }
      return updateCitizen(id, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['citizen', id] });
      await queryClient.invalidateQueries({ queryKey: ['citizens'] });
      setEditOpen(false);
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: Request['status'] }) =>
      updateRequestStatus(requestId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['citizen-requests', id] });
      setUpdatingRequest(null);
    },
  });

  const tabs = useMemo(
    () => [
      {
        value: 'overview',
        label: 'Обзор',
        content: citizenQuery.data ? (
          <div className={styles.overview}>
            <CitizenProfile citizen={citizenQuery.data} onEdit={() => setEditOpen(true)} />
            <div className={styles.statsRow}>
              <div className={styles.miniCard}>
                <span>Всего обращений</span>
                <strong>{formatNumber(requestsQuery.data?.length ?? 0)}</strong>
              </div>
              <div className={styles.miniCard}>
                <span>Члены семьи</span>
                <strong>{formatNumber(citizenQuery.data.familyMembers.length)}</strong>
              </div>
              <div className={styles.miniCard}>
                <span>Документы</span>
                <strong>{formatNumber(citizenQuery.data.documents.length)}</strong>
              </div>
            </div>
          </div>
        ) : null,
      },
      {
        value: 'contacts',
        label: 'Контакты',
        content: citizenQuery.data ? (
          <div className={styles.panelGrid}>
            <div className={styles.detailCard}>
              <h3>Личные контакты</h3>
              <p>{citizenQuery.data.phone}</p>
              <p>{citizenQuery.data.email}</p>
            </div>
            <div className={styles.detailCard}>
              <h3>Адрес проживания</h3>
              <p>{citizenQuery.data.region}</p>
              <p>
                {citizenQuery.data.city}, {citizenQuery.data.address}
              </p>
            </div>
          </div>
        ) : null,
      },
      {
        value: 'documents',
        label: 'Документы',
        content: citizenQuery.data ? (
          <div className={styles.listGrid}>
            {citizenQuery.data.documents.map((document) => (
              <article key={document.id} className={styles.itemCard}>
                <div className={styles.itemTop}>
                  <h3>{document.type}</h3>
                  <Badge variant="neutral">{document.number}</Badge>
                </div>
                <p>Выдан: {document.issuer}</p>
                <p>Дата выдачи: {formatDate(document.issuedAt)}</p>
                <p>Действителен до: {formatDate(document.expiresAt)}</p>
              </article>
            ))}
          </div>
        ) : null,
      },
      {
        value: 'requests',
        label: 'Обращения',
        content: (
          <div className={styles.listGrid}>
            {requestsQuery.data?.map((request) => (
              <article key={request.id} className={styles.itemCard}>
                <div className={styles.itemTop}>
                  <div>
                    <h3>{request.number}</h3>
                    <p>{request.title}</p>
                  </div>
                  <div className={styles.badges}>
                    <RequestStatusBadge status={request.status} />
                    <RequestPriorityBadge priority={request.priority} />
                  </div>
                </div>
                <p>{request.description}</p>
                <div className={styles.metaRow}>
                  <span>Создано: {formatDateTime(request.createdAt)}</span>
                  <span>Срок: {formatDate(request.dueDate)}</span>
                  <span>Ответственный: {request.responsibleEmployee}</span>
                </div>
                <div className={styles.requestActions}>
                  <Button variant="secondary" size="sm" onClick={() => setUpdatingRequest(request)}>
                    Обновить статус
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ),
      },
      {
        value: 'family',
        label: 'Семья',
        content: citizenQuery.data ? (
          <div className={styles.listGrid}>
            {citizenQuery.data.familyMembers.map((member) => (
              <article key={member.id} className={styles.itemCard}>
                <h3>{member.fullName}</h3>
                <p>{member.relation}</p>
                <p>Дата рождения: {formatDate(member.birthDate)}</p>
                <p>Возраст: {member.age}</p>
              </article>
            ))}
          </div>
        ) : null,
      },
      {
        value: 'education',
        label: 'Образование',
        content: citizenQuery.data ? (
          <div className={styles.listGrid}>
            {citizenQuery.data.educationHistory.map((record) => (
              <article key={record.id} className={styles.itemCard}>
                <h3>{record.institution}</h3>
                <p>{record.degree}</p>
                <p>
                  {formatDate(record.startDate)} - {record.endDate ? formatDate(record.endDate) : 'по настоящее время'}
                </p>
              </article>
            ))}
          </div>
        ) : null,
      },
      {
        value: 'employment',
        label: 'Занятость',
        content: citizenQuery.data ? (
          <div className={styles.listGrid}>
            {citizenQuery.data.employmentHistory.map((record) => (
              <article key={record.id} className={styles.itemCard}>
                <h3>{record.organization}</h3>
                <p>{record.position}</p>
                <p>
                  {formatDate(record.startDate)} - {record.endDate ? formatDate(record.endDate) : 'по настоящее время'}
                </p>
              </article>
            ))}
          </div>
        ) : null,
      },
      {
        value: 'history',
        label: 'История',
        content: citizenQuery.data ? (
          <div className={styles.listGrid}>
            <article className={styles.itemCard}>
              <h3>Хронология записи</h3>
              <p>Создано: {formatDateTime(citizenQuery.data.createdAt)}</p>
              <p>Обновлено: {formatDateTime(citizenQuery.data.updatedAt)}</p>
              <p>Социальный статус: {formatCitizenSocialStatus(citizenQuery.data.socialStatus)}</p>
              <p>Уровень образования: {formatCitizenEducationLevel(citizenQuery.data.educationLevel)}</p>
              <p>Семейный статус: {formatCitizenFamilyStatus(citizenQuery.data.familyStatus)}</p>
            </article>
          </div>
        ) : null,
      },
    ],
    [citizenQuery.data, requestsQuery.data],
  );

  if (citizenQuery.isLoading) {
    return <div className={styles.loading}>Загрузка профиля гражданина...</div>;
  }

  if (!citizenQuery.data) {
    return null;
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerCard}>
        <div>
          <p className={styles.kicker}>Профиль гражданина</p>
          <h2 className={styles.title}>{citizenQuery.data.fullName}</h2>
          <p className={styles.description}>
            {citizenQuery.data.city}, {citizenQuery.data.region}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => navigate('/citizens')}>
            Назад к таблице
          </Button>
          <Button onClick={() => setEditOpen(true)}>Редактировать гражданина</Button>
        </div>
      </div>

      <Tabs items={tabs} value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} />

      <Modal
        open={editOpen}
        title="Редактирование гражданина"
        description="Измените карточку гражданина и сохраните текущие связи."
        onClose={() => setEditOpen(false)}
      >
        <CitizenForm
          citizen={citizenQuery.data}
          submitLabel="Сохранить гражданина"
          onSubmit={async (values) => {
            await updateCitizenMutation.mutateAsync(values);
          }}
        />
      </Modal>

      <Modal
        open={Boolean(updatingRequest)}
        title="Обновление статуса обращения"
        description={updatingRequest ? `${updatingRequest.number} · ${updatingRequest.title}` : undefined}
        onClose={() => setUpdatingRequest(null)}
      >
        {updatingRequest ? (
          <RequestStatusUpdate
            currentStatus={updatingRequest.status}
            onSubmit={async (status) => {
              await updateRequestMutation.mutateAsync({ requestId: updatingRequest.id, status });
            }}
          />
        ) : null}
      </Modal>
    </section>
  );
}
