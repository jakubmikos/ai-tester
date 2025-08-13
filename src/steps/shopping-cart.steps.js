// src/steps/shopping-cart.steps.js
const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const ShoppingCartPage = require('../pages/shopping-cart.page');
const ProductCatalogPage = require('../pages/product-catalog.page');
const HomePage = require('../pages/home.page');

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
  
  // Wait for product to be added
  await page.waitForTimeout(2000);
  
  // Verify product was added
  const cartPage = new ShoppingCartPage(page);
  const cartCount = await cartPage.getCartItemCount();
  expect(parseInt(cartCount) || 0, 'Cart should have at least 1 item').toBeGreaterThan(0);
});

// Add to cart steps
When('I add {string} to the cart', async ({ page }, productName) => {
  const catalogPage = new ProductCatalogPage(page);
  await catalogPage.addProductToCart(productName);
  
  // Wait for add to cart to complete
  await page.waitForTimeout(2000);
});

// Cart verification steps
Then('the cart counter should show {string} item', async ({ page }, expectedCount) => {
  const cartPage = new ShoppingCartPage(page);
  
  // Wait a bit for cart counter to update
  await page.waitForTimeout(1000);
  
  const actualCount = await cartPage.getCartItemCount();
  expect(actualCount, `Cart counter should show ${expectedCount} item(s)`).toBe(expectedCount);
});

Then('I should see a confirmation message', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);
  
  // Wait for confirmation message
  await page.waitForTimeout(1000);
  
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
        // Check if cart has product images using the correct selector
        const hasImages = await page.locator('.cart-product-image img').count() > 0;
        expect(hasImages, 'Cart should show product images').toBeTruthy();
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
  
  try {
    await cartPage.updateItemQuantity(0, quantity); // Update first item
  } catch {
    // Alternative: use increase button multiple times
    const currentItems = await cartPage.getCartItemsDetails();
    const currentQuantity = currentItems[0]?.quantity || 1;
    const increaseCount = quantity - currentQuantity;
    
    for (let i = 0; i < increaseCount; i++) {
      await cartPage.increaseItemQuantity(0);
      await page.waitForTimeout(500);
    }
  }
});

Then('the cart should show quantity {string}', async ({ page }, expectedQuantity) => {
  const cartPage = new ShoppingCartPage(page);
  
  // Wait for quantity update
  await page.waitForTimeout(1000);
  
  const cartItems = await cartPage.getCartItemsDetails();
  const actualQuantity = cartItems[0]?.quantity || 0;
  
  expect(actualQuantity.toString(), `Cart quantity should be ${expectedQuantity}`).toBe(expectedQuantity);
});

Then('the total price should be updated accordingly', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);
  
  // Wait for price update
  await page.waitForTimeout(1000);
  
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
  await page.waitForTimeout(2000);
  
  const isEmpty = await cartPage.isCartEmpty();
  expect(isEmpty, 'Cart should be empty after removing all items').toBeTruthy();
});

Then('the cart counter should show {string} items', async ({ page }, expectedCount) => {
  const cartPage = new ShoppingCartPage(page);
  
  // Wait for counter update
  await page.waitForTimeout(1000);
  
  const actualCount = await cartPage.getCartItemCount();
  expect(actualCount, `Cart counter should show ${expectedCount} items`).toBe(expectedCount);
});