// src/steps/shopping-cart.steps.js
const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const ShoppingCartPage = require('../pages/shopping-cart.page');
const ProductCatalogPage = require('../pages/product-catalog.page');
const HomePage = require('../pages/home.page');
const WaitHelpers = require('../helpers/wait-helpers');

const { Given, When, Then } = createBdd();

// Cart state setup steps
Given('my cart is empty', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);

  // Check if cart is already empty
  const isEmpty = await cartPage.isCartEmpty();

  if (!isEmpty) {
    try {
      // Clear the cart
      await cartPage.clearCart();
    } catch (error) {
      console.log('Could not clear cart automatically, cart might already be empty');
    }
  }

  // Verify cart is empty
  const cartCount = await cartPage.getCartItemCount();
  expect(cartCount, 'Cart should be empty').toBe('0');
});

Given('I have {string} in my cart', async ({ page }, productName) => {
  const homePage = new HomePage(page);
  const catalogPage = new ProductCatalogPage(page);

  // Navigate to kegs section and add product
  await homePage.navigateToSection('Kegs');
  await catalogPage.addProductToCart(productName);

  // Wait for cart counter to update
  await WaitHelpers.waitForCartCounterUpdate(page, 1);

  // Verify product was added
  const cartPage = new ShoppingCartPage(page);
  const cartCount = await cartPage.getCartItemCount();
  expect(parseInt(cartCount) || 0, 'Cart should have at least 1 item').toBeGreaterThan(0);
});

// Add to cart steps
When('I add {string} to the cart', async ({ page }, productName) => {
  const catalogPage = new ProductCatalogPage(page);
  
  // Get initial cart count
  const cartPage = new ShoppingCartPage(page);
  const initialCount = parseInt(await cartPage.getCartItemCount()) || 0;
  
  await catalogPage.addProductToCart(productName);

  // Wait for cart counter to update
  await WaitHelpers.waitForCartCounterUpdate(page, initialCount + 1);
});

Then('I should see a confirmation message', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);

  // Wait for any loading to complete
  await WaitHelpers.waitForLoadingToComplete(page);

  const hasConfirmation = await cartPage.isConfirmationMessageVisible();
  expect(hasConfirmation, 'Should see confirmation message after adding to cart').toBeTruthy();
});

// Cart interaction steps
When('I click on the cart icon', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);
  await cartPage.openCart();
});

When('I view my cart', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);
  await cartPage.viewFullCart();
});

Then('I should see the cart contents with:', async ({ page }, dataTable) => {
  const expectedCartInfo = dataTable.hashes().map(row => row['Cart Information']);
  const cartPage = new ShoppingCartPage(page);

  // Wait for cart items to be visible
  await WaitHelpers.waitForCartItems(page);
  
  // Get cart items details
  const cartItems = await cartPage.getCartItemsDetails();
  expect(cartItems.length, 'Cart should have at least 1 item').toBeGreaterThan(0);

  const firstItem = cartItems[0];

  for (const info of expectedCartInfo) {
    switch (info) {
      case 'Product name':
        expect(firstItem.name, 'Product should have a name').toBeTruthy();
        break;
      case 'Product image':
        // Check if cart has product images - look for images within cart items
        expect(firstItem.image, 'Cart should show product images').toBeDefined();
        break;
      case 'Quantity':
        expect(firstItem.quantity, 'Product should have quantity').toBeGreaterThan(0);
        break;
      case 'Unit price':
        expect(firstItem.price, 'Product should have price').toBeTruthy();
        break;
      case 'Total price':
        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal, 'Cart should show total price').toBeTruthy();
        break;
    }
  }
});

// Cart modification steps
When('I increase the quantity to {string}', async ({ page }, newQuantity) => {
  const cartPage = new ShoppingCartPage(page);
  const quantity = parseInt(newQuantity, 10);

  // Get the first cart item
  const cartItem = page.locator(cartPage.selectors.cartItems).first();
  
  // Find quantity input within the cart item
  const quantityInput = cartItem.locator('input[type="number"], input[data-role="cart-item-qty"]').first();

  try {
    // Update quantity
    await cartPage.updateItemQuantity(0, quantity);
    
    // Use Playwright's built-in expect to wait for value change
    await expect(quantityInput).toHaveValue(quantity.toString(), { timeout: 10000 });
  } catch (error) {
    console.log('Direct update failed, trying increase button method:', error.message);
    
    // Alternative: use increase button multiple times
    const currentItems = await cartPage.getCartItemsDetails();
    const currentQuantity = currentItems[0]?.quantity || 1;
    const increaseCount = quantity - currentQuantity;

    for (let i = 0; i < increaseCount; i++) {
      await cartPage.increaseItemQuantity(0);
      // Wait for network to settle after each click
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    }
    
    // Verify the quantity updated
    await expect(quantityInput).toHaveValue(quantity.toString(), { timeout: 10000 });
  }
});

Then('the cart should show quantity of at least {string}', async ({ page }, expectedQuantity) => {
  const cartPage = new ShoppingCartPage(page);
  const quantity = parseInt(expectedQuantity, 10);

  // Wait for cart items to update
  await WaitHelpers.waitForLoadingToComplete(page);
  await WaitHelpers.waitForCartItems(page);

  const cartItems = await cartPage.getCartItemsDetails();
  const actualQuantity = cartItems[0]?.quantity || 0;

  expect(actualQuantity, `Cart quantity should be ${quantity}`).toBeGreaterThanOrEqual(quantity);
});

Then('the cart should show quantity {string}', async ({ page }, expectedQuantity) => {
  const cartPage = new ShoppingCartPage(page);
  const quantity = parseInt(expectedQuantity, 10);

  // Wait for cart items to update
  await WaitHelpers.waitForLoadingToComplete(page);
  await WaitHelpers.waitForCartItems(page);

  const cartItems = await cartPage.getCartItemsDetails();
  const actualQuantity = cartItems[0]?.quantity || 0;

  expect(actualQuantity, `Cart quantity should be ${quantity}`).toBe(quantity);
});

Then('the total price should be updated accordingly', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);

  // Wait for price update
  await WaitHelpers.waitForLoadingToComplete(page);
  await WaitHelpers.waitForNetworkIdle(page);

  const cartTotal = await cartPage.getCartTotal();
  expect(cartTotal, 'Cart total should be updated').toBeTruthy();
  expect(cartTotal, 'Cart total should not be £0.00').not.toBe('£0.00');
});

When('I click {string} for the item', async ({ page }, action) => {
  const cartPage = new ShoppingCartPage(page);

  if (action === 'Remove') {
    await cartPage.removeItemFromCart(0); // Remove first item
  }
});

Then('the cart should be empty', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);

  // Wait for removal to complete
  await WaitHelpers.waitForLoadingToComplete(page);
  await WaitHelpers.waitForNetworkIdle(page);

  const isEmpty = await cartPage.isCartEmpty();
  expect(isEmpty, 'Cart should be empty after removing all items').toBeTruthy();
});

// Cart counter steps
Then('the cart counter should show quantity of at least {string}', async ({ page }, minQuantity) => {
  const cartPage = new ShoppingCartPage(page);
  const expectedMin = parseInt(minQuantity, 10);
  
  // Wait for counter to update
  await WaitHelpers.waitForCartCounterUpdate(page, expectedMin);
  
  // Use the base page method to check cart counter
  await cartPage.assertCartCounterAtLeast(expectedMin);
});
