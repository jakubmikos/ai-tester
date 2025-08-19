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
      // Use more specific selector targeting anchor elements only
      const machinesLink = this.page.locator('a').getByText('PerfectDraft Machines');
      await machinesLink.click({ force: true });

      // Wait for navigation to complete - bundles page specific content
      await this.page.locator('.ais-InfiniteHits').waitFor();
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
    // Use the specific login selector for PerfectDraft
    const loginLink = this.page.locator('a[href*="/customer/account"]').first();
    
    if (await loginLink.isVisible({ timeout: 5000 })) {
      await loginLink.click();
    } else {
      throw new Error('Could not find login link');
    }
  }

  /**
   * Accept cookies if banner is present
   */
  async acceptCookies() {
    // Use the specific OneTrust cookie consent button
    const cookieButton = this.page.locator('#onetrust-accept-btn-handler');
    
    if (await cookieButton.isVisible({ timeout: 3000 })) {
      await cookieButton.click();
      await this.page.waitForTimeout(500); // Wait for banner to disappear
      return true;
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
    // Use specific selector for product cards on PerfectDraft homepage
    const products = await this.page.$$('.product-item');
    
    if (products.length > 0) {
      const productData = [];
      for (const product of products) {
        try {
          const name = await product.$eval('.product-item-name', el => el.textContent?.trim());
          const price = await product.$eval('.price', el => el.textContent?.trim());
          productData.push({ name, price });
        } catch {
          // Skip this product if selectors don't match
          continue;
        }
      }
      return productData;
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
