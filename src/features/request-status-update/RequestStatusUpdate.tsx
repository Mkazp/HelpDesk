import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Select } from '../../shared/ui/select';
import type { RequestStatus } from '../../entities/request';
import styles from './RequestStatusUpdate.module.css';

export interface RequestStatusUpdateProps {
  currentStatus: RequestStatus;
  onSubmit: (status: RequestStatus) => Promise<void> | void;
}

const statusOptions: Array<{ label: string; value: RequestStatus }> = [
  { label: 'Новая', value: 'new' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Ожидает', value: 'pending' },
  { label: 'Завершено', value: 'completed' },
  { label: 'Просрочено', value: 'overdue' },
  { label: 'Отклонено', value: 'rejected' },
];

export function RequestStatusUpdate({ currentStatus, onSubmit }: RequestStatusUpdateProps) {
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.card}>
      <Select label="Статус" value={status} options={statusOptions} onChange={(event) => setStatus(event.target.value as RequestStatus)} />
      <Button
        loading={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await onSubmit(status);
          } finally {
            setLoading(false);
          }
        }}
      >
        Обновить статус
      </Button>
    </div>
  );
}
