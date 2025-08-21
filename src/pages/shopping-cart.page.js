// src/pages/shopping-cart.page.js
import BasePage from './base.page.js';
import { test } from '@playwright/test';

/**
 * Shopping Cart Page Object
 * Represents the shopping cart functionality
 */
class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);

    // Cart selectors - updated based on actual PerfectDraft website inspection
    this.selectors = {
      cartIcon: '.counter.qty, .minicart-wrapper, .cart-icon, button:has-text("£")',
      cartCounter: '.counter.qty .counter-number, .counter-number, .badge, a[href*="/cart/"] generic, a[href*="/checkout/cart/"] generic',
      emptyCartMessage: ':has-text("Your cart is empty"), :has-text("You have no items")',
      cartItems: '.cart-items-list > .cart-product-container > .cart-product', // Each cart item is a cart product
      productName: 'h3', // Product name is in h3 heading within the cart item
      productImage: 'img', // Product image is img element within cart item  
      productQuantity: 'input[name="quantity"]',
      quantityIncreaseButton: 'button[aria-label="Increase Quantity"], .cart-product-add',
      quantityDecreaseButton: 'button[aria-label="Decrease Quantity"], .cart-product-subtract',
      productPrice: '.cart-product-unit-price > span', // Price is in generic element containing £
      removeButton: 'button:has-text("Remove Item")',
      updateButton: '.action.update, .update-item, button:has-text("Update")',
      viewCartButton: '.action.viewcart, .view-cart, button:has-text("View Cart")',
      cartDropdown: '.minicart-content, .cart-dropdown, .dropdown-menu, div[role="dialog"]',
      cartTotal: '.order-summary-subtotal > p', // Total from order summary
      confirmationMessage: '.message.success, .alert.success, .notification.success',
      checkoutButton: 'button[aria-label="Checkout"]',
      proceedToCheckoutButton: 'button:has-text("Secure checkout"), button:has-text("Secure Checkout")'
    };
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    try {
      // Check for the specific empty cart message used on PerfectDraft
      const emptyMessage = this.page.locator(':has-text("Your basket is currently empty")');
      if (await emptyMessage.isVisible({ timeout: 2000 })) {
        return true;
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
   * Open cart page by clicking cart icon
   */
  async openCart() {

    try {

      await this.page.locator('.minicart-popover')
        .first()
        .waitFor({ state: 'visible', timeout: 5000 });

      await this.page.locator('.popover-actions button')
        .getByText('View Cart')
        .first()
        .click();


      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      await this.page.locator('.block-loader')
        .waitFor({ state: 'hidden', timeout: 10000 })
        .catch(() => { });
    } catch (error) {
      throw new Error(`Failed to open cart: ${error.message}`);
    }
  }

  /**
   * View full cart page
   */
  async viewFullCart() {
    // Direct navigation is more reliable for viewing full cart
    await this.page.goto('https://www.perfectdraft.com/en-gb/checkout/cart/');
    await this.waitForPageLoad();
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
        const image = await this.getImage(item)

        items.push({
          name,
          price,
          quantity,
          image,
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
      // Try multiple selectors
      const selectors = selector.split(', ');

      for (const sel of selectors) {
        try {
          const element = item.locator(sel.trim());
          const count = await element.count();
          if (count > 0) {
            const text = await element.first().textContent();
            if (text && text.trim()) {
              console.log(`Found text "${text}" using selector "${sel}"`);
              return text.trim();
            }
          }
        } catch {
          continue;
        }
      }

      console.log(`No text found for selectors: ${selector}`);
      return '';
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
        // Wait for the input value to be available and not empty
        await quantityInput.waitFor({ state: 'visible', timeout: 5000 });

        // Use inputValue() instead of getAttribute('value') for better DOM sync
        const value = await quantityInput.inputValue();
        return parseInt(value || '1', 10);
      }
      return 1;
    } catch {
      return 1;
    }
  }

  /**
   * Get item image
   * @param {Object} item - Item locator
   * @returns {Promise<string>}
   */
  async getImage(item) {
    try {
      const image = item.locator(this.selectors.productImage);
      if (await quantityInput.count() > 0) {
        const value = await quantityInput.getAttribute('src');
        return value;
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

      // Wait for cart to update
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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

      // Wait for cart to update
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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

      // Wait for cart to update
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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

      // Wait for confirmation modal and click "Bin it" to confirm removal
      const binItButton = this.page.locator('button:has-text("Bin it")');
      await binItButton.waitFor({ state: 'visible', timeout: 5000 });
      await binItButton.click();

      // Wait for item to be removed
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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
    // Use the specific checkout button selector
    const checkoutButton = this.page.locator('button:has-text("Checkout")').first();

    if (await checkoutButton.isVisible({ timeout: 5000 })) {
      await checkoutButton.click();
      await this.waitForPageLoad();
    } else {
      throw new Error('Could not find checkout button');
    }
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
        await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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
      // First, try traditional confirmation message selectors
      const traditionalConfirmation = this.page.locator(this.selectors.confirmationMessage);
      if (await traditionalConfirmation.isVisible()) {
        return true;
      }

      // For PerfectDraft website - check if cart counter shows items (non-zero)
      // This indicates successful add to cart action since PerfectDraft doesn't show traditional confirmation messages
      const cartCounter = await this.getCartItemCount();
      const counterValue = parseInt(cartCounter) || 0;

      // If cart counter is greater than 0, consider this as confirmation
      // This matches the actual behavior of the PerfectDraft website
      if (counterValue > 0) {
        return true;
      }

      return false;
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
      // Use the specific coupon input selector
      const couponInput = this.page.locator('input[name="coupon_code"]');

      if (await couponInput.isVisible({ timeout: 3000 })) {
        await couponInput.fill(couponCode);

        const applyButton = this.page.locator('button:has-text("Apply")');
        if (await applyButton.isVisible()) {
          await applyButton.click();
          await this.page.waitForLoadState('networkidle', { timeout: 5000 });
          await this.page.locator('.block-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
        }
      } else {
        console.log('Coupon input field not found');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  }
}

export default ShoppingCartPage;
