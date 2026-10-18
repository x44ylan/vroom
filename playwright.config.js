import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run preview -- --port 5188',
    port: 5188,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5188',
    trace: 'retain-on-failure',
    headless: true,
  },
});
