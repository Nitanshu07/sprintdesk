import { beforeEach, describe, expect, it } from 'vitest';
import { useBoardStore, useNotificationStore } from '../stores';
import type { Task } from '../types';
const task: Task = { id: 1, title: 'Test task', description: '', status: 'backlog', priority: 'high', assigneeId: 1, dueDate: '2026-08-28', sprintId: 3, order: 1, createdAt: '', updatedAt: '', completedAt: null };
describe('board store', () => { beforeEach(() => useBoardStore.setState({ tasks: [task], hydrated: true, previous: null })); it('adds a task', () => { useBoardStore.getState().addTask({ title: 'New', priority: 'low', assigneeId: 2, dueDate: '2026-08-29' }); expect(useBoardStore.getState().tasks).toHaveLength(2); }); it('moves and can undo a task', () => { useBoardStore.getState().moveTask(1, 'done'); expect(useBoardStore.getState().tasks[0].status).toBe('done'); useBoardStore.getState().undo(); expect(useBoardStore.getState().tasks[0].status).toBe('backlog'); }); it('deletes a task', () => { useBoardStore.getState().deleteTask(1); expect(useBoardStore.getState().tasks).toHaveLength(0); }); });

describe('notification store', () => {
  it('merges mock notifications with already-polled items without duplicates', () => {
    useNotificationStore.setState({ items: [{ id: 1001, title: 'Polled', message: 'Remote post', type: 'poll', read: false, createdAt: '2026-08-20T00:00:00Z' }] });
    const initial = [{ id: 101, title: 'Task assigned', message: 'Mock notification', type: 'task', read: false, createdAt: '2026-08-19T00:00:00Z' }];
    useNotificationStore.getState().initialize(initial);
    useNotificationStore.getState().initialize(initial);
    expect(useNotificationStore.getState().items.map((item) => item.id)).toEqual([1001, 101]);
  });
});
