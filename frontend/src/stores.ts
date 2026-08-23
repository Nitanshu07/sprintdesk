import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, Priority, Status, Task } from './types';

interface BoardState {
  tasks: Task[]; hydrated: boolean; previous: Task[] | null;
  initialize: (tasks: Task[]) => void;
  addTask: (input: Pick<Task, 'title' | 'priority' | 'assigneeId' | 'dueDate'>) => void;
  updateTask: (id: number, patch: Partial<Task>) => void;
  moveTask: (id: number, status: Status, overId?: number) => void;
  deleteTask: (id: number) => void;
  undo: () => void;
  resetBoard: (tasks: Task[]) => void;
}

export const useBoardStore = create<BoardState>()(persist((set) => ({
  tasks: [], hydrated: false, previous: null,
  initialize: (tasks) => set((state) => state.hydrated ? state : { tasks, hydrated: true }),
  addTask: (input) => set((state) => ({ tasks: [...state.tasks, { ...input, id: Date.now(), description: '', status: 'backlog', sprintId: 3, order: state.tasks.filter(t => t.status === 'backlog').length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), completedAt: null }] })),
  updateTask: (id, patch) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task) })),
  moveTask: (id, status, overId) => set((state) => {
    const previous = state.tasks;
    const moving = state.tasks.find((task) => task.id === id);
    if (!moving) return state;
    const remaining = state.tasks.filter((task) => task.id !== id);
    const index = overId ? remaining.findIndex((task) => task.id === overId) : -1;
    const moved = { ...moving, status, completedAt: status === 'done' ? new Date().toISOString() : null };
    if (index >= 0) remaining.splice(index, 0, moved); else remaining.push(moved);
    return { tasks: remaining.map((task, order) => ({ ...task, order })), previous };
  }),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  undo: () => set((state) => state.previous ? { tasks: state.previous, previous: null } : state),
  resetBoard: (tasks) => set({ tasks, hydrated: true, previous: null }),
}), { name: 'sprintdesk-board', partialize: ({ tasks, hydrated }) => ({ tasks, hydrated }) }));

interface NotificationState {
  items: Notification[]; initialize: (items: Notification[]) => void; addPosts: (posts: Array<{ id: number; title: string; body: string }>) => number;
  markRead: (id: number) => void; markAllRead: () => void;
}
export const useNotificationStore = create<NotificationState>()(persist((set, get) => ({
  items: [], initialize: (items) => set((state) => {
    const existingIds = new Set(state.items.map((item) => item.id));
    const merged = [...state.items, ...items.filter((item) => !existingIds.has(item.id))]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { items: merged };
  }),
  addPosts: (posts) => {
    const known = new Set(get().items.map((item) => item.id));
    const fresh = posts.filter((post) => !known.has(1000 + post.id)).map((post) => ({ id: 1000 + post.id, title: 'Workspace update', message: post.title, type: 'poll', read: false, createdAt: new Date().toISOString() }));
    if (fresh.length) set((state) => ({ items: [...fresh, ...state.items].slice(0, 100) }));
    return fresh.length;
  },
  markRead: (id) => set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, read: true } : item) })),
  markAllRead: () => set((state) => ({ items: state.items.map((item) => ({ ...item, read: true })) })),
}), { name: 'sprintdesk-notifications' }));

export const statusLabels: Record<Status, string> = { backlog: 'Backlog', 'in-progress': 'In progress', review: 'Review', done: 'Done' };
export const statuses = Object.keys(statusLabels) as Status[];
export const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

interface AuthState {
  user: { name: string; image?: string; username?: string } | null;
  checking: boolean;
  setUser: (user: AuthState['user']) => void;
  setChecking: (checking: boolean) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null, checking: true,
  setUser: (user) => set({ user }),
  setChecking: (checking) => set({ checking }),
  logout: () => { localStorage.removeItem('sprintdesk-refresh-token'); set({ user: null }); },
}));
