// src/pages/store-locator.page.js
import BasePage from './base.page.js';

/**
 * Store Locator Page Object
 * Represents the community store locator functionality
 */
class StoreLocatorPage extends BasePage {
  constructor(page) {
    super(page);

    // Store locator specific selectors
    this.selectors = {
      storeLocatorLink: 'a[href*="community-store"]',
      postcodeInput: 'input[name="postcode"]',
      searchButton: 'button[type="submit"]:has-text("Search")',
      storeResults: '.store-result',
      storeName: '.store-name',
      storeAddress: '.store-address',
      storeDistance: '.store-distance',
      openingHours: '.opening-hours',
      storeServices: '.store-services',
      directionsButton: 'button:has-text("Directions")'
    };
  }

  /**
   * Navigate to store locator
   */
  async navigateToStoreLocator() {
    try {
      // First try clicking the navigation link
      const storeLink = this.page.locator(this.selectors.storeLocatorLink);
      if (await storeLink.isVisible({ timeout: 5000 })) {
        await storeLink.click();
        await this.waitForPageLoad();
        return;
      }
    } catch (error) {
      console.log('Store locator link not found, navigating directly');
    }
    
    // Direct navigation if link not found
    await this.page.goto('https://www.perfectdraft.com/en-gb/community-stores');
    await this.waitForPageLoad();
  }

  /**
   * Enter postcode in search field
   * @param {string} postcode - Postcode to search
   */
  async enterPostcode(postcode) {
    const postcodeInput = this.page.locator(this.selectors.postcodeInput);
    await postcodeInput.waitFor({ state: 'visible', timeout: 5000 });
    await postcodeInput.fill(postcode);
  }

  /**
   * Click search button
   */
  async clickSearch() {
    const searchButton = this.page.locator(this.selectors.searchButton);
    await searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get store count from results
   * @returns {Promise<number>}
   */
  async getStoreCount() {
    try {
      const stores = this.page.locator(this.selectors.storeResults);
      await stores.first().waitFor({ state: 'visible', timeout: 10000 });
      return await stores.count();
    } catch {
      return 0;
    }
  }

  /**
   * Check if store information is displayed
   * @returns {Promise<boolean>}
   */
  async isStoreInformationDisplayed() {
    try {
      const hasStoreName = await this.page.locator(this.selectors.storeName).count() > 0;
      const hasStoreAddress = await this.page.locator(this.selectors.storeAddress).count() > 0;
      const hasStoreDistance = await this.page.locator(this.selectors.storeDistance).count() > 0;
      
      return hasStoreName && hasStoreAddress && hasStoreDistance;
    } catch {
      return false;
    }
  }

  /**
   * Check if additional store details are displayed
   * @returns {Promise<boolean>}
   */
  async areAdditionalDetailsDisplayed() {
    try {
      const hasOpeningHours = await this.page.locator(this.selectors.openingHours).count() > 0;
      const hasStoreServices = await this.page.locator(this.selectors.storeServices).count() > 0;
      
      return hasOpeningHours && hasStoreServices;
    } catch {
      return false;
    }
  }

  /**
   * Get directions button count
   * @returns {Promise<number>}
   */
  async getDirectionsButtonCount() {
    try {
      const directionsButtons = this.page.locator(this.selectors.directionsButton);
      return await directionsButtons.count();
    } catch {
      return 0;
    }
  }
}

export default StoreLocatorPage;