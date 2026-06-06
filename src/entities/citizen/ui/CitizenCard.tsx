import type { Citizen } from '..';
import { Badge } from '../../../shared/ui/badge';
import { Button } from '../../../shared/ui/button';
import { formatCitizenFamilyStatus, formatDate, formatNumber } from '../../../shared/lib';
import styles from './CitizenCard.module.css';

export interface CitizenCardProps {
  citizen: Citizen;
  onOpenDetails?: () => void;
  onEdit?: () => void;
}

export function CitizenCard({ citizen, onOpenDetails, onEdit }: CitizenCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{citizen.fullName}</h3>
          <p className={styles.subtitle}>
            {citizen.city}, {citizen.region}
          </p>
        </div>
        <Badge variant="primary">{formatCitizenFamilyStatus(citizen.familyStatus)}</Badge>
      </div>

      <div className={styles.meta}>
        <div>
          <span>Телефон</span>
          <strong>{citizen.phone}</strong>
        </div>
        <div>
          <span>Обращения</span>
          <strong>{formatNumber(citizen.requests.length)}</strong>
        </div>
        <div>
          <span>Обновлено</span>
          <strong>{formatDate(citizen.updatedAt)}</strong>
        </div>
      </div>

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
    </article>
  );
}
