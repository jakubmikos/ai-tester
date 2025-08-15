// src/config/test-config.js
import dotenv from 'dotenv';
dotenv.config();

/**
 * Test configuration management
 * Centralizes all test configuration with environment variable support
 */
class TestConfig {
  constructor() {
    this.loadConfiguration();
  }

  loadConfiguration() {
    // Base configuration
    this.baseUrl = process.env.BASE_URL || 'https://www.perfectdraft.com';
    this.environment = process.env.ENV || 'production';
    
    // Browser settings
    this.browser = {
      headless: process.env.HEADLESS === 'true',
      slowMo: parseInt(process.env.SLOW_MO) || 0,
      defaultBrowser: process.env.DEFAULT_BROWSER || 'chromium'
    };

    // Timeouts
    this.timeouts = {
      default: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
      action: parseInt(process.env.ACTION_TIMEOUT) || 15000,
      navigation: parseInt(process.env.NAVIGATION_TIMEOUT) || 30000,
      assertion: parseInt(process.env.ASSERTION_TIMEOUT) || 5000
    };

    // Test execution
    this.execution = {
      workers: parseInt(process.env.PARALLEL_WORKERS) || 4,
      retries: parseInt(process.env.RETRY_COUNT) || 0,
      bail: process.env.BAIL === 'true'
    };

    // Screenshot and recording
    this.capture = {
      screenshot: process.env.SCREENSHOT_MODE || 'only-on-failure',
      video: process.env.VIDEO_MODE || 'retain-on-failure',
      trace: process.env.TRACE_MODE || 'on-first-retry'
    };

    // Countries configuration
    this.countries = {
      default: process.env.DEFAULT_COUNTRY || 'GB',
      available: {
        'GB': {
          path: '/en-gb',
          locale: 'en-GB',
          currency: 'GBP',
          timezone: 'Europe/London',
          language: 'English'
        },
        'FR': {
          path: '/fr-fr',
          locale: 'fr-FR',
          currency: 'EUR',
          timezone: 'Europe/Paris',
          language: 'Français'
        },
        'BE': {
          path: '/nl-be',
          locale: 'nl-BE',
          currency: 'EUR',
          timezone: 'Europe/Brussels',
          language: 'Nederlands'
        },
        'NL': {
          path: '/nl-nl',
          locale: 'nl-NL',
          currency: 'EUR',
          timezone: 'Europe/Amsterdam',
          language: 'Nederlands'
        },
        'DE': {
          path: '/de-de',
          locale: 'de-DE',
          currency: 'EUR',
          timezone: 'Europe/Berlin',
          language: 'Deutsch'
        },
        'IE': {
          path: '/en-ie',
          locale: 'en-IE',
          currency: 'EUR',
          timezone: 'Europe/Dublin',
          language: 'English'
        }
      }
    };

    // Test users
    this.users = {
      default: {
        email: process.env.TEST_USERNAME || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'TestPassword123'
      },
      guest: {
        email: 'guest@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+44 7700 900000'
      }
    };

    // API endpoints
    this.api = {
      baseUrl: process.env.API_BASE_URL || `${this.baseUrl}/api`,
      version: process.env.API_VERSION || 'v1'
    };

    // Reporting
    this.reporting = {
      allureResultsPath: process.env.ALLURE_RESULTS_PATH || 'allure-results',
      allureReportPath: process.env.ALLURE_REPORT_PATH || 'allure-report',
      screenshotPath: './test-results/screenshots',
      videoPath: './test-results/videos'
    };

    // Debug settings
    this.debug = {
      enabled: process.env.DEBUG === 'true',
      verbose: process.env.VERBOSE === 'true',
      pauseOnFailure: process.env.PAUSE_ON_FAILURE === 'true'
    };
  }

  /**
   * Get country-specific configuration
   * @param {string} countryCode - Two-letter country code
   * @returns {Object} Country configuration
   */
  getCountryConfig(countryCode) {
    const country = countryCode || this.countries.default;
    return this.countries.available[country] || this.countries.available[this.countries.default];
  }

  /**
   * Get environment-specific URL
   * @param {string} path - URL path
   * @param {string} countryCode - Country code
   * @returns {string} Full URL
   */
  getUrl(path = '', countryCode = null) {
    const countryConfig = this.getCountryConfig(countryCode);
    const localePath = countryConfig.path || '';
    return `${this.baseUrl}${localePath}${path}`;
  }

  /**
   * Get country home page URL
   * @param {string} countryCode - Country code
   * @returns {string} Country-specific home page URL
   */
  getCountryUrl(countryCode) {
    const countryConfig = this.getCountryConfig(countryCode);
    return `${this.baseUrl}${countryConfig.path}`;
  }

  /**
   * Check if running in CI environment
   * @returns {boolean}
   */
  isCI() {
    return process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS;
  }

  /**
   * Get timeout value
   * @param {string} type - Timeout type
   * @returns {number} Timeout in milliseconds
   */
  getTimeout(type = 'default') {
    return this.timeouts[type] || this.timeouts.default;
  }

  /**
   * Log configuration (for debugging)
   */
  logConfig() {
    if (this.debug.verbose) {
      console.log('Test Configuration:', {
        environment: this.environment,
        baseUrl: this.baseUrl,
        browser: this.browser,
        timeouts: this.timeouts,
        execution: this.execution,
        debug: this.debug
      });
    }
  }
}

// Export singleton instance
export default new TestConfig();