const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const root = path.resolve(__dirname, '../..');
const legacy = process.argv.includes('--legacy');
const scope = process.argv.find(arg => arg.startsWith('--scope='))?.split('=')[1];
if (scope && !['admin', 'user'].includes(scope)) throw new Error('scope must be admin or user');
const result = spawnSync(process.execPath, [
  path.join(root, 'node_modules/@angular/cli/bin/ng.js'),
  'test', '--watch=false', '--progress=false', '--browsers=ChromeHeadless',
  '--karma-config=testing/karma.conf.cjs',
  `--ts-config=${legacy ? 'tsconfig.spec.json' : 'testing/tsconfig.unit.json'}`,
  ...(legacy ? [] : [
    ...(scope ? [`--include=../testing/${scope}/unit/**/*.spec.ts`] : [
      '--include=../testing/admin/unit/**/*.spec.ts', '--include=../testing/user/unit/**/*.spec.ts',
    ]), '--code-coverage',
  ]),
], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    CHROME_BIN: process.env.CHROME_BIN || chromium.executablePath(),
    SHOWROOM_LEGACY_TESTS: legacy ? '1' : '',
    SHOWROOM_TEST_SCOPE: scope || '',
  },
});
if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
