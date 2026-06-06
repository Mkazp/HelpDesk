import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../../widgets/layout';
import { DashboardPage } from '../../pages/dashboard';
import { CitizensPage } from '../../pages/citizens';
import { CitizenDetailsPage } from '../../pages/citizen-details';
import { PlaceholderPage } from '../../pages/placeholder';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/citizens" element={<CitizensPage />} />
        <Route path="/citizens/:id" element={<CitizenDetailsPage />} />
        <Route
          path="/requests"
          element={
            <PlaceholderPage
              title="Обращения"
              description="Раздел с обращениями подготовлен как заглушка для дальнейшего развития."
            />
          }
        />
        <Route
          path="/reports"
          element={
            <PlaceholderPage
              title="Отчёты"
              description="Раздел отчётов можно подключить позже без изменения каркаса приложения."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Настройки"
              description="Настройки будут добавлены поверх этой архитектуры."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
