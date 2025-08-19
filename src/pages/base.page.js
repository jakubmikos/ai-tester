// src/pages/base.page.js
import { expect } from '@playwright/test';
import testConfig from '../config/test-config.js';

/**
 * Base Page Object class
 * Contains common methods for all page objects
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.config = testConfig;
    
    // Cart counter element selector
    this.cartCounterSelector = '.counter-number';
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns {string}
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Find element by selector
   * @param {string} selector
   * @returns {import('@playwright/test').Locator}
   */
  findElement(selector) {
    return this.page.locator(selector);
  }

  /**
   * Find element by text
   * @param {string} text
   * @returns {import('@playwright/test').Locator}
   */
  findElementByText(text) {
    return this.page.getByText(text);
  }

  /**
   * Find element by role
   * @param {string} role - ARIA role
   * @param {Object} options - Additional options
   * @returns {import('@playwright/test').Locator}
   */
  findElementByRole(role, options = {}) {
    return this.page.getByRole(role, options);
  }

  /**
   * Find element by test id
   * @param {string} testId
   * @returns {import('@playwright/test').Locator}
   */
  findElementByTestId(testId) {
    return this.page.getByTestId(testId);
  }

  /**
   * Find element by label
   * @param {string} label
   * @returns {import('@playwright/test').Locator}
   */
  findElementByLabel(label) {
    return this.page.getByLabel(label);
  }

  /**
   * Find element by placeholder
   * @param {string} placeholder
   * @returns {import('@playwright/test').Locator}
   */
  findElementByPlaceholder(placeholder) {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Click element
   * @param {string} selector
   */
  async click(selector) {
    await this.findElement(selector).click();
  }

  /**
   * Click element by text
   * @param {string} text
   */
  async clickByText(text) {
    await this.findElementByText(text).click();
  }

  /**
   * Type text into element
   * @param {string} selector
   * @param {string} text
   */
  async type(selector, text) {
    await this.findElement(selector).fill(text);
  }

  /**
   * Clear and type text into element
   * @param {string} selector
   * @param {string} text
   */
  async clearAndType(selector, text) {
    const element = this.findElement(selector);
    await element.clear();
    await element.fill(text);
  }

  /**
   * Get text from element
   * @param {string} selector
   * @returns {Promise<string>}
   */
  async getText(selector) {
    const text = await this.findElement(selector).textContent();
    return text || '';
  }

  /**
   * Get inner text from element
   * @param {string} selector
   * @returns {Promise<string>}
   */
  async getInnerText(selector) {
    return await this.findElement(selector).innerText();
  }

  /**
   * Get attribute value
   * @param {string} selector
   * @param {string} attribute
   * @returns {Promise<string|null>}
   */
  async getAttribute(selector, attribute) {
    return await this.findElement(selector).getAttribute(attribute);
  }

  /**
   * Check if element is visible
   * @param {string} selector
   * @returns {Promise<boolean>}
   */
  async isElementVisible(selector) {
    try {
      return await this.findElement(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param {string} selector
   * @returns {Promise<boolean>}
   */
  async isElementEnabled(selector) {
    try {
      return await this.findElement(selector).isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is checked (for checkboxes/radios)
   * @param {string} selector
   * @returns {Promise<boolean>}
   */
  async isElementChecked(selector) {
    try {
      return await this.findElement(selector).isChecked();
    } catch {
      return false;
    }
  }

  /**
   * Wait for element
   * @param {string} selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 0) {
    const timeoutMs = timeout || this.config.getTimeout('default');
    await this.page.waitForSelector(selector, { timeout: timeoutMs });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElementToBeVisible(selector, timeout = 0) {
    const timeoutMs = timeout || this.config.getTimeout('default');
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: timeoutMs
    });
  }

  /**
   * Wait for element to be hidden
   * @param {string} selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElementToBeHidden(selector, timeout = 0) {
    const timeoutMs = timeout || this.config.getTimeout('default');
    await this.page.waitForSelector(selector, {
      state: 'hidden',
      timeout: timeoutMs
    });
  }

  /**
   * Wait for URL to contain
   * @param {string} urlPart
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForUrl(urlPart, timeout = 0) {
    const timeoutMs = timeout || this.config.getTimeout('navigation');
    await this.page.waitForURL(`**/*${urlPart}*`, { timeout: timeoutMs });
  }

  /**
   * Scroll to element
   * @param {string} selector
   */
  async scrollToElement(selector) {
    await this.findElement(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Select from dropdown
   * @param {string} selector
   * @param {string} value
   */
  async selectFromDropdown(selector, value) {
    await this.findElement(selector).selectOption(value);
  }

  /**
   * Get element count
   * @param {string} selector
   * @returns {Promise<number>}
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Get all texts from elements
   * @param {string} selector
   * @returns {Promise<string[]>}
   */
  async getAllTexts(selector) {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Take screenshot
   * @param {string} path - Optional path for screenshot
   */
  async takeScreenshot(path) {
    const screenshotPath = path || `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
  }

  /**
   * Press key
   * @param {string} key - Key to press
   */
  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  /**
   * Hover over element
   * @param {string} selector
   */
  async hover(selector) {
    await this.findElement(selector).hover();
  }

  /**
   * Double click element
   * @param {string} selector
   */
  async doubleClick(selector) {
    await this.findElement(selector).dblclick();
  }

  /**
   * Right click element
   * @param {string} selector
   */
  async rightClick(selector) {
    await this.findElement(selector).click({ button: 'right' });
  }

  /**
   * Check checkbox
   * @param {string} selector
   */
  async check(selector) {
    await this.findElement(selector).check();
  }

  /**
   * Uncheck checkbox
   * @param {string} selector
   */
  async uncheck(selector) {
    await this.findElement(selector).uncheck();
  }

  /**
   * Upload file
   * @param {string} selector
   * @param {string} filePath
   */
  async uploadFile(selector, filePath) {
    await this.findElement(selector).setInputFiles(filePath);
  }

  /**
   * Accept dialog
   */
  async acceptDialog() {
    this.page.on('dialog', dialog => dialog.accept());
  }

  /**
   * Dismiss dialog
   */
  async dismissDialog() {
    this.page.on('dialog', dialog => dialog.dismiss());
  }

  /**
   * Reload page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward
   */
  async goForward() {
    await this.page.goForward();
  }

  // Assertion methods

  /**
   * Assert element exists and is visible
   * @param {string} selector
   * @param {string} customMessage
   */
  async assertElementExists(selector, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element with selector '${selector}' should be visible`).toBeVisible();
  }

  /**
   * Assert element contains text
   * @param {string} selector
   * @param {string} expectedText
   * @param {string} customMessage
   */
  async assertElementContainsText(selector, expectedText, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element should contain text '${expectedText}'`).toContainText(expectedText);
  }

  /**
   * Assert element has exact text
   * @param {string} selector
   * @param {string} expectedText
   * @param {string} customMessage
   */
  async assertElementHasText(selector, expectedText, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element should have text '${expectedText}'`).toHaveText(expectedText);
  }

  /**
   * Assert URL contains
   * @param {string} expectedUrlPart
   * @param {string} customMessage
   */
  async assertUrlContains(expectedUrlPart, customMessage) {
    await expect(this.page, customMessage || `URL should contain '${expectedUrlPart}'`).toHaveURL(new RegExp(expectedUrlPart));
  }

  /**
   * Assert page title contains
   * @param {string} expectedTitlePart
   * @param {string} customMessage
   */
  async assertPageTitleContains(expectedTitlePart, customMessage) {
    await expect(this.page, customMessage || `Page title should contain '${expectedTitlePart}'`).toHaveTitle(new RegExp(expectedTitlePart));
  }

  /**
   * Assert element is visible
   * @param {string} selector
   * @param {string} customMessage
   */
  async assertElementIsVisible(selector, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element '${selector}' should be visible`).toBeVisible();
  }

  /**
   * Assert element is hidden
   * @param {string} selector
   * @param {string} customMessage
   */
  async assertElementIsHidden(selector, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element '${selector}' should be hidden`).toBeHidden();
  }

  /**
   * Assert element is enabled
   * @param {string} selector
   * @param {string} customMessage
   */
  async assertElementIsEnabled(selector, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element '${selector}' should be enabled`).toBeEnabled();
  }

  /**
   * Assert element is disabled
   * @param {string} selector
   * @param {string} customMessage
   */
  async assertElementIsDisabled(selector, customMessage) {
    const element = this.findElement(selector);
    await expect(element, customMessage || `Element '${selector}' should be disabled`).toBeDisabled();
  }

  /**
   * Assert element count
   * @param {string} selector
   * @param {number} expectedCount
   * @param {string} customMessage
   */
  async assertElementCount(selector, expectedCount, customMessage) {
    const elements = this.page.locator(selector);
    await expect(elements, customMessage || `Should have ${expectedCount} elements`).toHaveCount(expectedCount);
  }

  // Cart-specific methods

  /**
   * Get the cart counter value
   * @returns {Promise<number>} The cart counter value as a number
   */
  async getCartCounterValue() {
    const counterText = await this.getText(this.cartCounterSelector);
    return parseInt(counterText, 10) || 0;
  }

  /**
   * Assert cart counter has at least the specified quantity
   * @param {number} minQuantity - Minimum expected quantity
   * @param {string} customMessage - Optional custom message
   */
  async assertCartCounterAtLeast(minQuantity, customMessage) {
    const actualQuantity = await this.getCartCounterValue();
    const message = customMessage || `Cart counter should show at least ${minQuantity}, but shows ${actualQuantity}`;
    expect(actualQuantity).toBeGreaterThanOrEqual(minQuantity);
  }

  /**
   * Wait for cart counter to update to expected value
   * @param {number} expectedMin - Expected minimum value
   */
  async waitForCartCounterUpdate(expectedMin) {
    await this.page.locator(this.cartCounterSelector).waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.page.locator(this.cartCounterSelector)).toHaveText(new RegExp(`^[${expectedMin}-9]\\d*$`), { timeout: 10000 });
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete() {
    await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /**
   * Wait for cart items to be visible
   */
  async waitForCartItemsVisible() {
    const cartItemsLocator = this.page.locator('.cart-items-list > .cart-product-container > .cart-product');
    await expect(cartItemsLocator.first()).toBeVisible({ timeout: 10000 });
  }
}

export default BasePage;