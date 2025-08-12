// src/pages/product-detail.page.js
const BasePage = require('./base.page');

/**
 * Product Detail Page Object
 * Handles individual product detail pages
 */
class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      // Product main information
      productImage: 'img[alt*="Stella"], img[alt*="Keg"], .product-image img, .main-product-image',
      productTitle: 'h1, .product-title, .page-title',
      productPrice: '[class*="price"], .price-wrapper, .product-price',
      
      // Product details
      productSpecs: '.specs, .product-specs, .specifications, .product-attributes',
      productDescription: '.product-description, .description, .product-info-description',
      
      // Stock and availability
      stockStatus: '.stock-status, .availability, .in-stock, .out-of-stock',
      
      // Actions
      addToCartButton: 'button[title*="Add"], button:has-text("Add to Cart"), .add-to-cart',
      quantityInput: 'input[name*="qty"], input[type="number"], .qty',
      quantityIncrease: '.qty-increase, .quantity-plus, button[aria-label*="increase"]',
      quantityDecrease: '.qty-decrease, .quantity-minus, button[aria-label*="decrease"]',
      
      // Reviews
      reviewsSection: '.reviews, .product-reviews, .customer-reviews',
      reviewItem: '.review, .review-item, .customer-review',
      
      // Related products
      relatedProducts: '.related-products, .cross-sell, .recommendations',
      relatedProductItem: '.related-product, .cross-sell-item, .recommendation-item',
      
      // Product tabs
      productTabs: '.product-tabs, .tab-navigation, .product-info-tabs',
      productTab: '.tab, .tab-item, .product-tab',
      
      // Breadcrumbs
      breadcrumbs: '.breadcrumbs, .breadcrumb, .navigation-path',
      
      // Product gallery
      productGallery: '.product-gallery, .image-gallery, .product-images',
      galleryThumbnail: '.gallery-thumbnail, .image-thumb, .product-image-thumb',
      
      // Product options/variants
      productOptions: '.product-options, .product-variants, .configurable-options',
      
      // Social sharing
      socialShare: '.social-share, .share-buttons, .product-social',
      
      // Wishlist
      wishlistButton: '.wishlist, .add-to-wishlist, button[title*="wishlist"]',
      
      // Comparison
      compareButton: '.compare, .add-to-compare, button[title*="compare"]'
    };
  }

  /**
   * Check if product detail page is visible
   * @returns {Promise<boolean>}
   */
  async isProductDetailPageVisible() {
    try {
      const hasTitle = await this.isElementVisible(this.selectors.productTitle);
      const hasImage = await this.isProductImageVisible();
      return hasTitle && hasImage;
    } catch {
      return false;
    }
  }

  /**
   * Check if product images are visible
   * @returns {Promise<boolean>}
   */
  async isProductImageVisible() {
    try {
      // Check for specific product image selectors
      if (await this.isElementVisible(this.selectors.productImage)) {
        return true;
      }

      // Check for any image that contains product-related keywords in alt text
      const images = await this.page.locator('img').all();
      for (const image of images) {
        if (await image.isVisible()) {
          const alt = await image.getAttribute('alt') || '';
          const src = await image.getAttribute('src') || '';
          
          const productKeywords = ['stella', 'keg', 'perfectdraft', 'beer', 'lager'];
          const hasProductKeyword = productKeywords.some(keyword => 
            alt.toLowerCase().includes(keyword) || src.toLowerCase().includes(keyword)
          );
          
          if (hasProductKeyword) {
            return true;
          }
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Check if full product description is visible
   * @returns {Promise<boolean>}
   */
  async isFullDescriptionVisible() {
    try {
      // Check for description section
      if (await this.isElementVisible(this.selectors.productDescription)) {
        return true;
      }

      // Check page content for descriptive text
      const pageText = await this.page.textContent('body') || '';
      const hasDescriptiveText = pageText.includes('brewmasters') ||
                                pageText.includes('Description') ||
                                pageText.includes('taste') ||
                                pageText.includes('aroma') ||
                                pageText.length > 500; // Substantial content

      return hasDescriptiveText;
    } catch {
      return false;
    }
  }

  /**
   * Check if ABV and volume information is visible
   * @returns {Promise<boolean>}
   */
  async isABVAndVolumeVisible() {
    try {
      // Check for specs section
      if (await this.isElementVisible(this.selectors.productSpecs)) {
        return true;
      }

      // Check page text for ABV and volume patterns
      const pageText = await this.page.textContent('body') || '';
      const hasABV = pageText.includes('ABV') || 
                    pageText.includes('%') ||
                    /\d+\.\d+%/.test(pageText);
                    
      const hasVolume = pageText.includes('6L') ||
                       pageText.includes('litre') ||
                       pageText.includes('volume') ||
                       /\d+L/.test(pageText);

      return hasABV || hasVolume;
    } catch {
      return false;
    }
  }

  /**
   * Check if price information is visible
   * @returns {Promise<boolean>}
   */
  async isPriceInformationVisible() {
    try {
      // Check for price element
      if (await this.isElementVisible(this.selectors.productPrice)) {
        return true;
      }

      // Check page text for price patterns
      const pageText = await this.page.textContent('body') || '';
      return pageText.includes('£') && 
             (pageText.includes('.') || 
              pageText.includes('per pint') ||
              /£\d+/.test(pageText));
    } catch {
      return false;
    }
  }

  /**
   * Check if stock availability is visible
   * @returns {Promise<boolean>}
   */
  async isStockAvailabilityVisible() {
    try {
      // Check for stock status element
      if (await this.isElementVisible(this.selectors.stockStatus)) {
        return true;
      }

      // Check page text for stock information
      const pageText = await this.page.textContent('body') || '';
      const stockTexts = [
        'In stock',
        'Out of stock',
        'Available',
        'Unavailable',
        'Limited stock',
        'Low stock'
      ];

      return stockTexts.some(text => pageText.includes(text));
    } catch {
      return false;
    }
  }

  /**
   * Check if customer reviews are visible
   * @returns {Promise<boolean>}
   */
  async isCustomerReviewsVisible() {
    try {
      // Check for reviews section
      if (await this.isElementVisible(this.selectors.reviewsSection)) {
        return true;
      }

      // Check page text for review-related content
      const pageText = await this.page.textContent('body') || '';
      const reviewTexts = [
        'Review',
        'review',
        'Rating',
        'rating',
        'Customer feedback',
        'Customer opinion'
      ];

      return reviewTexts.some(text => pageText.includes(text));
    } catch {
      return false;
    }
  }

  /**
   * Check if Add to Cart button is visible
   * @returns {Promise<boolean>}
   */
  async isAddToCartButtonVisible() {
    try {
      return await this.isElementVisible(this.selectors.addToCartButton);
    } catch {
      return false;
    }
  }

  /**
   * Check if related products are visible
   * @returns {Promise<boolean>}
   */
  async isRelatedProductsVisible() {
    try {
      return await this.isElementVisible(this.selectors.relatedProducts);
    } catch {
      return false;
    }
  }

  /**
   * Get product title
   * @returns {Promise<string>}
   */
  async getProductTitle() {
    try {
      return await this.getText(this.selectors.productTitle);
    } catch {
      return '';
    }
  }

  /**
   * Get product price
   * @returns {Promise<string>}
   */
  async getProductPrice() {
    try {
      return await this.getText(this.selectors.productPrice);
    } catch {
      return '';
    }
  }

  /**
   * Get product description
   * @returns {Promise<string>}
   */
  async getProductDescription() {
    try {
      return await this.getText(this.selectors.productDescription);
    } catch {
      return '';
    }
  }

  /**
   * Get stock status
   * @returns {Promise<string>}
   */
  async getStockStatus() {
    try {
      const stockElement = this.page.locator(this.selectors.stockStatus);
      if (await stockElement.count() > 0) {
        return await stockElement.first().textContent() || '';
      }

      // Check page text for stock status
      const pageText = await this.page.textContent('body') || '';
      if (pageText.includes('In stock')) return 'In stock';
      if (pageText.includes('Out of stock')) return 'Out of stock';
      if (pageText.includes('Available')) return 'Available';
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Add product to cart
   * @param {number} quantity - Quantity to add (default: 1)
   */
  async addToCart(quantity = 1) {
    try {
      // Set quantity if different from 1
      if (quantity > 1) {
        await this.setQuantity(quantity);
      }

      // Click add to cart button
      const addToCartButton = this.page.locator(this.selectors.addToCartButton);
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        console.log(`Added product to cart with quantity: ${quantity}`);
        
        // Wait for add to cart to complete
        await this.page.waitForTimeout(2000);
      } else {
        throw new Error('Add to Cart button not found or not visible');
      }
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }

  /**
   * Set product quantity
   * @param {number} quantity - Quantity to set
   */
  async setQuantity(quantity) {
    try {
      const quantityInput = this.page.locator(this.selectors.quantityInput);
      if (await quantityInput.count() > 0) {
        await quantityInput.fill(quantity.toString());
      }
    } catch (error) {
      console.error('Error setting quantity:', error.message);
    }
  }

  /**
   * Increase quantity by clicking plus button
   */
  async increaseQuantity() {
    try {
      const increaseButton = this.page.locator(this.selectors.quantityIncrease);
      if (await increaseButton.isVisible()) {
        await increaseButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      console.error('Error increasing quantity:', error.message);
    }
  }

  /**
   * Decrease quantity by clicking minus button
   */
  async decreaseQuantity() {
    try {
      const decreaseButton = this.page.locator(this.selectors.quantityDecrease);
      if (await decreaseButton.isVisible()) {
        await decreaseButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error.message);
    }
  }

  /**
   * Click on related product
   * @param {number} index - Index of related product to click
   */
  async clickRelatedProduct(index) {
    try {
      const relatedProducts = this.page.locator(this.selectors.relatedProductItem);
      const product = relatedProducts.nth(index);
      
      if (await product.isVisible()) {
        await product.click();
        await this.waitForPageLoad();
        console.log(`Clicked related product at index: ${index}`);
      }
    } catch (error) {
      throw new Error(`Failed to click related product: ${error.message}`);
    }
  }

  /**
   * Get related products information
   * @returns {Promise<Array>}
   */
  async getRelatedProducts() {
    const products = [];
    
    try {
      const relatedElements = await this.page.locator(this.selectors.relatedProductItem).all();
      
      for (let i = 0; i < Math.min(relatedElements.length, 5); i++) { // Limit to first 5
        const element = relatedElements[i];
        
        const name = await this.getItemText(element, '.product-name, h3, h4');
        const price = await this.getItemText(element, '.price, .product-price');
        const link = await this.getItemAttribute(element, 'a', 'href');
        
        products.push({
          name,
          price,
          link,
          index: i
        });
      }
    } catch (error) {
      console.error('Error getting related products:', error);
    }
    
    return products;
  }

  /**
   * Helper method to get text from element within parent
   * @param {Object} parent - Parent element
   * @param {string} selector - Child selector
   * @returns {Promise<string>}
   */
  async getItemText(parent, selector) {
    try {
      const element = parent.locator(selector);
      if (await element.count() > 0) {
        return await element.first().textContent() || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Helper method to get attribute from element within parent
   * @param {Object} parent - Parent element
   * @param {string} selector - Child selector
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>}
   */
  async getItemAttribute(parent, selector, attribute) {
    try {
      const element = parent.locator(selector);
      if (await element.count() > 0) {
        return await element.first().getAttribute(attribute) || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Navigate back to product listing
   */
  async goBackToListing() {
    try {
      // Try breadcrumb navigation first
      const breadcrumbs = this.page.locator(this.selectors.breadcrumbs);
      if (await breadcrumbs.count() > 0) {
        const listingLink = breadcrumbs.locator('a').nth(-2); // Second to last link
        if (await listingLink.isVisible()) {
          await listingLink.click();
          await this.waitForPageLoad();
          return;
        }
      }

      // Fallback: use browser back
      await this.goBack();
    } catch (error) {
      console.error('Error navigating back to listing:', error.message);
    }
  }
}

module.exports = ProductDetailPage;