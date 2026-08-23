import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { restoreSession } from './services';
import { useAuthStore } from './stores';
import { AppShell } from './components/AppShell';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

function Protected({ children }: { children: React.ReactNode }) {
  const { user, checking } = useAuthStore();
  if (checking) return <div className="screen-loader"><span className="logo-mark">SD</span><div className="spinner" /><p>Restoring your workspace…</p></div>;
  return user ? children : <Navigate to="/login" replace />;
}

export function App() {
  const { setUser, setChecking } = useAuthStore();
  useEffect(() => {
    restoreSession().then((user) => user && setUser({ name: `${user.firstName} ${user.lastName}`, image: user.image, username: user.username })).catch(() => localStorage.removeItem('sprintdesk-refresh-token')).finally(() => setChecking(false));
  }, [setChecking, setUser]);
  return <Suspense fallback={<div className="screen-loader"><div className="spinner" /><p>Loading SprintDesk…</p></div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Protected><AppShell /></Protected>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/board" replace />} />
    </Routes>
  </Suspense>;
}
