import { describe, expect, it } from 'vitest';
import { filterTasks } from '../taskFilters';
import type { Task } from '../types';

const tasks: Task[] = [
  { id: 1, title: 'Build Kanban board', description: 'Create sprint columns', status: 'in-progress', priority: 'high', assigneeId: 2, dueDate: '2026-08-22', sprintId: 3, order: 1, createdAt: '', updatedAt: '', completedAt: null },
  { id: 2, title: 'Add task filtering', description: 'Filter by priority and assignee', status: 'backlog', priority: 'low', assigneeId: 1, dueDate: '2026-08-27', sprintId: 3, order: 1, createdAt: '', updatedAt: '', completedAt: null },
];

describe('task filtering', () => {
  it('searches task titles and descriptions case-insensitively', () => {
    expect(filterTasks(tasks, { priority: 'all', assignee: 'all', query: 'KANBAN' }).map((task) => task.id)).toEqual([1]);
    expect(filterTasks(tasks, { priority: 'all', assignee: 'all', query: 'priority' }).map((task) => task.id)).toEqual([2]);
  });

  it('combines search with priority and assignee filters', () => {
    expect(filterTasks(tasks, { priority: 'high', assignee: '2', query: 'board' }).map((task) => task.id)).toEqual([1]);
    expect(filterTasks(tasks, { priority: 'low', assignee: '2', query: 'board' })).toEqual([]);
  });
});
