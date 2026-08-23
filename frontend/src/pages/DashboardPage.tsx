import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, CircleDashed, Clock3, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { getMockData } from '../services';
import { statusLabels, useBoardStore } from '../stores';

export default function DashboardPage() {
  const tasks = useBoardStore((state) => state.tasks);
  const { data } = useQuery({ queryKey: ['mock-data'], queryFn: getMockData });
  const done = tasks.filter((task) => task.status === 'done').length;
  const review = tasks.filter((task) => task.status === 'review').length;
  const urgent = tasks.filter((task) => task.priority === 'high' && task.status !== 'done').length;
  const velocity = (data?.sprints || []).map((sprint) => ({ name: sprint.name.replace('Sprint ', 'S'), tasks: (data?.tasks || []).filter((task) => task.sprintId === sprint.id && task.status === 'done').length }));
  return <section className="content-page"><div className="welcome-heading"><div><span className="eyebrow">SPRINTS 1-3 · JUL 20-AUG 28</span><h1>Good afternoon, Emily.</h1><p>Here’s how work is progressing across the full assignment dataset.</p></div><Link className="primary button-link" to="/board">Open sprint board <ArrowRight size={14} /></Link></div>
    <div className="metric-grid"><article><span className="metric-icon violet"><ListTodo /></span><div><small>Total tasks</small><strong>{tasks.length}</strong><em>across 3 sprints</em></div></article><article><span className="metric-icon green"><CheckCircle2 /></span><div><small>Completed</small><strong>{done}</strong><em>{tasks.length ? Math.round(done/tasks.length*100) : 0}% of all work</em></div></article><article><span className="metric-icon blue"><CircleDashed /></span><div><small>In review</small><strong>{review}</strong><em>waiting for feedback</em></div></article><article><span className="metric-icon red"><Clock3 /></span><div><small>High priority</small><strong>{urgent}</strong><em>open tasks</em></div></article></div>
    <div className="dashboard-grid"><article className="panel focus-panel"><header><div><span className="eyebrow">TODAY’S FOCUS</span><h2>Work that needs attention</h2></div><Link to="/board">View all</Link></header><div className="focus-list">{tasks.filter((task) => task.status !== 'done').slice(0, 5).map((task) => <div key={task.id}><span className={`priority ${task.priority}`}>{task.priority}</span><div><strong>{task.title}</strong><small>{statusLabels[task.status]} · Due {new Date(task.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small></div><img src={data?.users.find((user) => user.id === task.assigneeId)?.avatar} alt="" /></div>)}</div></article><article className="panel velocity-panel"><header><div><span className="eyebrow">VELOCITY</span><h2>Completed by sprint</h2></div></header><ResponsiveContainer width="100%" height={220}><BarChart data={velocity}><XAxis dataKey="name" axisLine={false} tickLine={false} /><Tooltip cursor={{fill:'#f2f0ff'}} /><Bar dataKey="tasks" fill="#6657e8" radius={[7,7,0,0]} /></BarChart></ResponsiveContainer></article></div>
  </section>;
}
