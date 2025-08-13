// src/support/allure-utils.js
const { allure } = require('allure-playwright');

/**
 * Allure reporting utilities
 * Enhanced reporting capabilities for test execution
 */
class AllureUtils {
  /**
   * Set test suite information
   * @param {string} suiteName - Name of the test suite
   */
  static setSuite(suiteName) {
    allure.suite(suiteName);
  }

  /**
   * Set test epic (high-level feature)
   * @param {string} epicName - Name of the epic
   */
  static setEpic(epicName) {
    allure.epic(epicName);
  }

  /**
   * Set test feature
   * @param {string} featureName - Name of the feature
   */
  static setFeature(featureName) {
    allure.feature(featureName);
  }

  /**
   * Set test story
   * @param {string} storyName - Name of the story
   */
  static setStory(storyName) {
    allure.story(storyName);
  }

  /**
   * Set test severity
   * @param {string} severity - Severity level (blocker, critical, normal, minor, trivial)
   */
  static setSeverity(severity) {
    const validSeverities = ['blocker', 'critical', 'normal', 'minor', 'trivial'];
    if (validSeverities.includes(severity.toLowerCase())) {
      allure.severity(severity.toLowerCase());
    }
  }

  /**
   * Add test tag
   * @param {string} tag - Tag to add
   */
  static addTag(tag) {
    allure.tag(tag);
  }

  /**
   * Add test owner
   * @param {string} owner - Owner name
   */
  static setOwner(owner) {
    allure.owner(owner);
  }

  /**
   * Add test link
   * @param {string} url - URL to link
   * @param {string} name - Link name
   * @param {string} type - Link type (issue, tms, custom)
   */
  static addLink(url, name, type = 'custom') {
    allure.link(url, name, type);
  }

  /**
   * Add issue link
   * @param {string} issueId - Issue ID
   * @param {string} baseUrl - Base URL for issue tracker
   */
  static addIssue(issueId, baseUrl = 'https://github.com/perfectdraft/issues/') {
    allure.issue(issueId, `${baseUrl}${issueId}`);
  }

  /**
   * Add test management system link
   * @param {string} testId - Test case ID
   * @param {string} baseUrl - Base URL for TMS
   */
  static addTms(testId, baseUrl = 'https://tms.perfectdraft.com/') {
    allure.tms(testId, `${baseUrl}${testId}`);
  }

  /**
   * Add test step
   * @param {string} stepName - Step name
   * @param {Function} stepFunction - Step function to execute
   */
  static async step(stepName, stepFunction) {
    return await allure.step(stepName, stepFunction);
  }

  /**
   * Add parameter to test
   * @param {string} name - Parameter name
   * @param {any} value - Parameter value
   * @param {Object} options - Additional options
   */
  static addParameter(name, value, options = {}) {
    allure.parameter(name, value, options);
  }

  /**
   * Add attachment to test
   * @param {string} name - Attachment name
   * @param {Buffer|string} content - Attachment content
   * @param {string} type - MIME type
   */
  static async addAttachment(name, content, type = 'text/plain') {
    await allure.attachment(name, content, type);
  }

  /**
   * Add screenshot attachment
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   */
  static async attachScreenshot(page, name = 'screenshot') {
    const screenshot = await page.screenshot({ fullPage: true });
    await allure.attachment(`${name}.png`, screenshot, 'image/png');
  }

  /**
   * Add HTML attachment
   * @param {Page} page - Playwright page object
   * @param {string} name - HTML attachment name
   */
  static async attachHTML(page, name = 'page-source') {
    const html = await page.content();
    await allure.attachment(`${name}.html`, html, 'text/html');
  }

  /**
   * Add JSON attachment
   * @param {Object} data - JSON data
   * @param {string} name - Attachment name
   */
  static async attachJSON(data, name = 'data') {
    const json = JSON.stringify(data, null, 2);
    await allure.attachment(`${name}.json`, json, 'application/json');
  }

  /**
   * Add test context information
   * @param {Object} context - Context object
   */
  static async addTestContext(context) {
    const {
      browser,
      viewport,
      locale,
      timezone,
      userAgent,
      environment
    } = context;

    if (browser) allure.parameter('Browser', browser);
    if (viewport) allure.parameter('Viewport', `${viewport.width}x${viewport.height}`);
    if (locale) allure.parameter('Locale', locale);
    if (timezone) allure.parameter('Timezone', timezone);
    if (userAgent) allure.parameter('User Agent', userAgent);
    if (environment) allure.parameter('Environment', environment);
  }

  /**
   * Add test timing information
   * @param {number} startTime - Start timestamp
   * @param {number} endTime - End timestamp
   */
  static addTiming(startTime, endTime) {
    const duration = endTime - startTime;
    allure.parameter('Duration', `${duration}ms`);
    allure.parameter('Start Time', new Date(startTime).toISOString());
    allure.parameter('End Time', new Date(endTime).toISOString());
  }

  /**
   * Set test categories based on tags
   * @param {Array<string>} tags - Test tags
   */
  static setCategoriesFromTags(tags) {
    tags.forEach(tag => {
      if (tag.startsWith('@P1')) {
        this.setSeverity('critical');
        this.addTag('Priority-1');
      } else if (tag.startsWith('@P2')) {
        this.setSeverity('normal');
        this.addTag('Priority-2');
      } else if (tag.startsWith('@P3')) {
        this.setSeverity('minor');
        this.addTag('Priority-3');
      }

      if (tag === '@Smoke') {
        this.addTag('Smoke');
        this.setSeverity('blocker');
      } else if (tag === '@Critical') {
        this.setSeverity('blocker');
      } else if (tag === '@Regression') {
        this.addTag('Regression');
      }
    });
  }

  /**
   * Add browser console logs
   * @param {Page} page - Playwright page object
   */
  static async attachConsoleLogs(page) {
    const logs = [];
    page.on('console', msg => {
      logs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });

    // Attach logs at the end of test
    process.on('beforeExit', async () => {
      if (logs.length > 0) {
        await this.attachJSON(logs, 'console-logs');
      }
    });
  }

  /**
   * Add network activity logs
   * @param {Page} page - Playwright page object
   */
  static async attachNetworkLogs(page) {
    const requests = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: Date.now()
      });
    });

    page.on('response', response => {
      const request = requests.find(r => r.url === response.url());
      if (request) {
        request.status = response.status();
        request.statusText = response.statusText();
      }
    });

    // Attach logs at the end of test
    process.on('beforeExit', async () => {
      if (requests.length > 0) {
        await this.attachJSON(requests, 'network-logs');
      }
    });
  }

  /**
   * Mark test as known issue
   * @param {string} issueId - Issue ID
   * @param {string} reason - Reason for known issue
   */
  static markAsKnownIssue(issueId, reason) {
    this.addIssue(issueId);
    this.addParameter('Known Issue', reason);
    this.addTag('known-issue');
  }

  /**
   * Mark test as flaky
   * @param {string} reason - Reason for flakiness
   */
  static markAsFlaky(reason) {
    this.addParameter('Flaky Test', reason);
    this.addTag('flaky');
    this.setSeverity('minor');
  }

  /**
   * Add performance metrics
   * @param {Object} metrics - Performance metrics
   */
  static async addPerformanceMetrics(metrics) {
    const {
      loadTime,
      domContentLoaded,
      firstContentfulPaint,
      largestContentfulPaint
    } = metrics;

    const performanceData = {
      'Page Load Time': loadTime ? `${loadTime}ms` : 'N/A',
      'DOM Content Loaded': domContentLoaded ? `${domContentLoaded}ms` : 'N/A',
      'First Contentful Paint': firstContentfulPaint ? `${firstContentfulPaint}ms` : 'N/A',
      'Largest Contentful Paint': largestContentfulPaint ? `${largestContentfulPaint}ms` : 'N/A'
    };

    await this.attachJSON(performanceData, 'performance-metrics');
  }
}

module.exports = AllureUtils;