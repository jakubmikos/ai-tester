// src/pages/product-catalog.page.js
import BasePage from './base.page.js';

/**
 * Product Catalog Page Object
 * Represents the product listing/catalog page
 */
class ProductCatalogPage extends BasePage {
  constructor(page) {
    super(page);

    // Specific selectors based on actual website inspection
    this.kegNavigationSelector = 'a.main-nav__link:has-text("Beer Kegs")';
    this.kegListSelector = '.result-wrapper';
    this.filterSelector = '.filter';
    this.sortSelector = '.sort';

    // Product information selectors
    this.productInfoSelectors = {
      image: 'img[itemprop="image"]',
      name: '.result-title',
      price: '.price',
      abv: '.attr-label__abv'
    };
  }

  /**
   * Navigate to kegs section
   */
  async navigateToKegsSection() {
    try {
      // First method: Click the navigation link
      const element = this.findElement(this.kegNavigationSelector);
      if (await element.isVisible({ timeout: 5000 })) {
        await element.click();
        await this.waitForPageLoad();
        return;
      }
    } catch (error) {
      console.log('Navigation link not found, navigating directly via URL');
    }
    
    // Direct navigation as primary method if link isn't visible
    await this.navigateTo('https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-kegs');
    await this.waitForPageLoad();
  }

  /**
   * Check if keg list is visible
   * @returns {Promise<boolean>}
   */
  async isKegListVisible() {
    try {
      // Use Playwright's built-in waiting with 30 second timeout
      await this.waitForElementToBeVisible(this.kegListSelector, 30000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get keg count
   * @returns {Promise<number>}
   */
  async getKegCount() {
    try {
      // Wait for at least one keg to be present
      const locator = this.page.locator(this.kegListSelector);
      await locator.first().waitFor({
        state: 'attached',
        timeout: 30000
      });

      return await locator.count();
    } catch {
      return 0;
    }
  }

  /**
   * Check if kegs display required information
   * @returns {Promise<boolean>}
   */
  async doKegsDisplayRequiredInformation() {
    const kegElements = await this.getKegElements();

    if (kegElements.length === 0) {
      return false;
    }

    // Check first few kegs for required information
    const kegsToCheck = Math.min(3, kegElements.length);

    for (let i = 0; i < kegsToCheck; i++) {
      const keg = kegElements[i];

      // Check for product image
      const hasImage = await this.hasProductImage(keg);

      // Check for beer name/title
      const hasName = await this.hasProductName(keg);

      // Check for price
      const hasPrice = await this.hasPriceInfo(keg);

      // Check for ABV (alcohol by volume)
      const hasABV = await this.hasABVInfo(keg);

      // If at least most information is present, consider it valid
      const infoCount = (hasImage ? 1 : 0) + (hasName ? 1 : 0) +
        (hasPrice ? 1 : 0) + (hasABV ? 1 : 0);

      if (infoCount < 3) { // At least 3 out of 4 pieces of info should be present
        return false;
      }
    }

    return true;
  }

  /**
   * Get keg elements
   * @returns {Promise<Array>}
   */
  async getKegElements() {
    const elements = this.page.locator(this.kegListSelector);
    const count = await elements.count();

    if (count > 0) {
      const elementArray = [];
      for (let i = 0; i < count; i++) {
        elementArray.push(elements.nth(i));
      }
      return elementArray;
    }

    return [];
  }

  /**
   * Check if product has image
   * @param {Object} kegElement - Locator for keg element
   * @returns {Promise<boolean>}
   */
  async hasProductImage(kegElement) {
    const image = kegElement.locator(this.productInfoSelectors.image);
    const count = await image.count();
    return count > 0 && await image.first().isVisible();
  }

  /**
   * Check if product has name
   * @param {Object} kegElement - Locator for keg element
   * @returns {Promise<boolean>}
   */
  async hasProductName(kegElement) {
    return await this.hasTextContent(kegElement, [this.productInfoSelectors.name]);
  }

  /**
   * Check if product has price info
   * @param {Object} kegElement - Locator for keg element
   * @returns {Promise<boolean>}
   */
  async hasPriceInfo(kegElement) {
    return await this.hasTextContent(kegElement, [this.productInfoSelectors.price], '£');
  }

  /**
   * Check if product has ABV info
   * @param {Object} kegElement - Locator for keg element
   * @returns {Promise<boolean>}
   */
  async hasABVInfo(kegElement) {
    return await this.hasTextContent(kegElement, [this.productInfoSelectors.abv], '%');
  }

  /**
   * Check if element has text content
   * @param {Object} kegElement - Locator for keg element
   * @param {Array} selectors - Array of selectors to try
   * @param {string} mustContain - Text that must be contained
   * @returns {Promise<boolean>}
   */
  async hasTextContent(kegElement, selectors, mustContain = null) {
    // Note: selectors is an array for compatibility, but should only have one element
    const selector = selectors[0];
    try {
      const element = kegElement.locator(selector);
      const count = await element.count();
      if (count > 0) {
        const text = await element.first().textContent();
        if (text && text.trim()) {
          if (mustContain === null || text.includes(mustContain)) {
            return true;
          }
        }
      }
    } catch {
      return false;
    }
    return false;
  }

  /**
   * Check if filters are available
   * @returns {Promise<boolean>}
   */
  async areFiltersAvailable() {
    try {
      // Check for filter elements - look for filter text which is more reliable
      const filterElement = this.page.getByText('Filter', { exact: false });
      const count = await filterElement.count();
      return count > 0 && await filterElement.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if sort options are available
   * @returns {Promise<boolean>}
   */
  async areSortOptionsAvailable() {
    try {
      // Check for sort elements - look for sort text which is more reliable
      const sortElement = this.page.getByText('Sort', { exact: false });
      const count = await sortElement.count();
      return count > 0 && await sortElement.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if machine type is visible
   * @param {string} machineType - Machine type to check
   * @returns {Promise<boolean>}
   */
  async isMachineTypeVisible(machineType) {
    try {
      // Look for product headings that contain the machine type
      const productHeadings = this.page.locator('h3');
      const headingCount = await productHeadings.count();

      for (let i = 0; i < headingCount; i++) {
        const heading = productHeadings.nth(i);
        if (await heading.isVisible()) {
          const text = await heading.textContent();
          if (text) {
            if (machineType === 'PerfectDraft') {
              // For standard PerfectDraft, find headings that contain "PerfectDraft" 
              // but NOT "Pro" or "Black"
              if (text.includes('PerfectDraft') &&
                !text.includes('Pro') &&
                !text.includes('Black')) {
                return true;
              }
            } else if (machineType === 'PerfectDraft Pro') {
              // Look for "PerfectDraft Pro" in headings
              if (text.includes('PerfectDraft Pro')) {
                return true;
              }
            } else if (machineType === 'PerfectDraft Black') {
              // Look for "PerfectDraft Black" in headings
              if (text.includes('PerfectDraft Black')) {
                return true;
              }
            }
          }
        }
      }
      return false;
    } catch (error) {
      console.log(`Error checking machine type visibility: ${error}`);
      return false;
    }
  }

  /**
   * Check if comparison link is visible
   * @returns {Promise<boolean>}
   */
  async isComparisonLinkVisible() {
    try {
      const comparisonLink = this.page.locator('#dy-banner-104346742');
      const count = await comparisonLink.count();
      return count > 0 && await comparisonLink.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click on first machine
   */
  async clickOnFirstMachine() {
    try {
      // Click on the actual link element instead of the content div
      const firstMachineLink = this.page.locator('a.result.product__link').first();
      await firstMachineLink.click();
      await this.waitForPageLoad();
    } catch (error) {
      throw new Error(`Failed to click on first machine: ${error.message}`);
    }
  }

  /**
   * Check if specifications are visible
   * @returns {Promise<boolean>}
   */
  async areSpecificationsVisible() {
    try {
      const specsContainer = this.page.locator('.specs');
      const count = await specsContainer.count();
      return count > 0 && await specsContainer.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if keg size specification is visible
   * @returns {Promise<boolean>}
   */
  async isKegSizeSpecificationVisible() {
    try {
      const kegSizeElement = this.page.locator('[data-code="bottle_size"]');
      const count = await kegSizeElement.count();
      return count > 0 && await kegSizeElement.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click on product by name
   * @param {string} productName - Product name
   */
  async clickOnProductByName(productName) {
    try {
      // First wait for products to load
      await this.waitForElementToBeVisible('.result-wrapper', 10000);

      // Handle specific product types
      if (productName.includes('Stella')) {
        // Find link containing "stella-artois" in href
        const productLink = this.page.locator('a.result.product__link[href*="stella-artois"]').first();
        await productLink.click();
      } else if (productName.includes('Camden')) {
        // Find link containing "camden" in href
        const productLink = this.page.locator('a.result.product__link[href*="camden"]').first();
        await productLink.click();
      } else {
        // For other products, try to find by partial name match in href
        const searchName = productName.split(' ')[0].toLowerCase();
        const productLink = this.page.locator(`a.result.product__link[href*="${searchName}"]`).first();
        await productLink.click();
      }

      await this.waitForPageLoad();
    } catch (error) {
      throw new Error(`Failed to click on product '${productName}': ${error.message}`);
    }
  }

  /**
   * Add product to cart
   * @param {string} productName - Product name
   */
  async addProductToCart(productName) {
    // Wait for products to load
    await this.waitForElementToBeVisible('.result.product__link', 10000);

    let addToCartButton;

    if (productName.includes('Stella')) {
      // Find Stella Artois add to cart button by data attributes
      addToCartButton = this.page.locator('button[data-name*="Stella Artois"]');
    } else if (productName.includes('Corona')) {
      addToCartButton = this.page.locator('button[data-name*="Corona"]');
    } else if (productName.includes('Camden')) {
      addToCartButton = this.page.locator('button[data-name*="Camden"]');
    } else {
      // For other products, try to find by partial name match
      const searchName = productName.split(' ')[0];
      addToCartButton = this.page.locator(`button[data-name*="${searchName}"]`);
    }

    const count = await addToCartButton.count();
    if (count > 0) {
      await addToCartButton.first().click();
      return;
    }
  }

  /**
   * Apply filter
   * @param {string} filterType - Type of filter
   * @param {string} filterValue - Value to filter by
   */
  async applyFilter(filterType, filterValue) {
    try {
      // Try to find filter dropdown or checkbox
      const filterElement = this.page.locator(`[data-filter="${filterType}"], .filter-${filterType.toLowerCase()}`);

      if (await filterElement.isVisible()) {
        // If it's a dropdown
        if (await filterElement.locator('select').count() > 0) {
          await filterElement.locator('select').selectOption(filterValue);
        }
        // If it's a checkbox/radio
        else if (await filterElement.locator(`input[value="${filterValue}"]`).count() > 0) {
          await filterElement.locator(`input[value="${filterValue}"]`).check();
        }
        // If it's a clickable option
        else {
          const optionElement = filterElement.getByText(filterValue);
          if (await optionElement.isVisible()) {
            await optionElement.click();
          }
        }

        // Wait for filter to apply
        await this.page.waitForTimeout(1000);
        await this.waitForPageLoad();
      }
    } catch (error) {
      throw new Error(`Failed to apply filter ${filterType}=${filterValue}: ${error.message}`);
    }
  }

  /**
   * Sort products
   * @param {string} sortOption - Sort option (e.g., 'price', 'name', 'popularity')
   */
  async sortProducts(sortOption) {
    try {
      // Find sort dropdown or clickable element
      const sortElement = this.page.getByText('Sort', { exact: false }).first();
      
      if (await sortElement.isVisible()) {
        await sortElement.click();
        
        // Click on the specific sort option
        const option = this.page.getByText(sortOption, { exact: false });
        if (await option.isVisible()) {
          await option.click();
        }

        // Wait for sort to apply
        await this.page.waitForTimeout(1000);
        await this.waitForPageLoad();
      } else {
        throw new Error(`Could not find sort element`);
      }
    } catch (error) {
      throw new Error(`Failed to sort products by ${sortOption}: ${error.message}`);
    }
  }
}

export default ProductCatalogPage;
