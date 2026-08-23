export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const pathname = new URL(request.url).pathname;
    const isAppRoute = request.method === 'GET' && !pathname.split('/').pop()?.includes('.');

    if (response.status !== 404 || !isAppRoute) return response;

    const indexUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;

