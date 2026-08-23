import { afterEach, describe, expect, it, vi } from 'vitest';
import { authFetch } from '../services';

describe('auth interceptor', () => {
  afterEach(() => vi.restoreAllMocks());
  it('refreshes and retries after a 401', async () => {
    localStorage.setItem('sprintdesk-refresh-token', 'refresh-token');
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'new-access', refreshToken: 'new-refresh' }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const response = await authFetch('/protected');
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1]?.headers).toMatchObject({ Authorization: 'Bearer new-access' });
  });
});
