// src/helpers/wait-helpers.js

/**
 * Helper functions for reliable waiting and synchronization in tests
 */
class WaitHelpers {
  /**
   * Wait for cart counter to update after an action
   * @param {Page} page - Playwright page object
   * @param {number} expectedMinValue - Expected minimum cart value
   * @param {number} timeout - Maximum wait time in ms
   */
  static async waitForCartCounterUpdate(page, expectedMinValue = 1, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // Check cart counter value
        const counterElement = page.locator('.counter-number').first();
        if (await counterElement.isVisible({ timeout: 500 })) {
          const text = await counterElement.textContent();
          const value = parseInt(text?.trim() || '0', 10);
          
          if (value >= expectedMinValue) {
            // Wait a bit more for any animations to complete
            await page.waitForTimeout(500);
            return true;
          }
        }
      } catch {
        // Continue waiting
      }
      
      // Small delay before retry
      await page.waitForTimeout(200);
    }
    
    return false;
  }

  /**
   * Wait for network to be idle after an action
   * @param {Page} page - Playwright page object
   * @param {number} timeout - Maximum wait time
   */
  static async waitForNetworkIdle(page, timeout = 5000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch {
      // If network doesn't idle, at least wait for DOM
      await page.waitForLoadState('domcontentloaded', { timeout: 2000 });
    }
  }

  /**
   * Wait for cart items to be visible
   * @param {Page} page - Playwright page object
   * @param {number} minItems - Minimum number of items expected
   * @param {number} timeout - Maximum wait time
   */
  static async waitForCartItems(page, minItems = 1, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const cartItems = page.locator('.cart-items-list > .cart-product-container > .cart-product');
        const count = await cartItems.count();
        
        if (count >= minItems) {
          // Wait for items to be fully rendered
          await page.waitForTimeout(500);
          return true;
        }
      } catch {
        // Continue waiting
      }
      
      await page.waitForTimeout(200);
    }
    
    return false;
  }

  /**
   * Retry an action with exponential backoff
   * @param {Function} action - Action to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} initialDelay - Initial delay in ms
   */
  static async retryWithBackoff(action, maxRetries = 3, initialDelay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Wait for element text to change
   * @param {Locator} element - Element locator
   * @param {string} initialText - Initial text value
   * @param {number} timeout - Maximum wait time
   */
  static async waitForTextChange(element, initialText, timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const currentText = await element.textContent();
        if (currentText !== initialText) {
          return currentText;
        }
      } catch {
        // Element might not exist yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return null;
  }

  /**
   * Wait for loading indicators to disappear
   * @param {Page} page - Playwright page object
   * @param {number} timeout - Maximum wait time
   */
  static async waitForLoadingToComplete(page, timeout = 10000) {
    const loadingSelectors = [
      '.loading',
      '.spinner',
      '.loader',
      '[data-role="loader"]',
      '.block-loader',
      '.ajax-loading'
    ];
    
    for (const selector of loadingSelectors) {
      try {
        const loader = page.locator(selector);
        if (await loader.isVisible({ timeout: 100 })) {
          await loader.waitFor({ state: 'hidden', timeout });
        }
      } catch {
        // Loader might not exist, continue
      }
    }
  }

  /**
   * Wait for toast/notification to appear and disappear
   * @param {Page} page - Playwright page object
   * @param {number} timeout - Maximum wait time
   */
  static async waitForToastToDisappear(page, timeout = 5000) {
    const toastSelectors = [
      '.toast-container',
      '.notification',
      '.alert',
      '.message'
    ];
    
    for (const selector of toastSelectors) {
      try {
        const toast = page.locator(selector).first();
        if (await toast.isVisible({ timeout: 100 })) {
          // Wait for toast to disappear or become non-blocking
          await toast.waitFor({ state: 'hidden', timeout }).catch(() => {
            // Toast might still be visible but not blocking
          });
        }
      } catch {
        // Toast might not exist
      }
    }
  }
}

export default WaitHelpers;