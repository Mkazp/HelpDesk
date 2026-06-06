import type { Citizen } from '../../entities/citizen';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { formatCitizenEmploymentStatus, formatDate, formatNumber } from '../../shared/lib';
import styles from './CitizenProfile.module.css';

export interface CitizenProfileProps {
  citizen: Citizen;
  onOpenDetails?: () => void;
  onEdit?: () => void;
}

export function CitizenProfile({ citizen, onOpenDetails, onEdit }: CitizenProfileProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{citizen.fullName}</h3>
          <p className={styles.subtitle}>
            {citizen.city}, {citizen.region}
          </p>
        </div>
        <Badge variant="primary">{formatCitizenEmploymentStatus(citizen.employmentStatus)}</Badge>
      </div>

      <dl className={styles.list}>
        <div>
          <dt>Возраст</dt>
          <dd>{citizen.age}</dd>
        </div>
        <div>
          <dt>Обращения</dt>
          <dd>{formatNumber(citizen.requests.length)}</dd>
        </div>
        <div>
          <dt>Обновлено</dt>
          <dd>{formatDate(citizen.updatedAt)}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        {onEdit ? (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Редактировать
          </Button>
        ) : null}
        {onOpenDetails ? (
          <Button size="sm" onClick={onOpenDetails}>
            Открыть профиль
          </Button>
        ) : null}
      </div>
    </section>
  );
}
