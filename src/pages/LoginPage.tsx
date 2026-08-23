import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginRequest } from '../services';
import { useAuthStore } from '../stores';

export default function LoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const checking = useAuthStore((state) => state.checking);
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { document.documentElement.dataset.theme = 'light'; }, []);
  if (!checking && user) return <Navigate to="/dashboard" replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try { const data = await loginRequest(username, password); if (!remember) sessionStorage.setItem('sprintdesk-session-only', 'true'); setUser({ name: `${data.firstName} ${data.lastName}`, image: data.image, username: data.username }); navigate('/dashboard'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); }
    finally { setLoading(false); }
  };
  return <main className="login-page">
    <section className="login-art"><div className="login-brand"><span>SD</span><strong>SprintDesk</strong></div><div className="art-copy"><span className="art-kicker">Make progress visible</span><h1>Plan clearly.<br />Ship confidently.</h1><p>A focused workspace for teams that want less status chasing and more meaningful progress.</p><div className="mini-board"><div><span>In progress</span><article><i>High</i><strong>Build Kanban board</strong><small>Cross-column drag and drop</small><footer><b>MW</b><em>Aug 22</em></footer></article></div><div><span>Review</span><article><i>Medium</i><strong>Analytics dashboard</strong><small>Responsive sprint reporting</small><footer><b>SB</b><em>Aug 23</em></footer></article></div></div></div><blockquote>“The best sprint is the one everyone understands.”</blockquote></section>
    <section className="login-form-wrap"><form onSubmit={submit}><div className="mobile-brand"><span>SD</span><strong>SprintDesk</strong></div><span className="welcome">WELCOME BACK</span><h2>Sign in to your workspace</h2><p>Use the demo credentials below to explore SprintDesk.</p><label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required /></label><label>Password<div className="password-field"><input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><div className="login-row"><label className="checkbox"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>{remember && <Check size={12} />}</span>Remember me</label><button type="button" className="link-button">Need help?</button></div>{error && <div className="form-error" role="alert">{error}</div>}<button className="login-submit" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}</button><div className="demo-note"><strong>Demo account</strong><code>emilys</code><span>/</span><code>emilyspass</code></div></form><small className="login-footer">Protected by encrypted token refresh · Demo data only</small></section>
  </main>;
}
