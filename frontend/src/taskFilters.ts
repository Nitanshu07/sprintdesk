import type { Task } from './types';

type TaskFilters = {
  priority: string;
  assignee: string;
  query: string;
};

export function filterTasks(tasks: Task[], { priority, assignee, query }: TaskFilters) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return tasks.filter((task) => {
    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesAssignee = assignee === 'all' || task.assigneeId === Number(assignee);
    const searchableText = `${task.title} ${task.description}`.toLocaleLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesPriority && matchesAssignee && matchesQuery;
  });
}
