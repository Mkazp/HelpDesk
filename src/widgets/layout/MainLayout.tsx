import { Outlet } from 'react-router-dom';
import { useUiStore } from '../../app/model';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { cn } from '../../shared/lib';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <div className={cn(styles.layout, sidebarCollapsed && styles.collapsed)}>
      <Sidebar />
      <div className={styles.shell}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
