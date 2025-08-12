// src/support/hooks.js
const { Before, After, BeforeAll, AfterAll, Status } = require('playwright-bdd/decorators');
const fs = require('fs').promises;
const path = require('path');
const testConfig = require('../config/test-config');

/**
 * Global hooks for test execution
 */

// Run once before all tests
BeforeAll(async function() {
  console.log('🚀 Starting PerfectDraft test suite');
  console.log(`📍 Environment: ${testConfig.environment}`);
  console.log(`🌍 Base URL: ${testConfig.baseUrl}`);
  console.log(`🌐 Default Country: ${testConfig.countries.default}`);
  
  // Create test result directories
  const dirs = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
    'allure-results'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  // Log configuration if verbose
  testConfig.logConfig();
});

// Run once after all tests
AfterAll(async function() {
  console.log('✅ Test suite completed');
  
  // Clean up old test results if not in CI
  if (!testConfig.isCI()) {
    try {
      const screenshotDir = 'test-results/screenshots';
      const files = await fs.readdir(screenshotDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      for (const file of files) {
        const filePath = path.join(screenshotDir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
});

// Run before each scenario
Before(async function({ page, pageUtils }) {
  // Set default timeout
  page.setDefaultTimeout(testConfig.getTimeout('default'));
  page.setDefaultNavigationTimeout(testConfig.getTimeout('navigation'));
  
  // Accept cookies on first load
  page.once('load', async () => {
    await pageUtils.acceptCookies();
  });
  
  // Log scenario start
  if (testConfig.debug.verbose) {
    const scenario = this.pickle?.name || 'Unknown scenario';
    console.log(`\n📝 Starting scenario: ${scenario}`);
  }
});

// Run after each scenario
After(async function({ page, testInfo }) {
  const scenario = this.pickle?.name || 'test';
  const status = testInfo.status;
  
  // Take screenshot on failure
  if (status === 'failed' || status === 'timedOut') {
    const screenshotName = scenario.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    try {
      await page.screenshot({
        path: `test-results/screenshots/failed-${screenshotName}-${timestamp}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot saved for failed scenario: ${scenario}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error.message);
    }
    
    // Attach page content for debugging
    if (testConfig.debug.enabled) {
      try {
        const html = await page.content();
        await fs.writeFile(
          `test-results/failed-${screenshotName}-${timestamp}.html`,
          html
        );
      } catch (error) {
        // Ignore HTML capture errors
      }
    }
  }
  
  // Log scenario completion
  if (testConfig.debug.verbose) {
    const statusEmoji = {
      passed: '✅',
      failed: '❌',
      skipped: '⏭️',
      timedOut: '⏱️'
    };
    console.log(`${statusEmoji[status] || '❓'} Scenario completed: ${scenario} - ${status}`);
  }
  
  // Clear browser storage between tests
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch (error) {
    // Page might be closed
  }
});

// Tagged hooks
Before({ tags: '@auth' }, async function({ page, config }) {
  // Pre-authenticate for tests tagged with @auth
  await page.goto(config.getUrl('/login'));
  await page.fill('[data-testid="email-input"]', config.users.default.email);
  await page.fill('[data-testid="password-input"]', config.users.default.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL(/\/account|\/dashboard/);
});

Before({ tags: '@mobile' }, async function({ page }) {
  // Set mobile viewport for mobile-specific tests
  await page.setViewportSize({ width: 375, height: 667 });
});

Before({ tags: '@desktop' }, async function({ page }) {
  // Set desktop viewport for desktop-specific tests
  await page.setViewportSize({ width: 1920, height: 1080 });
});

// Performance monitoring hook
After({ tags: '@performance' }, async function({ page }) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart
    };
  });
  
  console.log('📊 Performance Metrics:', metrics);
});

module.exports = {};