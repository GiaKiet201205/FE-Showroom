const { spawnSync } = require('node:child_process');
const path = require('node:path');

const cli = path.join(path.dirname(require.resolve('@playwright/test/package.json')), 'cli.js');
const result = spawnSync(process.execPath, [cli, 'test', '--headed', '--workers=1', ...process.argv.slice(2)], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: { ...process.env, E2E_SLOW_MO: process.env.E2E_SLOW_MO || '350' },
});
if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
