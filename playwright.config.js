// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['src/features/**/*.feature'],
  require: ['src/steps/*.steps.js']
});

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      environmentInfo: {
        framework: 'Playwright-BDD',
        os: process.platform,
        node_version: process.version,
      }
    }]
  ],

  // Global timeout for each test
  timeout: 30000,

  // Global test expectations timeout
  expect: {
    timeout: 5000
  },

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'https://www.perfectdraft.com',

    // Collect trace when retrying the failed test
    trace: 'off',

    // Screenshot only on failure
    screenshot: 'only-on-failure',

    // Video on retain-on-failure
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors during navigation
    ignoreHTTPSErrors: true,

    // Timeout for each action
    actionTimeout: 5000,

    // Locale
    locale: 'en-GB',

    // Timezone
    timezoneId: 'Europe/London',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Launch options for better performance
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-dev-shm-usage',
            '--disable-gpu-sandbox',
            '--no-sandbox',
            '--disable-web-security'
          ]
        }
      },
    },

/*    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },

    // Test against branded browsers
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge' 
      },
    },
    */
  ],

  // Run your local dev server before starting the tests
  // Uncomment if needed
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
