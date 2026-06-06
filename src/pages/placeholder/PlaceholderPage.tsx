import { Button } from '../../shared/ui/button';
import styles from './PlaceholderPage.module.css';

export interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Скоро</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <Button variant="secondary">Маршрут готов к дальнейшему расширению</Button>
      </div>
    </section>
  );
}
