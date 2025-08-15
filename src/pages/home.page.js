// src/pages/home.page.js
import BasePage from './base.page.js';

/**
 * Home Page Object
 * Represents the PerfectDraft home page
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Single specific selectors
    this.navigationSelector = 'nav.main-nav';
    this.searchSelector = 'input[type="search"]';
    this.cartCountSelector = '.counter-number';
    this.cartIconSelector = '.minicart-wrapper > a.showcart';
  }

  /**
   * Navigate to UK website
   */
  async navigateToUKWebsite() {
    await this.page.goto('https://www.perfectdraft.com/en-gb', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to country-specific website
   * @param {string} countryCode - Country code (e.g., 'GB', 'FR')
   */
  async navigateToCountry(countryCode) {
    const url = this.config.getCountryUrl(countryCode);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Check if navigation menu is visible
   * @returns {Promise<boolean>}
   */
  async isNavigationMenuVisible() {
    try {
      const element = this.page.locator(this.navigationSelector);
      return await element.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if menu item is visible
   * @param {string} menuItem - Menu item text
   * @returns {Promise<boolean>}
   */
  async isMenuItemVisible(menuItem) {
    try {
      const element = await this.page.$(`text=${menuItem}`);
      return element !== null && await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if search functionality is available
   * @returns {Promise<boolean>}
   */
  async isSearchFunctionalityAvailable() {
    // Wait for page to be fully loaded since Algolia search loads dynamically
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    try {
      const element = this.page.locator(this.searchSelector);
      return await element.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<string>}
   */
  async getCartItemCount() {
    try {
      const element = this.page.locator(this.cartCountSelector);
      await element.waitFor({ timeout: 5000 });
      const text = await element.textContent();
      return text?.trim() || '0';
    } catch {
      return '0';
    }
  }

  /**
   * Check if cart icon is visible
   * @returns {Promise<boolean>}
   */
  async isCartIconVisible() {
    try {
      const element = this.page.locator(this.cartIconSelector);
      return await element.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Navigate to section
   * @param {string} sectionName - Section name
   */
  async navigateToSection(sectionName) {
    if (sectionName === 'Kegs') {
      try {
        // First try direct navigation which is more reliable
        await this.page.goto('https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-kegs');
        await this.page.waitForLoadState('domcontentloaded');
        console.log('Successfully navigated directly to kegs page');
      } catch {
        // Fallback to clicking the navigation link
        try {
          // Use the specific main navigation link for kegs with force click
          const kegsLink = this.page.locator('a[data-menu="menu-605"]').first();
          await kegsLink.click({ force: true });
        } catch {
          // Try alternative navigation approaches
          await this.page.evaluate(() => {
            window.location.href = 'https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-kegs';
          });
        }
      }
    } else if (sectionName === 'Machines' || sectionName === 'PerfectDraft Machines') {
      try {
        // Use the specific link for machines
        const machinesLink = this.page.getByText('PerfectDraft Machines').first();
        await machinesLink.click({ force: true });
      } catch {
        // Direct navigation fallback
        await this.page.goto('https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-machines');
      }
    } else {
      // Fallback to text search for other sections
      try {
        const link = this.page.getByText(sectionName).first();
        await link.click({ force: true });
      } catch {
        console.log(`Could not navigate to section: ${sectionName}`);
      }
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow time for dynamic content to load
  }

  /**
   * Click on login/account link
   */
  async clickLoginLink() {
    const loginSelectors = [
      'text=Sign In',
      'text=Login',
      'text=Account',
      '[href*="login"]',
      '[href*="account"]',
      '.account-link'
    ];

    for (const selector of loginSelectors) {
      try {
        await this.page.click(selector);
        return;
      } catch {
        continue;
      }
    }
    throw new Error('Could not find login link');
  }

  /**
   * Accept cookies if banner is present
   */
  async acceptCookies() {
    const cookieSelectors = [
      '[data-testid="accept-cookies"]',
      '#onetrust-accept-btn-handler',
      '.cookie-accept',
      'text=Accept All',
      'text=Accept Cookies'
    ];

    for (const selector of cookieSelectors) {
      try {
        const button = this.page.locator(selector);
        if (await button.isVisible({ timeout: 3000 })) {
          await button.click();
          await this.page.waitForTimeout(500); // Wait for banner to disappear
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  }

  /**
   * Search for a product
   * @param {string} searchTerm - Search term
   */
  async searchForProduct(searchTerm) {
    const searchInput = this.page.locator(this.searchSelector);
    await searchInput.waitFor({ timeout: 5000 });

    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get featured products
   * @returns {Promise<Array>}
   */
  async getFeaturedProducts() {
    const productSelectors = [
      '.featured-products .product',
      '.product-grid .product-item',
      '[data-testid="product-card"]',
      '.product-card'
    ];

    for (const selector of productSelectors) {
      try {
        const products = await this.page.$$(selector);
        if (products.length > 0) {
          const productData = [];
          for (const product of products) {
            const name = await product.$eval('.product-name, .product-title, h3, h4', el => el.textContent?.trim());
            const price = await product.$eval('.price, .product-price', el => el.textContent?.trim());
            productData.push({ name, price });
          }
          return productData;
        }
      } catch {
        continue;
      }
    }
    return [];
  }

  /**
   * Check if promotional banner is visible
   * @returns {Promise<boolean>}
   */
  async isPromotionalBannerVisible() {
    try {
      const element = this.page.locator('.hero-banner');
      return await element.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Get page content for verification
   * @returns {Promise<string>}
   */
  async getPageContent() {
    return await this.page.textContent('body') || '';
  }

  /**
   * Get HTML language attribute
   * @returns {Promise<string|null>}
   */
  async getHtmlLang() {
    return await this.page.getAttribute('html', 'lang');
  }

  /**
   * Wait for country-specific URL
   * @param {string} urlPattern - URL pattern to wait for
   */
  async waitForCountryUrl(urlPattern) {
    await this.page.waitForURL(new RegExp(urlPattern));
  }
}

export default HomePage;
