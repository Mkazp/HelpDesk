import type { Citizen } from '..';
import { Badge } from '../../../shared/ui/badge';
import { formatDate } from '../../../shared/lib';
import styles from './CitizenShortInfo.module.css';

export interface CitizenShortInfoProps {
  citizen: Citizen;
}

export function CitizenShortInfo({ citizen }: CitizenShortInfoProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <h4 className={styles.title}>{citizen.fullName}</h4>
          <p className={styles.subtitle}>
            {citizen.city}, {citizen.region}
          </p>
        </div>
        <Badge variant="primary">{citizen.id}</Badge>
      </div>

      <dl className={styles.list}>
        <div>
          <dt>Дата рождения</dt>
          <dd>{formatDate(citizen.birthDate)}</dd>
        </div>
        <div>
          <dt>Телефон</dt>
          <dd>{citizen.phone}</dd>
        </div>
        <div>
          <dt>Электронная почта</dt>
          <dd>{citizen.email}</dd>
        </div>
      </dl>
    </article>
  );
}
