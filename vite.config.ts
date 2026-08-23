import { sites } from '@openai/sites-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  process.env.XDG_CONFIG_HOME ??= '.wrangler';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    publicDir: 'frontend/public',
    css: { postcss: { plugins: [tailwindcss()] } },
    plugins: [react(), sites(), cloudflare()],
    server: { host: '127.0.0.1' },
    build: { target: 'es2022' },
  };
});
