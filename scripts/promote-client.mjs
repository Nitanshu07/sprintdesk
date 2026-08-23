import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const clientDir = join('dist', 'client');
if (!existsSync(clientDir)) throw new Error('Missing dist/client output.');
for (const entry of readdirSync(clientDir)) {
  cpSync(join(clientDir, entry), join('dist', entry), { recursive: true, force: true });
}

const workerConfig = JSON.parse(readFileSync(join('dist', 'server', 'wrangler.json'), 'utf8'));
delete workerConfig.main;
workerConfig.assets = { ...workerConfig.assets, directory: '.', not_found_handling: 'single-page-application' };
writeFileSync(join('dist', 'wrangler.json'), JSON.stringify(workerConfig));
