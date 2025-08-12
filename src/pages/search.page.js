// src/pages/search.page.js
const BasePage = require('./base.page');

/**
 * Search Page Object
 * Handles search functionality and search results
 */
class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Search-specific selectors verified from actual website
    this.selectors = {
      // Search form elements
      searchInput: '#autocomplete-0-input, input[type="search"], input[placeholder*="Search"]',
      searchButton: '.aa-SubmitButton, button[type="submit"], .search-button',
      searchForm: '.aa-Form, .search-form, form[action*="search"]',
      
      // Search results
      searchResultsHeader: 'h1, .page-title, .search-results-title',
      productResults: '.products, .search-results, .result-wrapper',
      resultItem: '.product-item, .result-item, .search-result-item',
      
      // No results
      noResultsMessage: '.no-results, .empty-results, .search-no-results',
      
      // Filters and sorting
      filterSection: '.sidebar, [class*="filter"], .search-filters',
      sortDropdown: '#sorter, select[name*="sort"], [data-role="sorter"]',
      
      // Search suggestions
      searchSuggestions: '.search-suggestions, .autocomplete-suggestions, .aa-Panel',
      suggestionItem: '.suggestion-item, .aa-Item, .autocomplete-suggestion',
      
      // Product types in results
      kegIndicator: '[data-product-type="keg"], .product-keg, [href*="keg"]',
      bundleIndicator: '[data-product-type="bundle"], .product-bundle, [href*="bundle"]',
      machineIndicator: '[data-product-type="machine"], .product-machine, [href*="machine"]'
    };
  }

  /**
   * Enter search term in search box
   * @param {string} searchTerm - Term to search for
   */
  async enterSearchTerm(searchTerm) {
    try {
      await this.waitForElement(this.selectors.searchInput, 10000);
      await this.clearAndType(this.selectors.searchInput, searchTerm);
      console.log(`Entered search term: ${searchTerm}`);
    } catch (error) {
      throw new Error(`Failed to enter search term: ${error.message}`);
    }
  }

  /**
   * Click search button
   */
  async clickSearchButton() {
    try {
      await this.click(this.selectors.searchButton);
      await this.waitForPageLoad();
      console.log('Search button clicked');
    } catch (error) {
      throw new Error(`Failed to click search button: ${error.message}`);
    }
  }

  /**
   * Perform search (enter term + click search)
   * @param {string} searchTerm - Term to search for
   */
  async performSearch(searchTerm) {
    await this.enterSearchTerm(searchTerm);
    await this.clickSearchButton();
  }

  /**
   * Check if search results are visible
   * @returns {Promise<boolean>}
   */
  async areSearchResultsVisible() {
    try {
      // Check for search results header
      const hasHeader = await this.isElementVisible(this.selectors.searchResultsHeader);
      if (hasHeader) {
        const headerText = await this.getText(this.selectors.searchResultsHeader);
        if (headerText.toLowerCase().includes('search results')) {
          return true;
        }
      }

      // Check for product results container
      const hasResults = await this.isElementVisible(this.selectors.productResults);
      
      // Check page text for search results indication
      const pageText = await this.page.textContent('body') || '';
      const hasSearchResultsText = pageText.includes('Search results for:') || 
                                  pageText.includes('results found') ||
                                  pageText.includes('showing results');

      return hasResults || hasSearchResultsText;
    } catch {
      return false;
    }
  }

  /**
   * Check if search results contain the search term
   * @param {string} searchTerm - Term to check for
   * @returns {Promise<boolean>}
   */
  async doSearchResultsContainTerm(searchTerm) {
    try {
      const pageText = await this.page.textContent('body') || '';
      
      // Check if results contain the search term or related products
      return pageText.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pageText.includes(`Search results for: '${searchTerm}'`) ||
             pageText.includes(`Results for "${searchTerm}"`);
    } catch {
      return false;
    }
  }

  /**
   * Check if results include both kegs and bundles
   * @returns {Promise<boolean>}
   */
  async doResultsIncludeBothKegsAndBundles() {
    try {
      const pageText = await this.page.textContent('body') || '';
      
      // Look for evidence of kegs
      const hasKegs = pageText.toLowerCase().includes('keg') ||
                     pageText.includes('6L') ||
                     (await this.getElementCount(this.selectors.kegIndicator)) > 0;
      
      // Look for evidence of bundles/machines
      const hasBundles = pageText.toLowerCase().includes('bundle') ||
                        pageText.toLowerCase().includes('machine') ||
                        pageText.toLowerCase().includes('starter') ||
                        (await this.getElementCount(this.selectors.bundleIndicator)) > 0 ||
                        (await this.getElementCount(this.selectors.machineIndicator)) > 0;

      return hasKegs && hasBundles;
    } catch {
      return false;
    }
  }

  /**
   * Check if filters are available on search results
   * @returns {Promise<boolean>}
   */
  async areFiltersAvailable() {
    try {
      // Check for filter elements
      const hasFilterSection = await this.isElementVisible(this.selectors.filterSection);
      if (hasFilterSection) {
        return true;
      }

      // Check for filter-related text
      const pageText = await this.page.textContent('body') || '';
      return pageText.toLowerCase().includes('filter') ||
             pageText.includes('Shop By') ||
             pageText.toLowerCase().includes('category') ||
             pageText.includes('Product Type');
    } catch {
      return false;
    }
  }

  /**
   * Check if no results message is visible
   * @returns {Promise<boolean>}
   */
  async isNoResultsMessageVisible() {
    try {
      // Check for specific no results elements
      const hasNoResultsElement = await this.isElementVisible(this.selectors.noResultsMessage);
      if (hasNoResultsElement) {
        return true;
      }

      // Check page text for no results messages
      const pageText = await this.page.textContent('body') || '';
      const noResultsTexts = [
        'Your search returned no results',
        'No results found',
        'We couldn\'t find any results',
        'Sorry, no results',
        '0 results',
        'No products found'
      ];

      return noResultsTexts.some(text => pageText.includes(text));
    } catch {
      return false;
    }
  }

  /**
   * Check if search suggestions are visible
   * @returns {Promise<boolean>}
   */
  async areSearchSuggestionsVisible() {
    try {
      const hasSuggestions = await this.isElementVisible(this.selectors.searchSuggestions);
      if (hasSuggestions) {
        return true;
      }

      // Check page text for suggestions
      const pageText = await this.page.textContent('body') || '';
      return pageText.includes('Did you mean') ||
             pageText.includes('Try searching for') ||
             pageText.includes('Popular searches') ||
             pageText.includes('Suggested searches');
    } catch {
      return false;
    }
  }

  /**
   * Get search suggestions
   * @returns {Promise<Array<string>>}
   */
  async getSearchSuggestions() {
    try {
      const suggestions = [];
      const suggestionElements = await this.page.locator(this.selectors.suggestionItem).all();
      
      for (const element of suggestionElements) {
        const text = await element.textContent();
        if (text && text.trim()) {
          suggestions.push(text.trim());
        }
      }
      
      return suggestions;
    } catch {
      return [];
    }
  }

  /**
   * Get number of search results
   * @returns {Promise<number>}
   */
  async getNumberOfResults() {
    try {
      return await this.getElementCount(this.selectors.resultItem);
    } catch {
      return 0;
    }
  }

  /**
   * Get search results details
   * @returns {Promise<Array>}
   */
  async getSearchResultsDetails() {
    const results = [];
    
    try {
      const resultElements = await this.page.locator(this.selectors.resultItem).all();
      
      for (let i = 0; i < Math.min(resultElements.length, 10); i++) { // Limit to first 10 results
        const element = resultElements[i];
        
        const name = await this.getResultItemText(element, '.product-name, .result-title, h3, h4');
        const price = await this.getResultItemText(element, '.price, .product-price');
        const link = await this.getResultItemAttribute(element, 'a', 'href');
        
        results.push({
          name,
          price,
          link,
          index: i
        });
      }
    } catch (error) {
      console.error('Error getting search results details:', error);
    }
    
    return results;
  }

  /**
   * Get text from result item
   * @param {Object} resultElement - Result element locator
   * @param {string} selector - Selector within result
   * @returns {Promise<string>}
   */
  async getResultItemText(resultElement, selector) {
    try {
      const element = resultElement.locator(selector);
      const count = await element.count();
      if (count > 0) {
        const text = await element.first().textContent();
        return text?.trim() || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Get attribute from result item
   * @param {Object} resultElement - Result element locator
   * @param {string} selector - Selector within result
   * @param {string} attribute - Attribute to get
   * @returns {Promise<string>}
   */
  async getResultItemAttribute(resultElement, selector, attribute) {
    try {
      const element = resultElement.locator(selector);
      const count = await element.count();
      if (count > 0) {
        const value = await element.first().getAttribute(attribute);
        return value || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Click on search result by index
   * @param {number} index - Index of result to click
   */
  async clickSearchResult(index) {
    try {
      const resultElements = this.page.locator(this.selectors.resultItem);
      const result = resultElements.nth(index);
      
      const link = result.locator('a').first();
      await link.click();
      await this.waitForPageLoad();
      
      console.log(`Clicked search result at index: ${index}`);
    } catch (error) {
      throw new Error(`Failed to click search result: ${error.message}`);
    }
  }

  /**
   * Filter search results
   * @param {string} filterType - Type of filter
   * @param {string} filterValue - Value to filter by
   */
  async filterResults(filterType, filterValue) {
    try {
      const filterSelectors = [
        `[data-filter="${filterType}"]`,
        `.filter-${filterType.toLowerCase()}`,
        `input[name*="${filterType}"][value="${filterValue}"]`,
        `label:has-text("${filterValue}")`
      ];

      for (const selector of filterSelectors) {
        const filterElement = this.page.locator(selector);
        if (await filterElement.count() > 0) {
          await filterElement.first().click();
          await this.page.waitForTimeout(1000); // Wait for filter to apply
          console.log(`Applied filter: ${filterType} = ${filterValue}`);
          return;
        }
      }

      console.error(`Could not find filter: ${filterType} = ${filterValue}`);
    } catch (error) {
      throw new Error(`Failed to filter results: ${error.message}`);
    }
  }

  /**
   * Sort search results
   * @param {string} sortOption - Sort option (e.g., 'price', 'name', 'relevance')
   */
  async sortResults(sortOption) {
    try {
      const sortDropdown = this.page.locator(this.selectors.sortDropdown);
      
      if (await sortDropdown.count() > 0) {
        await sortDropdown.selectOption(sortOption);
        await this.page.waitForTimeout(1000); // Wait for sort to apply
        console.log(`Sorted results by: ${sortOption}`);
      }
    } catch (error) {
      console.error(`Failed to sort results: ${error.message}`);
    }
  }

  /**
   * Clear search and enter new term
   * @param {string} newSearchTerm - New search term
   */
  async clearAndSearch(newSearchTerm) {
    try {
      const searchInput = this.page.locator(this.selectors.searchInput);
      await searchInput.clear();
      await this.performSearch(newSearchTerm);
    } catch (error) {
      throw new Error(`Failed to clear and search: ${error.message}`);
    }
  }
}

module.exports = SearchPage;