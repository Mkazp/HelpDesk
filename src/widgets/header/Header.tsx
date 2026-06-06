import { useLocation } from 'react-router-dom';
import { Button } from '../../shared/ui/button';
import { useUiStore } from '../../app/model';
import styles from './Header.module.css';

const titleByPath: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Панель управления',
    subtitle: 'Оперативный обзор граждан, обращений и загрузки системы.',
  },
  '/citizens': {
    title: 'Реестр граждан',
    subtitle: 'Структурированные записи с быстрым поиском, фильтрами и действиями по строке.',
  },
  '/requests': {
    title: 'Обращения',
    subtitle: 'Очередь и зона обработки сервисных обращений.',
  },
  '/reports': {
    title: 'Отчёты',
    subtitle: 'Будущий слой аналитики и экспорта данных.',
  },
  '/settings': {
    title: 'Настройки',
    subtitle: 'Конфигурация приложения и рабочего пространства.',
  },
};

export function Header() {
  const location = useLocation();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  const entry =
    titleByPath[location.pathname] ??
    (location.pathname.startsWith('/citizens/')
      ? {
          title: 'Профиль гражданина',
          subtitle: 'Детальная карточка с активностью и связанными обращениями.',
        }
      : titleByPath['/dashboard']);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Button variant="secondary" size="sm" className={styles.menuButton} onClick={toggleSidebar}>
          Меню
        </Button>
        <div>
          <h1 className={styles.title}>{entry.title}</h1>
          <p className={styles.subtitle}>{entry.subtitle}</p>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaChip}>Тестовые данные</span>
      </div>
    </header>
  );
}
