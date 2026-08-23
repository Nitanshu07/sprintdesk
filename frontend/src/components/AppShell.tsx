import { useEffect, useState } from 'react';
import { Bell, ChartNoAxesColumnIncreasing, LayoutDashboard, LogOut, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMockData } from '../services';
import { useAuthStore, useBoardStore, useNotificationStore } from '../stores';
import { useToast } from '../useToast';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useQuery({ queryKey: ['mock-data'], queryFn: getMockData });
  const initialize = useBoardStore((state) => state.initialize);
  const tasks = useBoardStore((state) => state.tasks);
  const initializeNotifications = useNotificationStore((state) => state.initialize);
  const items = useNotificationStore((state) => state.items);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const addPosts = useNotificationStore((state) => state.addPosts);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [panel, setPanel] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('sprintdesk-theme') || 'light');
  const toasts = useToast((state) => state.toasts); const showToast = useToast((state) => state.show); const dismissToast = useToast((state) => state.dismiss);
  useEffect(() => { if (data) { initialize(data.tasks.slice(0, 30)); initializeNotifications(data.notifications); } }, [data, initialize, initializeNotifications]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('sprintdesk-theme', theme); }, [theme]);
  useEffect(() => {
    let timer: number | undefined;
    const poll = async () => { if (document.hidden) return; try { const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5'); if (response.ok) { const count = addPosts(await response.json()); if (count && !panel) { const id = showToast(`${count} new workspace update${count > 1 ? 's' : ''}`); window.setTimeout(() => dismissToast(id), 4500); } } } catch { /* retry later */ } };
    const start = () => { window.clearInterval(timer); if (!document.hidden) { poll(); timer = window.setInterval(poll, 30_000); } };
    document.addEventListener('visibilitychange', start); start();
    return () => { document.removeEventListener('visibilitychange', start); window.clearInterval(timer); };
  }, [addPosts, dismissToast, panel, showToast]);
  const unread = items.filter((item) => !item.read).length;
  const done = tasks.filter((task) => task.status === 'done').length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const searchValue = location.pathname === '/board' ? new URLSearchParams(location.search).get('q') || '' : '';
  const searchTasks = (value: string) => {
    const params = new URLSearchParams(location.pathname === '/board' ? location.search : '');
    if (value) params.set('q', value); else params.delete('q');
    const search = params.toString();
    navigate({ pathname: '/board', search: search ? `?${search}` : '' }, { replace: true });
  };
  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard" aria-label="SprintDesk home"><span>SD</span><strong>SprintDesk</strong></NavLink>
      <nav aria-label="Primary navigation"><NavLink to="/dashboard"><LayoutDashboard size={18} /> Dashboard</NavLink><NavLink to="/board"><Sparkles size={18} /> Sprint board</NavLink><NavLink to="/analytics"><ChartNoAxesColumnIncreasing size={18} /> Analytics</NavLink></nav>
      <div className="sidebar-card"><span className="mini-label">Dataset coverage</span><strong>Sprints 1-3</strong><p>Jul 20 - Aug 28</p><div className="progress"><span style={{ width: `${completion}%` }} /></div><small>{done} of {tasks.length} tasks completed</small></div>
      <div className="profile"><img src={user?.image || 'https://i.pravatar.cc/150?img=47'} alt="" /><div><strong>{user?.name || 'Emily Johnson'}</strong><small>Workspace member</small></div></div>
    </aside>
    <main>
      <header className="topbar"><label className="search"><Search size={17} /><input aria-label="Search tasks" placeholder="Search tasks…" value={searchValue} onChange={(event) => searchTasks(event.target.value)} /></label><div className="header-actions"><button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="bell" aria-label={`${unread} unread notifications`} aria-expanded={panel} onClick={() => setPanel(!panel)}><Bell size={18} />{unread > 0 && <b>{unread > 9 ? '9+' : unread}</b>}</button><button className="avatar-button" onClick={() => { logout(); navigate('/login'); }} title="Log out"><img src={user?.image || 'https://i.pravatar.cc/150?img=47'} alt="" /><span>{user?.name?.split(' ')[0] || 'Emily'}</span><LogOut size={14} /></button></div></header>
      {panel && <aside className="notification-panel" aria-label="Notifications"><header><div><h2>Notifications</h2><span>{unread} unread</span></div><button onClick={markAllRead}>Mark all read</button></header><div>{items.slice(0, 20).map((item) => <button key={item.id} className={item.read ? '' : 'unread'} onClick={() => markRead(item.id)}><i /><span><strong>{item.title}</strong><small>{item.message}</small></span></button>)}</div></aside>}
      <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <button key={toast.id} onClick={() => dismissToast(toast.id)}>{toast.message}<span>Dismiss</span></button>)}</div>
      <Outlet />
    </main>
  </div>;
}
