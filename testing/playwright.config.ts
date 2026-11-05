import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  outputDir: './reports/results',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['junit', { outputFile: 'reports/e2e-junit.xml' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4300',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: { slowMo: Number(process.env['E2E_SLOW_MO'] ?? 0) },
  },
  projects: [
    {
      name: 'admin-login',
      testDir: './admin/e2e',
      testMatch: '01-admin-login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-vehicles',
      testDir: './admin/e2e',
      testMatch: '02-admin-vehicles.spec.ts',
      dependencies: ['admin-login'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-users',
      testDir: './admin/e2e',
      testMatch: '03-admin-users.spec.ts',
      dependencies: ['admin-vehicles'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-test-drives',
      testDir: './admin/e2e',
      testMatch: '04-admin-test-drives.spec.ts',
      dependencies: ['admin-users'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-brands',
      testDir: './admin/e2e',
      testMatch: '05-admin-brands.spec.ts',
      dependencies: ['admin-test-drives'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-sellers',
      testDir: './admin/e2e',
      testMatch: '06-admin-sellers.spec.ts',
      dependencies: ['admin-brands'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'user-auth', testDir: './user/e2e', testMatch: '01-auth.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'user-catalog', testDir: './user/e2e', testMatch: '02-catalog.spec.ts',
      dependencies: ['user-auth'], use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'user-saved-cars', testDir: './user/e2e', testMatch: '03-saved-cars.spec.ts',
      dependencies: ['user-catalog'], use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'user-bookings', testDir: './user/e2e', testMatch: '04-bookings.spec.ts',
      dependencies: ['user-auth'], use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'user-forms', testDir: './user/e2e', testMatch: '05-forms.spec.ts',
      dependencies: ['user-auth'], use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node ../node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 4300',
    url: 'http://127.0.0.1:4300',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
