export interface NavigationItem {
  label: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Панель', path: '/dashboard' },
  { label: 'Граждане', path: '/citizens' },
  { label: 'Обращения', path: '/requests' },
  { label: 'Отчёты', path: '/reports' },
  { label: 'Настройки', path: '/settings' },
];
