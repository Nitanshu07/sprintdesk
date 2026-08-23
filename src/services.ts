import type { MockData } from './types';

const API_ROOT = 'https://dummyjson.com';
let accessToken = '';

export async function getMockData(): Promise<MockData> {
  const response = await fetch('/mock-data.json');
  if (!response.ok) throw new Error('Unable to load SprintDesk data.');
  return response.json();
}

export function setAccessToken(token: string) { accessToken = token; }

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('sprintdesk-refresh-token');
  if (!refreshToken) throw new Error('Session expired.');
  const response = await fetch(`${API_ROOT}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  });
  if (!response.ok) throw new Error('Session expired.');
  const data = await response.json();
  accessToken = data.accessToken;
  localStorage.setItem('sprintdesk-refresh-token', data.refreshToken);
  return accessToken;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const run = (token: string) => fetch(input, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  let response = await run(accessToken);
  if (response.status === 401) response = await run(await refreshAccessToken());
  return response;
}

export async function loginRequest(username: string, password: string) {
  const response = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  });
  if (!response.ok) throw new Error('Incorrect username or password.');
  const data = await response.json();
  accessToken = data.accessToken;
  localStorage.setItem('sprintdesk-refresh-token', data.refreshToken);
  return data;
}

export async function restoreSession() {
  const refreshToken = localStorage.getItem('sprintdesk-refresh-token');
  if (!refreshToken) return null;
  await refreshAccessToken();
  const response = await authFetch(`${API_ROOT}/auth/me`);
  if (!response.ok) throw new Error('Session expired.');
  return response.json();
}
