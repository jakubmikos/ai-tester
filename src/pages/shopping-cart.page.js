// src/pages/shopping-cart.page.js
const BasePage = require('./base.page');

/**
 * Shopping Cart Page Object
 * Represents the shopping cart functionality
 */
class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Cart selectors - updated based on PerfectDraft website inspection
    this.selectors = {
      cartIcon: '.counter.qty, .minicart-wrapper, .cart-icon, button:has-text("£")',
      cartCounter: '.counter.qty .counter-number, .counter-number, .badge',
      emptyCartMessage: ':has-text("Your cart is empty"), :has-text("You have no items")',
      cartItems: '.minicart-items .product-item, .cart-item, .product',
      productName: '.product-name, .product-item-name, .item-name',
      productImage: '.product-image img, .item-image img',
      productQuantity: 'input[type="number"][name="quantity"]',
      quantityIncreaseButton: 'button.cart-product-add',
      quantityDecreaseButton: 'button.cart-product-subtract',
      productPrice: '.price, .item-price, .subtotal',
      removeButton: 'button.js--button:has-text("Remove Item")',
      updateButton: '.action.update, .update-item, button:has-text("Update")',
      viewCartButton: '.action.viewcart, .view-cart, button:has-text("View Cart")',
      cartDropdown: '.minicart-content, .cart-dropdown, .dropdown-menu, div[role="dialog"]',
      cartTotal: '.subtotal .price, .total-price, .grand-total .price',
      confirmationMessage: '.message.success, .alert.success, .notification.success',
      checkoutButton: '.action.primary.checkout, .checkout-button, button:has-text("Checkout")',
      proceedToCheckoutButton: '.action.primary.checkout, .checkout-btn, button:has-text("Proceed")'
    };
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    try {
      // Check for specific empty cart message from the website
      const emptyCartSelectors = [
        ':has-text("Your basket is currently empty")',
        ':has-text("Your cart is empty")',
        ':has-text("You have no items")',
        this.selectors.emptyCartMessage
      ];
      
      for (const selector of emptyCartSelectors) {
        try {
          if (await this.page.locator(selector).isVisible()) {
            return true;
          }
        } catch {
          continue;
        }
      }

      // Also check if cart counter shows 0
      const counter = await this.getCartItemCount();
      return counter === '0' || counter === '';
    } catch {
      return true; // Assume empty if we can't determine
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<string>}
   */
  async getCartItemCount() {
    try {
      const counter = this.page.locator(this.selectors.cartCounter);
      if (await counter.isVisible()) {
        const text = await counter.textContent();
        return text?.trim() || '0';
      }
      return '0';
    } catch {
      return '0';
    }
  }

  /**
   * Open cart dropdown/view cart
   */
  async openCart() {
    try {
      // Try to click cart icon first
      await this.page.click(this.selectors.cartIcon);
      
      // Wait for cart dropdown to appear
      await this.page.waitForSelector(this.selectors.cartDropdown, { timeout: 5000 });
    } catch {
      // Try view cart button if dropdown doesn't work
      try {
        await this.page.click(this.selectors.viewCartButton);
      } catch {
        // Navigate directly to cart page
        await this.page.goto('/checkout/cart');
      }
    }
  }

  /**
   * View full cart page
   */
  async viewFullCart() {
    try {
      await this.page.click(this.selectors.viewCartButton);
      await this.waitForPageLoad();
    } catch {
      // Direct navigation fallback
      await this.page.goto('/checkout/cart');
      await this.waitForPageLoad();
    }
  }

  /**
   * Get number of items in cart
   * @returns {Promise<number>}
   */
  async getNumberOfItemsInCart() {
    try {
      const items = this.page.locator(this.selectors.cartItems);
      return await items.count();
    } catch {
      return 0;
    }
  }

  /**
   * Get cart items details
   * @returns {Promise<Array>}
   */
  async getCartItemsDetails() {
    const items = [];
    try {
      const cartItems = this.page.locator(this.selectors.cartItems);
      const count = await cartItems.count();

      for (let i = 0; i < count; i++) {
        const item = cartItems.nth(i);
        
        const name = await this.getItemText(item, this.selectors.productName);
        const price = await this.getItemText(item, this.selectors.productPrice);
        const quantity = await this.getItemQuantity(item);

        items.push({
          name,
          price,
          quantity,
          index: i
        });
      }
    } catch (error) {
      console.error('Error getting cart items details:', error);
    }
    
    return items;
  }

  /**
   * Get text from item element
   * @param {Object} item - Item locator
   * @param {string} selector - Selector within item
   * @returns {Promise<string>}
   */
  async getItemText(item, selector) {
    try {
      const element = item.locator(selector);
      const text = await element.textContent();
      return text?.trim() || '';
    } catch {
      return '';
    }
  }

  /**
   * Get item quantity
   * @param {Object} item - Item locator
   * @returns {Promise<number>}
   */
  async getItemQuantity(item) {
    try {
      const quantityInput = item.locator(this.selectors.productQuantity);
      if (await quantityInput.count() > 0) {
        const value = await quantityInput.getAttribute('value');
        return parseInt(value || '1', 10);
      }
      return 1;
    } catch {
      return 1;
    }
  }

  /**
   * Update item quantity
   * @param {number} itemIndex - Index of item to update
   * @param {number} quantity - New quantity
   */
  async updateItemQuantity(itemIndex, quantity) {
    try {
      const items = this.page.locator(this.selectors.cartItems);
      const item = items.nth(itemIndex);
      
      const quantityInput = item.locator(this.selectors.productQuantity);
      await quantityInput.fill(quantity.toString());
      
      // Click update button if available
      const updateButton = item.locator(this.selectors.updateButton);
      if (await updateButton.count() > 0) {
        await updateButton.click();
      }
      
      await this.page.waitForTimeout(1000); // Wait for update
    } catch (error) {
      throw new Error(`Failed to update item quantity: ${error.message}`);
    }
  }

  /**
   * Increase item quantity
   * @param {number} itemIndex - Index of item
   */
  async increaseItemQuantity(itemIndex) {
    try {
      const items = this.page.locator(this.selectors.cartItems);
      const item = items.nth(itemIndex);
      
      const increaseButton = item.locator(this.selectors.quantityIncreaseButton);
      await increaseButton.click();
      
      await this.page.waitForTimeout(1000); // Wait for update
    } catch (error) {
      throw new Error(`Failed to increase item quantity: ${error.message}`);
    }
  }

  /**
   * Decrease item quantity
   * @param {number} itemIndex - Index of item
   */
  async decreaseItemQuantity(itemIndex) {
    try {
      const items = this.page.locator(this.selectors.cartItems);
      const item = items.nth(itemIndex);
      
      const decreaseButton = item.locator(this.selectors.quantityDecreaseButton);
      await decreaseButton.click();
      
      await this.page.waitForTimeout(1000); // Wait for update
    } catch (error) {
      throw new Error(`Failed to decrease item quantity: ${error.message}`);
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemIndex - Index of item to remove
   */
  async removeItemFromCart(itemIndex) {
    try {
      const items = this.page.locator(this.selectors.cartItems);
      const item = items.nth(itemIndex);
      
      const removeButton = item.locator(this.selectors.removeButton);
      await removeButton.click();
      
      // Wait for item to be removed
      await this.page.waitForTimeout(2000);
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }

  /**
   * Get cart total
   * @returns {Promise<string>}
   */
  async getCartTotal() {
    try {
      const totalElement = this.page.locator(this.selectors.cartTotal);
      if (await totalElement.isVisible()) {
        const text = await totalElement.textContent();
        return text?.trim() || '£0.00';
      }
      return '£0.00';
    } catch {
      return '£0.00';
    }
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    const checkoutSelectors = [
      this.selectors.checkoutButton,
      this.selectors.proceedToCheckoutButton,
      'button:has-text("Checkout")',
      'a:has-text("Checkout")',
      '.checkout-btn'
    ];

    for (const selector of checkoutSelectors) {
      try {
        const button = this.page.locator(selector);
        if (await button.isVisible()) {
          await button.click();
          await this.waitForPageLoad();
          return;
        }
      } catch {
        continue;
      }
    }
    
    throw new Error('Could not find checkout button');
  }

  /**
   * Clear cart (remove all items)
   */
  async clearCart() {
    try {
      const itemCount = await this.getNumberOfItemsInCart();
      
      // Remove items one by one starting from the last
      for (let i = itemCount - 1; i >= 0; i--) {
        await this.removeItemFromCart(i);
        await this.page.waitForTimeout(1000); // Wait between removals
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  /**
   * Check if confirmation message is visible
   * @returns {Promise<boolean>}
   */
  async isConfirmationMessageVisible() {
    try {
      return await this.page.locator(this.selectors.confirmationMessage).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get confirmation message text
   * @returns {Promise<string>}
   */
  async getConfirmationMessage() {
    try {
      const message = this.page.locator(this.selectors.confirmationMessage);
      if (await message.isVisible()) {
        return await message.textContent() || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Check if product exists in cart
   * @param {string} productName - Product name to search for
   * @returns {Promise<boolean>}
   */
  async isProductInCart(productName) {
    try {
      const items = await this.getCartItemsDetails();
      return items.some(item => 
        item.name.toLowerCase().includes(productName.toLowerCase())
      );
    } catch {
      return false;
    }
  }

  /**
   * Apply coupon code
   * @param {string} couponCode - Coupon code to apply
   */
  async applyCoupon(couponCode) {
    try {
      const couponSelectors = [
        'input[name="coupon_code"]',
        'input[placeholder*="coupon"]',
        'input[placeholder*="discount"]',
        '.coupon-input'
      ];

      let couponInput = null;
      for (const selector of couponSelectors) {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          couponInput = element;
          break;
        }
      }

      if (couponInput) {
        await couponInput.fill(couponCode);
        
        const applyButton = this.page.locator('button:has-text("Apply"), .apply-coupon');
        if (await applyButton.isVisible()) {
          await applyButton.click();
          await this.page.waitForTimeout(2000); // Wait for coupon to apply
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  }
}

module.exports = ShoppingCartPage;