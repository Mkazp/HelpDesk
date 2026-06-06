import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../shared/config';
import { Button } from '../../shared/ui/button';
import { cn } from '../../shared/lib';
import { useUiStore } from '../../app/model';
import styles from './Sidebar.module.css';

const collapseBreakpoint = 960;

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(`(max-width: ${collapseBreakpoint}px)`).matches;
}

export function Sidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);

  const handleToggleSidebar = () => {
    if (isMobileViewport()) {
      setSidebarOpen(false);
      return;
    }

    toggleSidebarCollapsed();
  };

  return (
    <>
      <aside className={cn(styles.sidebar, sidebarOpen && styles.open, sidebarCollapsed && styles.collapsed)}>
        <div className={styles.toggleRow}>
          <div className={styles.brand}>
            <div className={styles.brandText}>
              <div className={styles.brandName}>Реестр обращений</div>
              <div className={styles.brandCaption}>Каркас корпоративного dashboard-приложения</div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className={styles.toggleButton}
            aria-label={sidebarCollapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
            onClick={handleToggleSidebar}
          >
            <span className={styles.toggleIcon}>{sidebarCollapsed ? '›' : '‹'}</span>
          </Button>
        </div>

        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(styles.link, isActive && styles.active)}
              title={item.label}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.linkBadge}>{item.label.charAt(0)}</span>
              <span className={styles.linkLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <footer className={styles.footer}>
          <p className={styles.footerNote}>Тестовое задание · интерфейс с тестовыми данными</p>
        </footer>
      </aside>
      {sidebarOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Закрыть боковую панель"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </>
  );
}
