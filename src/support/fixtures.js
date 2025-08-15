// src/support/fixtures.js
import { test as base } from 'playwright-bdd';
import testConfig from '../config/test-config.js';

/**
 * Custom test fixtures for PerfectDraft tests
 * Extends playwright-bdd with custom fixtures
 */
const test = base.extend({
  // Test configuration fixture
  config: async ({}, use) => {
    await use(testConfig);
  },

  // Country-specific context
  countryContext: async ({}, use) => {
    const country = process.env.TEST_COUNTRY || testConfig.countries.default;
    const countryConfig = testConfig.getCountryConfig(country);
    await use({
      code: country,
      ...countryConfig
    });
  },

  // Authenticated page fixture
  authenticatedPage: async ({ page, config }, use) => {
    // Navigate to login page
    await page.goto(config.getUrl('/login'));
    
    // Perform login
    await page.fill('[data-testid="email-input"]', config.users.default.email);
    await page.fill('[data-testid="password-input"]', config.users.default.password);
    await page.click('[data-testid="login-button"]');
    
    // Wait for navigation
    await page.waitForURL(/\/account|\/dashboard/);
    
    // Provide authenticated page
    await use(page);
    
    // Cleanup: logout after test
    try {
      await page.click('[data-testid="logout-button"]');
    } catch (error) {
      // Ignore logout errors
    }
  },

  // Test data fixture
  testData: async ({}, use) => {
    const data = {
      timestamp: Date.now(),
      uniqueId: Math.random().toString(36).substring(7),
      generateEmail: (prefix = 'test') => `${prefix}_${Date.now()}@example.com`,
      generatePhone: () => `+44 77${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
    };
    await use(data);
  },

  // Page utilities fixture
  pageUtils: async ({ page }, use) => {
    const utils = {
      // Wait for page to be ready
      waitForPageReady: async () => {
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
      },

      // Accept cookies if banner appears
      acceptCookies: async () => {
        try {
          const cookieButton = page.locator('[data-testid="accept-cookies"], #onetrust-accept-btn-handler, .cookie-accept');
          if (await cookieButton.isVisible({ timeout: 3000 })) {
            await cookieButton.click();
            await page.waitForTimeout(500); // Wait for banner to disappear
          }
        } catch (error) {
          // Cookie banner not present or already accepted
        }
      },

      // Close any popups
      closePopups: async () => {
        try {
          const closeButtons = page.locator('[data-testid="close-popup"], .popup-close, .modal-close');
          const count = await closeButtons.count();
          for (let i = 0; i < count; i++) {
            const button = closeButtons.nth(i);
            if (await button.isVisible()) {
              await button.click();
            }
          }
        } catch (error) {
          // No popups to close
        }
      },

      // Take screenshot with timestamp
      takeScreenshot: async (name) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await page.screenshot({
          path: `test-results/screenshots/${name}-${timestamp}.png`,
          fullPage: true
        });
      },

      // Scroll to element
      scrollToElement: async (selector) => {
        await page.locator(selector).scrollIntoViewIfNeeded();
      },

      // Wait for element and return it
      waitForElement: async (selector, options = {}) => {
        const element = page.locator(selector);
        await element.waitFor(options);
        return element;
      }
    };
    await use(utils);
  },

  // Browser context with custom settings
  customContext: async ({ browser, config, countryContext }, use) => {
    const context = await browser.newContext({
      baseURL: config.getCountryUrl(countryContext.code),
      locale: countryContext.locale,
      timezoneId: countryContext.timezone,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      ...config.capture
    });
    await use(context);
    await context.close();
  }
});

export { test };